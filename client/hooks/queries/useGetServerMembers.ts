"use client"
import { useQuery } from "@tanstack/react-query"
import { getServerMembersRequest } from "@/requests/serverRequest"
import { GetMembersParams, GetMembersResponseType } from "@/schemas/member.dto"

export const useGetServerMembers = (
    serverId: string | number,
    params: GetMembersParams = {}
) => {
    return useQuery<GetMembersResponseType>({
        queryKey: ["serverMembers", serverId, params],
        queryFn: () => getServerMembersRequest(serverId, params),
        enabled: !!serverId,
    })
}
