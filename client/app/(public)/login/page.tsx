'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoginSchema, type LoginType } from '@/schemas/auth.dto';
import { useLogin } from '@/hooks/mutations/useLogin';
import useAuthStore from '@/store/authStore';
import { AuthBackground } from '@/components/ui-client/AuthBackground';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { setToken } = useAuthStore();
  const loginMutation = useLogin();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: 'test@gmail.com',
      password: 'testtest',
    },
  });

  const onSubmit = (formValues: LoginType) => {
    if (!captchaToken) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);

    loginMutation.mutate(
      { ...formValues, captchaToken },
      {
        onSuccess: (data) => {
          if (data.requiresTwoFactor) {
            router.replace(`/verify-otp?userId=${data.userId}`);
          } else {
            setToken(data.access_token);
            router.replace('/');
          }
        },
        onError: () => {
          recaptchaRef.current?.reset();
          setCaptchaToken(null);
        },
      },
    );
  };

  return (
    <div className="dark relative min-h-screen flex items-center justify-center p-4">
      <AuthBackground />

      <Card className="relative z-10 w-full max-w-[440px] p-6 sm:p-8 bg-[#313338] border-white/[0.06] animate-in fade-in-0 zoom-in-95 duration-500">
        <CardHeader className="text-center pb-0">
          <div className="flex justify-center mb-3">
            <Image src="/lezom.svg" alt="Lezom" width={48} height={48} className="drop-shadow-lg" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">{t('welcomeBack')}</CardTitle>
          <CardDescription className="text-[#B5BAC1]">{t('welcomeBackDesc')}</CardDescription>
        </CardHeader>

        {/* eslint-disable-next-line react-hooks/refs */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-5">
              <Field data-invalid={!!errors.email}>
                <FieldLabel
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-wide text-[#B5BAC1]"
                >
                  Email <span className="text-red-400">*</span>
                </FieldLabel>
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                  className="bg-[#1E1F22] border-transparent text-white h-10"
                />
                {errors.email && <FieldError errors={[errors.email]} />}
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wide text-[#B5BAC1]"
                >
                  {t('password')} <span className="text-red-400">*</span>
                </FieldLabel>
                <Input
                  {...register('password')}
                  id="password"
                  type="password"
                  aria-invalid={!!errors.password}
                  autoComplete="current-password"
                  className="bg-[#1E1F22] border-transparent text-white h-10"
                />
                {errors.password && <FieldError errors={[errors.password]} />}
              </Field>

              <div className="flex flex-col items-center gap-1">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  theme="dark"
                  onChange={(token) => {
                    setCaptchaToken(token);
                    setCaptchaError(false);
                  }}
                  onExpired={() => setCaptchaToken(null)}
                />
                {captchaError && (
                  <p className="text-red-400 text-xs mt-1">{t('captchaRequired')}</p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3 pt-2">
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-11 bg-purple-discord text-white font-medium hover:bg-purple-discord/85 transition-colors"
            >
              {loginMutation.isPending && <Loader2 className="animate-spin" />}
              {loginMutation.isPending ? t('loggingIn') : t('login')}
            </Button>
            <Link href="/forgot-password" className="text-sm text-[#00A8FC] hover:underline">
              Mot de passe oublié ?
            </Link>
            <p className="text-sm text-[#A3A6AA] mt-1">
              {t('noAccount')}{' '}
              <Link href="/register" className="text-[#00A8FC] hover:underline">
                {t('register')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
