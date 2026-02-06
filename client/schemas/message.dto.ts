/*
import z from "zod"
import {MessageTypeEnum} from "@/enums/enum";
import {userSchema} from "@/schemas/user.dto";


export const messageSchema = z.object({
    id:  z.number().or(z.string()),
    content: z.string(),
    type: MessageTypeEnum,
    createdAt: z.date().optional(),
    author: userSchema,
})

export const sendMessageSchema = z.object({
    content: z.string().min(1, "Le message ne peut pas être vide"),
    type: MessageTypeEnum,
    channelId: z.number().or(z.string()),
})

export type messageType = z.infer<typeof messageSchema>
export type sendMessageType = z.infer<typeof sendMessageSchema>*/


import z from "zod"
import {MessageTypeEnum} from "@/enums/enum";
import {userSchema} from "@/schemas/user.dto";


export const messageSchema = z.object({
    id: z.number().or(z.string()),
    content: z.string(),
    type: MessageTypeEnum,
    createdAt: z.date().optional(),
    author: userSchema,
})

export const sendMessageSchema = z
    .object({
        content: z.string().or(z.instanceof(File)).optional(),
        type: MessageTypeEnum,
        channelId: z.number().or(z.string()),
    })
    .refine(
        (data) => {

            if (data.type === "text") {
                if (typeof data.content !== "string") {
                    return false;
                }

                return data.content.trim().length > 0;
            }


            // if (["file", "img", "voice"].includes(data.type)) {
            //     return data.content instanceof File;
            // }

            return true;
        },
        {
            message: "Le message ne peut pas être vide",
            path: ["content"],
        }
    );


export type messageType = z.infer<typeof messageSchema>
export type sendMessageType = z.infer<typeof sendMessageSchema>