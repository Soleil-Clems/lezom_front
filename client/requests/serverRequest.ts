import customfetch from "@/lib/customFetch";


export const getAllServersRequest = async () => {
    try {
        const response = await customfetch.get("servers")
        return response
    } catch (error) {
        throw error
    }
}
