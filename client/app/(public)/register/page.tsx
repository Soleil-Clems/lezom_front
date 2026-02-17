"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RegisterSchema, type RegisterType } from "@/schemas/auth.dto";
import { useRegister } from "@/hooks/mutations/useRegister";
import { AuthBackground } from "@/components/ui-client/AuthBackground";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      birthdate: "",
    },
  });

  const birthdateValue = watch("birthdate");
  const selectedDate = birthdateValue ? new Date(birthdateValue) : undefined;

  const onSubmit = (formValues: RegisterType) => {
    registerMutation.mutate(formValues, {
      onSuccess: () => {
        router.replace("/login");
      },
    });
  };

  return (
    <div className="dark relative min-h-screen flex items-center justify-center p-4">
      <AuthBackground />

      <Card className="relative z-10 w-full max-w-[480px] p-6 sm:p-8 bg-[#313338] border-white/[0.06] animate-in fade-in-0 zoom-in-95 duration-500">
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
            Créer un compte
          </CardTitle>
          <CardDescription className="text-[#B5BAC1]">
            Rejoins la communauté Lezom
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field data-invalid={!!errors.firstname}>
                  <FieldLabel
                    htmlFor="firstname"
                    className="text-xs font-bold uppercase tracking-wide text-[#B5BAC1]"
                  >
                    Prénom <span className="text-red-400">*</span>
                  </FieldLabel>
                  <Input
                    {...register("firstname")}
                    id="firstname"
                    aria-invalid={!!errors.firstname}
                    autoComplete="given-name"
                    placeholder="John"
                    className="bg-[#1E1F22] border-transparent text-white h-10"
                  />
                  {errors.firstname && (
                    <FieldError errors={[errors.firstname]} />
                  )}
                </Field>

                <Field data-invalid={!!errors.lastname}>
                  <FieldLabel
                    htmlFor="lastname"
                    className="text-xs font-bold uppercase tracking-wide text-[#B5BAC1]"
                  >
                    Nom <span className="text-red-400">*</span>
                  </FieldLabel>
                  <Input
                    {...register("lastname")}
                    id="lastname"
                    aria-invalid={!!errors.lastname}
                    autoComplete="family-name"
                    placeholder="Doe"
                    className="bg-[#1E1F22] border-transparent text-white h-10"
                  />
                  {errors.lastname && (
                    <FieldError errors={[errors.lastname]} />
                  )}
                </Field>
              </div>

              <Field data-invalid={!!errors.username}>
                <FieldLabel
                  htmlFor="username"
                  className="text-xs font-bold uppercase tracking-wide text-[#B5BAC1]"
                >
                  Pseudo <span className="text-red-400">*</span>
                </FieldLabel>
                <Input
                  {...register("username")}
                  id="username"
                  aria-invalid={!!errors.username}
                  autoComplete="username"
                  placeholder="johndoe"
                  className="bg-[#1E1F22] border-transparent text-white h-10"
                />
                {errors.username && (
                  <FieldError errors={[errors.username]} />
                )}
              </Field>

              <Field data-invalid={!!errors.email}>
                <FieldLabel
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-wide text-[#B5BAC1]"
                >
                  Email <span className="text-red-400">*</span>
                </FieldLabel>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                  placeholder="johndoe@gmail.com"
                  className="bg-[#1E1F22] border-transparent text-white h-10"
                />
                {errors.email && <FieldError errors={[errors.email]} />}
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wide text-[#B5BAC1]"
                >
                  Mot de passe <span className="text-red-400">*</span>
                </FieldLabel>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  aria-invalid={!!errors.password}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="bg-[#1E1F22] border-transparent text-white h-10"
                />
                {errors.password && (
                  <FieldError errors={[errors.password]} />
                )}
              </Field>

              <Field data-invalid={!!errors.birthdate}>
                <FieldLabel className="text-xs font-bold uppercase tracking-wide text-[#B5BAC1]">
                  Date de naissance <span className="text-red-400">*</span>
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full h-10 justify-start bg-[#1E1F22] border-transparent text-left font-normal ${
                        !birthdateValue ? "text-muted-foreground" : "text-white"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {selectedDate
                        ? format(selectedDate, "d MMMM yyyy", { locale: fr })
                        : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setValue(
                            "birthdate",
                            format(date, "yyyy-MM-dd"),
                            { shouldValidate: true },
                          );
                        }
                      }}
                      defaultMonth={selectedDate}
                      captionLayout="dropdown"
                      startMonth={new Date(1900, 0)}
                      endMonth={new Date()}
                      disabled={{ after: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.birthdate && (
                  <FieldError errors={[errors.birthdate]} />
                )}
              </Field>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3 pt-2">
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-11 bg-purple-discord text-white font-medium hover:bg-purple-discord/85 transition-colors"
            >
              {registerMutation.isPending && (
                <Loader2 className="animate-spin" />
              )}
              {registerMutation.isPending
                ? "Création..."
                : "Créer mon compte"}
            </Button>
            <p className="text-sm text-[#A3A6AA] mt-1">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-[#00A8FC] hover:underline">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
