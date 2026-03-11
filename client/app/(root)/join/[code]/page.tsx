"use client"
import { useState, use } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useJoinServer } from "@/hooks/mutations/useInvitation"
import { useGetInvitePreview } from "@/hooks/queries/useGetInvitePreview"
import { Loader2, Users, AlertCircle } from "lucide-react"

type JoinPageProps = {
    params: Promise<{ code: string }>
}

export default function JoinPage({ params }: JoinPageProps) {
    const { code } = use(params)
    const t = useTranslations("invitation")
    const tc = useTranslations("common")
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const { data: preview, isLoading, isError, error: previewError } = useGetInvitePreview(code)
    const joinServer = useJoinServer()

    const handleJoin = () => {
        setError(null)
        joinServer.mutate(code, {
            onSuccess: (data) => {
                router.push(`/servers/${data.server.id}`)
            },
            onError: (err: Error) => {
                setError(err.message || tc("errorOccurred"))
            },
        })
    }

    return (
        <main className="flex-1 flex items-center justify-center bg-[#313338] min-h-screen">
            <Card className="w-full max-w-md bg-[#2b2d31] border-none text-white">
                {isLoading ? (
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                        <p className="text-zinc-400 mt-4 text-sm">{t("loadingInvitation")}</p>
                    </CardContent>
                ) : isError ? (
                    <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-red-400" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-semibold">{t("invalidInvitation")}</h2>
                            <p className="text-zinc-400 text-sm">
                                {(previewError as Error)?.message || t("invalidInvitationDesc")}
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push("/")}
                            variant="ghost"
                            className="text-zinc-400 hover:text-white"
                        >
                            {t("backToHome")}
                        </Button>
                    </CardContent>
                ) : (
                    <>
                        <CardHeader className="flex flex-col items-center text-center pb-2">
                            <p className="text-sm text-zinc-400 mb-4">{t("invitedToJoin")}</p>
                            {preview.server.img ? (
                                <img
                                    src={preview.server.img}
                                    alt={preview.server.name}
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-3xl font-semibold">
                                    {preview.server.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <h2 className="text-2xl font-bold mt-4">{preview.server.name}</h2>
                            <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                                <Users className="h-4 w-4" />
                                <span>{tc("memberCount", { count: preview.server.memberCount })}</span>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-2">
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <Button
                                onClick={handleJoin}
                                disabled={joinServer.isPending}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                            >
                                {joinServer.isPending
                                    ? t("joining")
                                    : t("join", { name: preview.server.name })}
                            </Button>
                        </CardContent>
                    </>
                )}
            </Card>
        </main>
    )
}
