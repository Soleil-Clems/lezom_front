"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError } from "@/components/ui/field";
import { sendPrivateMessageSchema, sendPrivateMessageType } from "@/schemas/conversation.dto";
import { useSendPrivateMessage } from "@/hooks/mutations/useSendPrivateMessage";
import { useSocketTyping } from "@/hooks/websocket/useSocketTyping";

interface PrivateMessageInputProps {
    conversationId?: string;
}

export default function PrivateMessageInput({ conversationId }: PrivateMessageInputProps) {
    const { typingUsers, startTyping, stopTyping, isAnyoneTyping } = useSocketTyping(conversationId);

    const form = useForm<sendPrivateMessageType>({
        resolver: zodResolver(sendPrivateMessageSchema),
        defaultValues: {
            content: "",
            type: "text",
            conversationId: conversationId ? parseInt(conversationId) : 0,
        },
    });

    const sendMessageMutation = useSendPrivateMessage(conversationId);

    const onSubmit = (formValues: sendPrivateMessageType) => {
        sendMessageMutation.mutate({
            content: formValues.content,
            type: formValues.type,
        });

        stopTyping();

        form.reset({
            content: "",
            type: "text",
            conversationId: conversationId ? parseInt(conversationId) : 0,
        });
    };

    if (!conversationId) return null;

    return (
        <div className="w-full bottom-0 px-4 pb-4">
            {isAnyoneTyping && (
                <div className="px-2 py-1 text-xs text-zinc-400 italic">
                    {typingUsers.length === 1
                        ? `${typingUsers[0].username} est en train d'écrire...`
                        : `${typingUsers.length} personnes sont en train d'écrire...`}
                </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex items-end gap-2 rounded-2xl bg-[#1E1F22] p-2 shadow-lg">
                    <div className="flex-1">
                        <Controller
                            name="content"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Textarea
                                        {...field}
                                        placeholder="Écris ton message..."
                                        className="min-h-[44px] resize-none border-0 bg-transparent px-2 text-gray-100 focus-visible:ring-0"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            startTyping();
                                        }}
                                        onBlur={() => {
                                            field.onBlur();
                                            stopTyping();
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                form.handleSubmit(onSubmit)();
                                            }
                                        }}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                            className="mt-1 text-xs text-red-500"
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        size="icon"
                        className="h-10 w-10 rounded-xl bg-purple-discord text-white hover:bg-gray-400"
                        disabled={sendMessageMutation.isPending}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
