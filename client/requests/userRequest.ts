import customfetch from "@/lib/customFetch"
import type { userUpdateType } from "@/schemas/user.dto"

export const getAuthUserRequest = async () => {
  return customfetch.get("auth/me")
}

export const updateUserRequest = async (userId: string, body: userUpdateType) => {
  return customfetch.patch(`users/${userId}`, body)
}

export const updatePictureRequest = async (userId: string, file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  return customfetch.patch(`users/picture/${userId}`, formData)
}
