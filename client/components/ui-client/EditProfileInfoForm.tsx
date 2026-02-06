"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useEditProfil } from "@/hooks/mutations/useEditProfil";
import {userType} from "@/schemas/user.dto";

type EditProfileFormValues = {
    username: string;
    description: string;
    firstname: string;
    lastname: string;
    isActive: boolean;
};

export function EditProfileInfoForm({ user, onSuccess }: { user: userType, onSuccess: () => void }) {
    const editProfile = useEditProfil(user.id);

    const form = useForm<EditProfileFormValues>({
        defaultValues: {
            username: user.username,
            description: user.description ?? "",
            firstname: user.firstname ?? "",
            lastname: user.lastname ?? "",
            isActive: user.isActive ?? true,
        },
    });

    const onSubmit = (values: EditProfileFormValues) => {
        editProfile.mutate(values, {
            onSuccess: () => {
                onSuccess();
            }
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label className="text-xs uppercase font-bold text-zinc-400">Prénom</Label>
                    <Input {...form.register("firstname")} className="bg-[#1E1F22] border-none text-white" />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs uppercase font-bold text-zinc-400">Nom</Label>
                    <Input {...form.register("lastname")} className="bg-[#1E1F22] border-none text-white" />
                </div>
            </div>

            <div className="space-y-1">
                <Label className="text-xs uppercase font-bold text-zinc-400">Nom d'utilisateur</Label>
                <Input {...form.register("username")} className="bg-[#1E1F22] border-none text-white" />
            </div>

            <div className="space-y-1">
                <Label className="text-xs uppercase font-bold text-zinc-400">Description</Label>
                <Textarea
                    {...form.register("description")}
                    className="bg-[#1E1F22] border-none text-white resize-none h-24"
                />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#1E1F22] rounded-lg">
                <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Profil Actif</Label>
                    <p className="text-xs text-zinc-400">Apparaître en ligne pour les autres.</p>
                </div>
                <Switch
                    checked={form.watch("isActive")}
                    onCheckedChange={(checked) => form.setValue("isActive", checked)}
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                disabled={editProfile.isPending}
            >
                {editProfile.isPending ? "Enregistrement..." : "Sauvegarder les modifications"}
            </Button>
        </form>
    );
}