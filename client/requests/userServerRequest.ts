import customfetch from "@/lib/customFetch";

export const getServerMembersRequest = async (serverId: string | number) => {
    try {
       
        const url = `servers/${serverId}/members`;
        console.log("Appel API (Membres) vers :", url);
        const response = await customfetch.get(url);
        return response;
    } catch (error) {
        throw error;
    }
};