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
