"use client";
import {useGetAllServers} from "@/hooks/queries/useGetAllServers";
import Loading from "@/components/ui-client/Loading";
import Error from "@/components/ui-client/Error";
import {serversType} from "@/schemas/server.dto";

function DefaulScreenComponent({id}: {id: string| number}) {
    const { data:servers, isLoading, isError} = useGetAllServers();

    if (isLoading ) {
        return <Loading/>
    }
    if (isError) {
        return <Error/>
    }

    const server: serversType = servers.find((s: serversType) => s.id.toString() === id.toString());


    return (
        <main className="flex-1 flex items-center justify-center bg-[#313338] text-zinc-500">
            <div className="text-center">
                <h1 className="text-xl font-bold text-white mb-2">Bienvenue sur {server?.name}</h1>
                <p>Sélectionnez un salon dans la barre latérale pour commencer à discuter.</p>
            </div>
        </main>
    );
}

export default DefaulScreenComponent;