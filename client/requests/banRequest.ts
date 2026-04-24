import customfetch from '@/lib/customFetch';

export const getBannedUsersRequest = async (serverId: string | number) => {
  try {
    const response = await customfetch.get(`servers/${serverId}/bans`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const banUserRequest = async (
  serverId: string | number,
  userId: number,
  reason?: string,
  durationHours?: number,
  durationMinutes?: number,
) => {
  try {
    const response = await customfetch.post(`servers/${serverId}/bans`, {
      userId,
      reason,
      durationHours,
      durationMinutes,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const unbanUserRequest = async (serverId: string | number, userId: number) => {
  try {
    const response = await customfetch.delete(`servers/${serverId}/bans/${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
