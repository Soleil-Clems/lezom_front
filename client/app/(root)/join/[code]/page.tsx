"use client"
import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useJoinServer } from "@/hooks/mutations/useInvitation"

type JoinPageProps = {
    params: Promise<{ code: string }>
}

export default function JoinPage({ params }: JoinPageProps) {
    const { code } = use(params)
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const joinServer = useJoinServer()

    const handleJoin = () => {
        setError(null)
        joinServer.mutate(code, {
            onSuccess: (data) => {
                router.push(`/servers/${data.server.id}`)
            },
            onError: (err: any) => {
                setError(err.message || "Une erreur est survenue")
            },
        })
    }

    return (
        <main className="flex-1 flex items-center justify-center bg-[#313338] min-h-screen">
            <Card className="w-full max-w-md bg-[#2b2d31] border-none text-white">
                <CardHeader className="text-center">
                    <div className="text-4xl mb-4">🎉</div>
                    <CardTitle className="text-2xl">Invitation</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 text-center">
                    <p className="text-zinc-400">
                        Tu as reçu une invitation à rejoindre un serveur !
                    </p>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleJoin}
                        disabled={joinServer.isPending}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                        {joinServer.isPending ? "Connexion en cours..." : "Rejoindre le serveur"}
                    </Button>
                </CardContent>
            </Card>
        </main>
    )
}
