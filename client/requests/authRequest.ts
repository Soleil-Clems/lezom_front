import { customfetch } from "@/lib/customFetch"
import type { LoginType, RegisterType } from "@/schemas/auth.dto"

export const loginRequest = async (body: LoginType) => {
  return customfetch.post("auth/login", body)
}

export const registerRequest = async (body: RegisterType) => {
  return customfetch.post("users", body)
}
