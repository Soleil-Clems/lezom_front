import { MOCK_SERVERS } from "@/lib/mock-data"
import { notFound } from "next/navigation"

export default async function ServerChannelsPage({ params }: { params: Promise<{ serverId: string }> }) {
  const { serverId } = await params;

  const server = MOCK_SERVERS.find(s => s.id === serverId);

  if (!server) return notFound();

  return (
    <main className="flex-1 flex items-center justify-center bg-[#313338] text-zinc-500">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white mb-2">Bienvenue sur {server.name}</h1>
        <p>Sélectionnez un salon dans la barre latérale pour commencer à discuter.</p>
      </div>
    </main>
  )
}

