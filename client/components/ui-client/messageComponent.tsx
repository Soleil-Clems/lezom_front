"use client";

import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Plus, Send} from "lucide-react";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Field, FieldError} from "@/components/ui/field";
import {sendMessageSchema, sendMessageType} from "@/schemas/message.dto";
import {useSendMessage} from "@/hooks/mutations/useSendMessage";

export default function Message({channelId}: { channelId?: string }) {
    const form = useForm<sendMessageType>({
        resolver: zodResolver(sendMessageSchema),
        defaultValues: {
            content: "",
            type: "text",
            channelId: channelId ? parseInt(channelId) : 0,
        },
    });

    const sendMessageMutation = useSendMessage();

    const onSubmit = (formValues: sendMessageType) => {
        sendMessageMutation.mutate(formValues);

        form.reset({
            content: "",
            type: "text",
            channelId: channelId ? parseInt(channelId) : 0,
        });
    };

    if (!channelId) return null;

    return (
        <div className="w-full bottom-0 px-4 pb-4">
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex items-end gap-2 rounded-2xl bg-[#1E1F22] p-2 shadow-lg">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full"
                    >
                        <Plus className="h-5 w-5 text-gray-300"/>
                    </Button>

                    <div className="flex-1">
                        <Controller
                            name="content"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Textarea
                                        {...field}
                                        placeholder="Écris ton message..."
                                        className="min-h-[44px] resize-none border-0 bg-transparent px-2 text-gray-100 focus-visible:ring-0"
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
                        <Send className="h-5 w-5"/>
                    </Button>
                </div>
            </form>
        </div>
    );
}
