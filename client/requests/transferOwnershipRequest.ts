import customfetch from "@/lib/customFetch";

export const transferOwnershipRequest = async (
    serverId: string | number,
    newOwnerId: number
) => {
    return await customfetch.post(`servers/${serverId}/transfer-ownership`, {
        newOwnerId,
    });
};
