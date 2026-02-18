"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updatePictureRequest } from "@/requests/userRequest";

export function useEditProfilPicture(id?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      updatePictureRequest(id?.toString() ?? "", file),
    onSuccess: () => {
      toast.success("Photo de profil mise à jour !");
      queryClient.invalidateQueries({ queryKey: ["authuser"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
  });
}
