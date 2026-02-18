"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useEditProfil } from "@/hooks/mutations/useEditProfil";
import { userType } from "@/schemas/user.dto";

const editProfileSchema = z.object({
  username: z.string().min(3, "Pseudo trop court"),
  description: z.string().max(200, "200 caractères max").or(z.literal("")),
  firstname: z.string().min(2, "Prénom trop court"),
  lastname: z.string().min(2, "Nom trop court"),
  isActive: z.boolean(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export function EditProfileInfoForm({
  user,
  onSuccess,
}: {
  user: userType;
  onSuccess: () => void;
}) {
  const editProfile = useEditProfil(user.id);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user.username,
      description: user.description ?? "",
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      isActive: user.isActive ?? true,
    },
  });

  const onSubmit = (values: EditProfileFormValues) => {
    editProfile.mutate(values, { onSuccess });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase font-bold text-zinc-400">
                  Prénom
                </FormLabel>
                <FormControl>
                  <Input {...field} className="bg-[#1E1F22] border-none text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase font-bold text-zinc-400">
                  Nom
                </FormLabel>
                <FormControl>
                  <Input {...field} className="bg-[#1E1F22] border-none text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase font-bold text-zinc-400">
                Nom d&apos;utilisateur
              </FormLabel>
              <FormControl>
                <Input {...field} className="bg-[#1E1F22] border-none text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase font-bold text-zinc-400">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="bg-[#1E1F22] border-none text-white resize-none h-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-3 bg-[#1E1F22] rounded-lg">
              <div className="space-y-0.5">
                <FormLabel className="text-sm font-medium text-white">
                  Profil Actif
                </FormLabel>
                <FormDescription className="text-xs text-zinc-400">
                  Apparaître en ligne pour les autres.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-[#5764f2] hover:bg-[#4752C4] text-white"
          disabled={editProfile.isPending}
        >
          {editProfile.isPending ? "Enregistrement..." : "Sauvegarder les modifications"}
        </Button>
      </form>
    </Form>
  );
}
