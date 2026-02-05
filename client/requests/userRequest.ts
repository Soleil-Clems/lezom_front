import customfetch from "@/lib/customFetch";
import {registerSchema} from "@/schemas/register.dto";
import {userUpdateType} from "@/schemas/user.dto";


export const getAuthUserRequest = async () => {
    try {
        const response = await customfetch.get("auth/me")
        return response
    } catch (error) {
        throw error
    }
}

export const updateUserRequest = async (userId:string, body: userUpdateType) => {
    try {

        const response = await customfetch.patch("users/"+userId, body)

        return response
    } catch (error) {

        throw error
    }
}

export const updatePictureRequest = async (userId: string, file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await customfetch.patch(`users/picture/${userId}`, formData);

        return response;
    } catch (error) {
        throw error;
    }
};