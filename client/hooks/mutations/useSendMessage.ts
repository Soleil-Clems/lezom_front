"use client"

import { sendMessageRequest } from "@/requests/messageRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { socketManager } from "@/lib/socket";

type SendMethod = 'rest' | 'socket';

export function useSendMessage(method: SendMethod = 'rest') {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            if (method === 'socket') {
                return new Promise((resolve, reject) => {
                    socketManager.emit('sendMessage', data);

                    const onSuccess = (response: any) => {
                        socketManager.off('messageSent', onSuccess);
                        socketManager.off('messageError', onError);
                        resolve(response);
                    };

                    const onError = (error: any) => {
                        socketManager.off('messageSent', onSuccess);
                        socketManager.off('messageError', onError);
                        reject(error);
                    };

                    socketManager.on('messageSent', onSuccess);
                    socketManager.on('messageError', onError);

                    setTimeout(() => {
                        socketManager.off('messageSent', onSuccess);
                        socketManager.off('messageError', onError);
                        reject(new Error('Timeout'));
                    }, 5000);
                });
            } else {
                return sendMessageRequest(data);
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["channel"] });
            return data;
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}