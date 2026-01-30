import { customfetch } from "@/lib/customFetch"
import { LoginSchema } from "@/schemas/auth.dto"
import { registerSchema } from "@/schemas/register.dto"
import z from "zod"



export const loginRequest = async (body: z.infer<typeof LoginSchema>) => {
    try {
        const response = await customfetch.post("auth/login", body)
        return response
    } catch (error) {
        throw error
    }
}

export const registerRequest = async (body: z.infer<typeof registerSchema>) => {
    try {

        const response = await customfetch.post("register", body)

        return response
    } catch (error) {

        throw error
    }
}