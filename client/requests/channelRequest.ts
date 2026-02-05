import customfetch from "@/lib/customFetch";
import {channelSchema, createChannelType} from "@/schemas/channel.dto";
import z from "zod";

//
// export const getAllServersRequest = async () => {
//     try {
//         const response = await customfetch.get("servers")
//         return response
//     } catch (error) {
//         throw error
//     }
// }

export const channelRequest = async (body: createChannelType) => {
    try {
        const response = await customfetch.post("channels", body)
        return response
    } catch (error) {
        throw error
    }
}

export const getAllMessagesOfAChannelRequest = async (channelId:number|string) => {
    try {
        const response = await customfetch.get("messages/channel/"+channelId)
        return response
    } catch (error) {
        throw error
    }
}