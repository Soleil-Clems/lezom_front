import customfetch from "@/lib/customFetch";
import { CreateServerDto } from "@/schemas/create-server.dto";
import { GetMembersParams, GetMembersResponseType } from "@/schemas/member.dto";

export const serverRequest = async (body: CreateServerDto) => {
    try {
        const response = await customfetch.post("servers", body);
        return response;
    } catch (error) {
        throw error; //
    }
};

export const getAllServersRequest = async () => {
    try {
        const response = await customfetch.get("servers")
        return response
    } catch (error) {
        throw error
    }
}

export const getAllChannelsOfAServerRequest = async (serverId: number | string) => {
    try {
        const url = `channels/server/${serverId}`;
        console.log("Appel API vers :", url); 
        const response = await customfetch.get(url);
        return response;
    } catch (error) {
        throw error;
    }
}



export const updateServerNameRequest = async (serverId: string | number, name: string) => {
    try {
        const response = await customfetch.patch(`servers/${serverId}`, { name });
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteServerRequest = async (serverId: string | number) => {
    try {
        const response = await customfetch.delete(`servers/${serverId}`);
        return response;
    } catch (error) {
        throw error;
    }
}


export const updateChannelNameRequest = async (channelId: string | number, name: string) => {
    try {
        const response = await customfetch.patch(`channels/${channelId}`, { name });
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteChannelRequest = async (channelId: string | number) => {
    try {
        const response = await customfetch.delete(`channels/${channelId}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateMemberRoleRequest = async (
    serverId: string | number,
    memberId: string | number,
    role: "server_member" | "server_admin" | "server_owner"
) => {
    try {
        const response = await customfetch.patch(`servers/${serverId}/members/role`, { memberId, role });
        return response;
    } catch (error) {
        throw error;
    }
}

export const getServerMembersRequest = async (
    serverId: string | number,
    params: GetMembersParams = {}
): Promise<GetMembersResponseType> => {
    try {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);

        const queryString = queryParams.toString();
        const url = `servers/${serverId}/members${queryString ? `?${queryString}` : ''}`;

        const response = await customfetch.get(url);
        return response as GetMembersResponseType;
    } catch (error) {
        throw error;
    }
}