"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserByIdRequest } from "@/requests/userRequest";

export function useUserById(userId: number) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserByIdRequest(userId),
    enabled: Number.isFinite(userId) && userId > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}
