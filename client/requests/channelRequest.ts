import customfetch from "@/lib/customFetch";

//
// export const getAllServersRequest = async () => {
//     try {
//         const response = await customfetch.get("servers")
//         return response
//     } catch (error) {
//         throw error
//     }
// }

export const getAllMessagesOfAChannelRequest = async (channelId:number|string) => {
    try {
        const response = await customfetch.get("messages/channel/"+channelId)
        return response
    } catch (error) {
        throw error
    }
}