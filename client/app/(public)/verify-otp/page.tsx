"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useVerifyOtp } from "@/hooks/mutations/useVerifyOtp";
import { useResendOtp } from "@/hooks/mutations/useResendOtp";
import useAuthStore from "@/store/authStore";
import { AuthBackground } from "@/components/ui-client/AuthBackground";

export default function VerifyOtpPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = Number(searchParams.get("userId"));
  const { setToken } = useAuthStore();
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!userId) {
      router.replace("/login");
    }
  }, [userId, router]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newCode.join("");
    if (fullCode.length === 6) {
      handleSubmit(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split("");
      setCode(newCode);
      handleSubmit(pasted);
    }
  };

  const handleSubmit = (fullCode: string) => {
    if (verifyMutation.isPending) return;
    verifyMutation.mutate(
      { userId, code: fullCode },
      {
        onSuccess: (data) => {
          setToken(data.access_token);
          router.replace("/");
        },
        onError: () => {
          setCode(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        },
      }
    );
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    resendMutation.mutate({ userId });
    setCooldown(60);
  };

  if (!userId) return null;

  return (
    <div className="dark relative min-h-screen flex items-center justify-center p-4">
      <AuthBackground />

      <Card className="relative z-10 w-full max-w-[440px] p-6 sm:p-8 bg-[#313338] border-white/[0.06] animate-in fade-in-0 zoom-in-95 duration-500">
        <CardHeader className="text-center pb-0">
          <div className="flex justify-center mb-3">
            <Image
              src="/lezom.svg"
              alt="Lezom"
              width={48}
              height={48}
              className="drop-shadow-lg"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {t("verifyOtp")}
          </CardTitle>
          <CardDescription className="text-[#B5BAC1]">
            {t("verifyOtpDesc")}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={verifyMutation.isPending}
                className="w-12 h-14 text-center text-2xl font-bold bg-[#1E1F22] border-transparent text-white focus:border-indigo-500"
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3 pt-2">
          <Button
            type="button"
            disabled={verifyMutation.isPending || code.join("").length < 6}
            onClick={() => handleSubmit(code.join(""))}
            className="w-full h-11 bg-purple-discord text-white font-medium hover:bg-purple-discord/85 transition-colors"
          >
            {verifyMutation.isPending && <Loader2 className="animate-spin" />}
            {verifyMutation.isPending ? t("verifying") : t("verify")}
          </Button>

          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resendMutation.isPending}
            className="text-sm text-[#00A8FC] hover:underline disabled:text-[#A3A6AA] disabled:no-underline transition-colors"
          >
            {cooldown > 0
              ? t("resendIn", { seconds: cooldown })
              : t("resendCode")}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
