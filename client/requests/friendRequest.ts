import { customfetch } from "@/lib/customFetch";

export const searchUsersRequest = async (q: string) => {
    const response = await customfetch.get(`users/search?q=${encodeURIComponent(q)}`);
    return response;
};

export const sendFriendRequestRequest = async (userId: number) => {
    const response = await customfetch.post(`friends/request/${userId}`, {});
    return response;
};

export const acceptFriendRequestRequest = async (requestId: number) => {
    const response = await customfetch.patch(`friends/request/${requestId}/accept`, {});
    return response;
};

export const declineFriendRequestRequest = async (requestId: number) => {
    const response = await customfetch.patch(`friends/request/${requestId}/decline`, {});
    return response;
};

export const getFriendsRequest = async () => {
    const response = await customfetch.get("friends");
    return response;
};

export const getPendingRequestsRequest = async () => {
    const response = await customfetch.get("friends/requests/pending");
    return response;
};

export const removeFriendRequest = async (userId: number) => {
    const response = await customfetch.delete(`friends/${userId}`);
    return response;
};

export const blockUserRequest = async (userId: number) => {
    const response = await customfetch.post(`friends/block/${userId}`, {});
    return response;
};
