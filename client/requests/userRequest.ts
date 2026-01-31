import customfetch from "@/lib/customFetch";


export const getAuthUserRequest = async () => {
    try {
        const response = await customfetch.get("auth/me")
        return response
    } catch (error) {
        throw error
    }
}
