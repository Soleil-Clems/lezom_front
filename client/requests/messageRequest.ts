import { customfetch } from "@/lib/customFetch"
import {sendMessageType} from "@/schemas/message.dto";



export const sendMessageRequest = async (body: sendMessageType) => {
    try {
        const response = await customfetch.post("messages", body)
        return response
    } catch (error) {
        throw error
    }
}

export const updateChannelMessageRequest = async (
    messageId: number,
    body: { content: string }
) => {
    try {
        const response = await customfetch.patch(`messages/${messageId}`, body)
        return response
    } catch (error) {
        throw error
    }
}

export const deleteChannelMessageRequest = async (messageId: number) => {
    try {
        const response = await customfetch.delete(`messages/${messageId}`)
        return response
    } catch (error) {
        throw error
    }
}
