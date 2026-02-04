import customfetch from "@/lib/customFetch";


export const createInvitationRequest = async (serverId: string | number, params?: { maxUses?: number | null; expiresIn?: number | null }) => {
    try {
        const response = await customfetch.post(`servers/${serverId}/invitations`, params);
        return response;
    } catch (error) {
        throw error;
    }
};

export const joinServerByCodeRequest = async (code: string) => {
    try {
        const response = await customfetch.post(`servers/join/${code}`);
        return response;
    } catch (error) {
        throw error;
    }
};
