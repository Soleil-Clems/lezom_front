"use client";

import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input";
import {LoginSchema} from "@/schemas/auth.dto";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {useLogin} from "@/hooks/mutations/useLogin";
import useAuthStore from "@/store/authStore";
import {useRouter} from "next/navigation";

export default function Page() {
    const router = useRouter();
    const {setToken} = useAuthStore()
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "test@gmail.com",
            password: "testtest"
        }
    })
    const loginMutation = useLogin();

    const onSubmit = (formValues: z.infer<typeof LoginSchema>) => {
        loginMutation.mutate(formValues, {
            onSuccess: (data) => {
                console.log(data.access_token);
                setToken(data.access_token);
                router.replace("/profil")

            }
        })

    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-own-dark">
            <Card className="w-full max-w-md p-6 sm:p-8 rounded-xl shadow bg-card">
                <CardHeader>
                    <CardTitle className="mb-6 text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold">Bon retour</h1>
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm text-gray-500">
                        On est content de te revoir !
                    </CardDescription>
                </CardHeader>

                <form id="loginform" onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor='email'>Email <span
                                                className='text-sm flex items-start text-gray-500'>*</span></FieldLabel>
                                            <Input
                                                {...field}
                                                id="email"
                                                aria-invalid={fieldState.invalid}
                                                placeholder='johndoe@gmail.com'
                                                autoComplete='off'
                                                type='email'
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={([fieldState.error])}/>
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Controller
                                        name="password"
                                        control={form.control}
                                        render={({field, fieldState}) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor='password'>Mot de passe<span
                                                    className='text-sm flex items-start  text-gray-500'>*</span></FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="password"
                                                    type="password"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder='**********'
                                                    autoComplete='off'
                                                    className='flex items-center'
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={([fieldState.error])}/>
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Mot de passe oublié?
                                </a>

                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex-col gap-2 mt-5">
                        <Button form="loginform" type="submit"
                                className="w-full bg-purple-discord text-white hover:bg-gray-400 hover:text-white">
                            Connexion
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
