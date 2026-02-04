import { useMutation, useQueryClient } from "@tanstack/react-query";
import { socketManager } from "@/lib/socket";
import { sendMessageType } from "@/schemas/message.dto";
import { toast } from "sonner";

export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: sendMessageType) => {
            return new Promise((resolve, reject) => {
                const socket = socketManager.getSocket();

                if (!socket || !socket.connected) {
                    return reject(new Error("Le serveur est déconnecté (WS)"));
                }

                socket.emit('createMessage', data, (response: any) => {
                    if (response?.error) {
                        reject(new Error(response.error));
                    } else {
                        resolve(response); // Le message créé retourné par NestJS
                    }
                });

                // Timeout de sécurité au cas où le serveur est figé
                setTimeout(() => reject(new Error('Le serveur ne répond pas')), 5000);
            });
        },
        onSuccess: (newMessage: any) => {
            // On invalide le cache pour rafraîchir la liste des messages
            // newMessage.channelId doit correspondre à la clé utilisée dans ton fetch
            queryClient.invalidateQueries({
                queryKey: ["messages", newMessage.channelId?.toString()]
            });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}