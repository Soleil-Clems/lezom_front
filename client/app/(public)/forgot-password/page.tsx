'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle } from 'lucide-react';

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
import { ForgotPasswordSchema, type ForgotPasswordType } from '@/schemas/auth.dto';
import { useForgotPassword } from '@/hooks/mutations/useForgotPassword';
import { AuthBackground } from '@/components/ui-client/AuthBackground';

export default function ForgotPasswordPage() {
  const mutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = (values: ForgotPasswordType) => {
    mutation.mutate(values);
  };

  if (mutation.isSuccess) {
    return (
      <div className="dark relative min-h-screen flex items-center justify-center p-4">
        <AuthBackground />
        <Card className="relative z-10 w-full max-w-[440px] p-6 sm:p-8 bg-[#313338] border-white/[0.06] animate-in fade-in-0 zoom-in-95 duration-500">
          <CardHeader className="text-center pb-0">
            <div className="flex justify-center mb-3">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Email envoyé</CardTitle>
            <CardDescription className="text-[#B5BAC1]">
              Si cet email est associé à un compte, tu recevras un lien de réinitialisation dans
              quelques instants.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-6">
            <Link href="/login" className="w-full">
              <Button className="w-full h-11 bg-purple-discord text-white font-medium hover:bg-purple-discord/85 transition-colors">
                Retour à la connexion
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="dark relative min-h-screen flex items-center justify-center p-4">
      <AuthBackground />

      <Card className="relative z-10 w-full max-w-[440px] p-6 sm:p-8 bg-[#313338] border-white/[0.06] animate-in fade-in-0 zoom-in-95 duration-500">
        <CardHeader className="text-center pb-0">
          <div className="flex justify-center mb-3">
            <Image src="/lezom.svg" alt="Lezom" width={48} height={48} className="drop-shadow-lg" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Mot de passe oublié ?</CardTitle>
          <CardDescription className="text-[#B5BAC1]">
            Saisis ton email et on t&apos;envoie un lien pour réinitialiser ton mot de passe.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="pt-6">
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
                autoComplete="email"
                className="bg-[#1E1F22] border-transparent text-white h-10"
              />
              {errors.email && <FieldError errors={[errors.email]} />}
            </Field>
          </CardContent>

          <CardFooter className="flex-col gap-3 pt-2">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-11 bg-purple-discord text-white font-medium hover:bg-purple-discord/85 transition-colors"
            >
              {mutation.isPending && <Loader2 className="animate-spin" />}
              {mutation.isPending ? 'Envoi en cours...' : 'Envoyer le lien'}
            </Button>
            <p className="text-sm text-[#A3A6AA] mt-1">
              <Link href="/login" className="text-[#00A8FC] hover:underline">
                Retour à la connexion
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
