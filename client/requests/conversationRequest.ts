import { customfetch } from "@/lib/customFetch";
import { sendPrivateMessageType, createConversationType } from "@/schemas/conversation.dto";

export const createConversationRequest = async (body: createConversationType) => {
    try {
        const response = await customfetch.post("conversations", body);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllConversationsRequest = async () => {
    try {
        const response = await customfetch.get("conversations");
        return response;
    } catch (error) {
        throw error;
    }
};

export const getConversationByIdRequest = async (id: number) => {
    try {
        const response = await customfetch.get(`conversations/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getConversationMessagesRequest = async (
    id: number,
    page: number = 1,
    limit: number = 50
) => {
    try {
        const response = await customfetch.get(
            `conversations/${id}/messages?page=${page}&limit=${limit}`
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const sendPrivateMessageRequest = async (
    id: number,
    body: { content: string; type: "text" | "img" | "file" | "pdf" }
) => {
    try {
        const response = await customfetch.post(`conversations/${id}/messages`, body);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updatePrivateMessageRequest = async (
    messageId: number,
    body: { content: string }
) => {
    try {
        const response = await customfetch.patch(`conversations/messages/${messageId}`, body);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deletePrivateMessageRequest = async (messageId: number) => {
    try {
        const response = await customfetch.delete(`conversations/messages/${messageId}`);
        return response;
    } catch (error) {
        throw error;
    }
};
