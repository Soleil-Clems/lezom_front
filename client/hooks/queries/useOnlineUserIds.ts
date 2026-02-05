import { useQuery } from "@tanstack/react-query";

export function useOnlineUserIds() {
    return useQuery({
        queryKey: ["onlineUserIds"],
        queryFn: () => [] as number[],
        staleTime: Infinity,
        gcTime: Infinity,
    });
}
