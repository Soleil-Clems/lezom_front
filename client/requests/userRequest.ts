import customfetch from "@/lib/customFetch"
import type { userUpdateType } from "@/schemas/user.dto"

export const getAuthUserRequest = async () => {
  return customfetch.get("auth/me")
}

export const getUserByIdRequest = async (userId: number) => {
  return customfetch.get(`users/${userId}`)
}

export const updateUserRequest = async (userId: number, body: userUpdateType) => {
  return customfetch.patch(`users/${userId}`, body)
}

export const updatePictureRequest = async (userId: number, file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  return customfetch.patch(`users/picture/${userId}`, formData)
}

export const updateBannerRequest = async (userId: number, file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  return customfetch.patch(`users/banner/${userId}`, formData)
}
