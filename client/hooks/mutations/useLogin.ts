"use client";

import { loginRequest } from "@/requests/authRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authuser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
