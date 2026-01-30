"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { registerSchema, registerType } from "@/schema/register.dto"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"



export default function RegisterPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      birthdate: new Date().toISOString().slice(0, 10),
    },
  })

  const onSubmit = async (data: registerType) => {
    console.log("FORM DATA", data)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-own-dark">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-xl shadow bg-card">
        
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Créer un compte
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Rejoignez la communauté Lezom
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <>
                <Input placeholder="Pseudo" {...field} />
                {errors.username && (
                  <p className="text-red-500 text-sm bg-grey-purple hover:bg-destructive">
                    {errors.username.message}
                  </p>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <>
                <Input placeholder="Email" {...field} />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  {...field}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name="birthdate"
            render={({ field }) => (
              <>
                <Input type="date" {...field} />
                {errors.birthdate && (
                  <p className="text-red-500 text-sm">
                    {errors.birthdate.message}
                  </p>
                )}
              </>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full bg-purple-discord hover:bg-gray-400
">
            {isSubmitting ? "Chargement..." : "Continuer"}
          </Button>

          <Button variant="outline" className="w-full bg-purple-discord text-white hover:bg-gray-400 hover:text-white">
            Se connecter
          </Button>
        </form>
      </div>
    </main>
  )
}
