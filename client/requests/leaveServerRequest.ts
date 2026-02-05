import customfetch from "@/lib/customFetch";

export const leaveServerRequest = async (
    serverId: string | number,
    newOwnerId?: number
) => {
    const body = newOwnerId ? { newOwnerId } : {};
    return await customfetch.post(`servers/${serverId}/leave`, body);
};
