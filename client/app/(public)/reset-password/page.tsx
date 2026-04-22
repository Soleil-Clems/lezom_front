'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
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
import { ResetPasswordSchema, type ResetPasswordType } from '@/schemas/auth.dto';
import { useResetPassword } from '@/hooks/mutations/useResetPassword';
import { AuthBackground } from '@/components/ui-client/AuthBackground';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const mutation = useResetPassword();

  useEffect(() => {
    if (!token) router.replace('/login');
  }, [token, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = (values: ResetPasswordType) => {
    if (!token) return;
    mutation.mutate({ token, password: values.password });
  };

  if (!token) return null;

  if (mutation.isSuccess) {
    return (
      <div className="dark relative min-h-screen flex items-center justify-center p-4">
        <AuthBackground />
        <Card className="relative z-10 w-full max-w-[440px] p-6 sm:p-8 bg-[#313338] border-white/[0.06] animate-in fade-in-0 zoom-in-95 duration-500">
          <CardHeader className="text-center pb-0">
            <div className="flex justify-center mb-3">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Mot de passe modifié !</CardTitle>
            <CardDescription className="text-[#B5BAC1]">
              Ton mot de passe a été réinitialisé avec succès. Tu peux te reconnecter.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-6">
            <Link href="/login" className="w-full">
              <Button className="w-full h-11 bg-purple-discord text-white font-medium hover:bg-purple-discord/85 transition-colors">
                Se connecter
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
          <CardTitle className="text-2xl font-bold text-white">Nouveau mot de passe</CardTitle>
          <CardDescription className="text-[#B5BAC1]">
            Choisis un nouveau mot de passe sécurisé pour ton compte.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-5">
              <Field data-invalid={!!errors.password}>
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wide text-[#B5BAC1]"
                >
                  Nouveau mot de passe <span className="text-red-400">*</span>
                </FieldLabel>
                <Input
                  {...register('password')}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className="bg-[#1E1F22] border-transparent text-white h-10"
                />
                {errors.password && <FieldError errors={[errors.password]} />}
              </Field>

              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel
                  htmlFor="confirmPassword"
                  className="text-xs font-bold uppercase tracking-wide text-[#B5BAC1]"
                >
                  Confirmer le mot de passe <span className="text-red-400">*</span>
                </FieldLabel>
                <Input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="bg-[#1E1F22] border-transparent text-white h-10"
                />
                {errors.confirmPassword && <FieldError errors={[errors.confirmPassword]} />}
              </Field>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3 pt-2">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-11 bg-purple-discord text-white font-medium hover:bg-purple-discord/85 transition-colors"
            >
              {mutation.isPending && <Loader2 className="animate-spin" />}
              {mutation.isPending ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
