import { MOCK_SERVERS } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import Loading from "@/components/ui-client/Loading";
import Error from "@/components/ui-client/Error";
import {useGetAllServers} from "@/hooks/queries/useGetAllServers";
import DefaulScreenComponent from "@/components/ui-client/DefaulScreenComponent";

export default async function ServerChannelsPage({ params }: { params: Promise<{ serverId: string }> }) {
  const { serverId } = await params;


  return (
    <DefaulScreenComponent id={serverId}/>
  )
}

