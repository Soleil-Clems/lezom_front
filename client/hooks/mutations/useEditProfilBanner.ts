"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateBannerRequest } from "@/requests/userRequest";

export function useEditProfilBanner(id?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => updateBannerRequest(id!, file),
    onSuccess: () => {
      toast.success("Banniere de profil mise a jour !");
      queryClient.invalidateQueries({ queryKey: ["authuser"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["user", id] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la mise a jour");
    },
  });
}
