"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Loader2, Settings2, Server, ArrowLeft, UserX } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { ManagementCard } from "@/components/ui-client/managementcard"
import { BanModalContent } from "@/components/ui-client/banModal"
import { ServerChannelsList } from "@/components/ui-client/serverChannelsList"
import { ServerBannedUsersList } from "@/components/ui-client/serverBannedUsersList"
import { ServerMembersList } from "@/components/ui-client/serverMemberList"
import { useAuthUser } from "@/hooks/queries/useAuthUser"
import { useGetAllServers } from "@/hooks/queries/useGetAllServers"
import { useUpdateServer, useDeleteServer } from "@/hooks/mutations/updateServerSettings"
import { useBanUser } from "@/hooks/mutations/useBanManagement"

type MemberToBan = {
    id: number
    username: string
} | null

export default function SettingsPage() {
    const router = useRouter()
    const params = useParams()
    const serverId = params.serverId as string

    const { data: user, isLoading: authLoading } = useAuthUser()
    const { data: allServersData, isLoading: serversLoading } = useGetAllServers()

    const updateServer = useUpdateServer()
    const deleteServer = useDeleteServer()
    const banUser = useBanUser()

    const [banModalOpen, setBanModalOpen] = useState(false)
    const [memberToBan, setMemberToBan] = useState<MemberToBan>(null)

    if (authLoading || serversLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#313338]">
                <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
            </div>
        )
    }

    const allServers = Array.isArray(allServersData) ? allServersData : (allServersData as any)?.data || []
    const currentServer = allServers.find((s: any) => s.id.toString() === serverId)

    if (!currentServer) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#313338] text-white">
                <p>Serveur non trouvé</p>
                <Button variant="ghost" onClick={() => router.back()} className="mt-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour
                </Button>
            </div>
        )
    }

    const currentUserMembership = currentServer.memberships?.find(
        (m: any) => m.members?.id === user?.id
    )
    const currentUserRole = currentUserMembership?.role
    const isOwner = currentUserRole === "server_owner"

    const handleOpenBanModal = (member: { id: number; username: string }) => {
        setMemberToBan(member)
        setBanModalOpen(true)
    }

    const handleConfirmBan = (reason?: string) => {
        if (memberToBan) {
            banUser.mutate(
                { serverId: currentServer.id, userId: memberToBan.id, reason },
                {
                    onSuccess: () => {
                        setBanModalOpen(false)
                        setMemberToBan(null)
                    },
                }
            )
        }
    }

    const handleCancelBan = () => {
        setBanModalOpen(false)
        setMemberToBan(null)
    }

    return (
        <div className="flex-1 bg-[#313338] h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8 space-y-8">
                <header className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3 text-white">
                        <Settings2 className="w-8 h-8 text-zinc-400" />
                        <h1 className="text-2xl font-bold">Paramètres</h1>
                    </div>
                    <Button variant="ghost" onClick={() => router.back()} className="text-zinc-400">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
                    </Button>
                </header>

                <Tabs defaultValue="servers">
                    <TabsList className="bg-[#1E1F22] mb-6">
                        <TabsTrigger value="servers" className="px-10">Serveurs</TabsTrigger>
                        <TabsTrigger value="channels" className="px-10">Salons</TabsTrigger>
                        <TabsTrigger value="members" className="px-10">Membres</TabsTrigger>
                    </TabsList>

                    <TabsContent value="servers" className="space-y-4 outline-none">
                        <ManagementCard
                            key={currentServer.id}
                            id={currentServer.id}
                            label="Nom du serveur"
                            initialValue={currentServer.name}
                            type="server"
                            onSave={(newName: string) => updateServer.mutate({ id: currentServer.id, name: newName })}
                            onDelete={() => deleteServer.mutate(currentServer.id)}
                            isPending={updateServer.isPending || deleteServer.isPending}
                            isOwner={isOwner}
                        />
                    </TabsContent>

                    <TabsContent value="channels" className="space-y-8 outline-none">
                        <div className="bg-[#2B2D31] rounded-xl border border-white/5 overflow-hidden">
                            <div className="bg-[#1E1F22] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                                <Server size={14} className="text-indigo-400" />
                                <span className="text-xs font-bold uppercase text-zinc-300 tracking-wider">
                                    {currentServer.name}
                                </span>
                            </div>
                            <ServerChannelsList serverId={currentServer.id} isOwner={isOwner} />
                        </div>
                    </TabsContent>

                    <TabsContent value="members" className="space-y-8 outline-none">
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Server size={18} className="text-indigo-400" />
                                Membres du serveur
                            </h2>
                            <div className="bg-[#2B2D31] rounded-xl border border-white/5 overflow-hidden mb-4">
                                <div className="bg-[#1E1F22] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                                    <Server size={14} className="text-indigo-400" />
                                    <span className="text-xs font-bold uppercase text-zinc-300 tracking-wider">
                                        {currentServer.name}
                                    </span>
                                </div>
                                <ServerMembersList
                                    serverId={currentServer.id}
                                    currentUserId={user?.id}
                                    currentUserRole={currentUserRole}
                                    onOpenBanModal={handleOpenBanModal}
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <UserX size={18} className="text-rose-400" />
                                Utilisateurs bannis
                            </h2>
                            <div className="bg-[#2B2D31] rounded-xl border border-white/5 overflow-hidden mb-4">
                                <div className="bg-[#1E1F22] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                                    <Server size={14} className="text-indigo-400" />
                                    <span className="text-xs font-bold uppercase text-zinc-300 tracking-wider">
                                        {currentServer.name}
                                    </span>
                                </div>
                                <ServerBannedUsersList serverId={currentServer.id} />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <Dialog open={banModalOpen} onOpenChange={setBanModalOpen}>
                    {memberToBan && (
                        <BanModalContent
                            username={memberToBan.username}
                            onConfirm={handleConfirmBan}
                            onCancel={handleCancelBan}
                            isPending={banUser.isPending}
                        />
                    )}
                </Dialog>
            </div>
        </div>
    )
}
