import customfetch from "@/lib/customFetch";


export const getAllServersRequest = async () => {
    try {
        const response = await customfetch.get("servers")
        return response
    } catch (error) {
        throw error
    }
}

export const getAllChannelsOfAServerRequest = async (serverId:number|string) => {
    try {
        const response = await customfetch.get("channels/server/"+serverId)
        // console.log(response)
        return response
    } catch (error) {
        throw error
    }
}