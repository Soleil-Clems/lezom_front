"use client"

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {serverRequest} from "@/requests/serverRequest";
import customfetch from "@/lib/customFetch";
import {CreateServerDto} from "@/schemas/create-server.dto";
import {channelRequest} from "@/requests/channelRequest";
import {useCreateServer} from "@/hooks/mutations/useCreateServer";

type ModalServerContentProps = {
    onSuccess: () => void;
};

export function ModalServerContent({onSuccess}: ModalServerContentProps) {
    const [isLoading, setIsLoading] = useState(false);
    const createServerMutation = useCreateServer();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        const body = {
            name: String(formData.get("name_server")),
        };

        try {
            await createServerMutation.mutateAsync(body as CreateServerDto);
            onSuccess();
        } catch (error: any) {
            alert(`Erreur : ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DialogContent className="bg-[#313338] text-[#dbdee1] border-none sm:max-w-md">
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-white">Crée ton serveur</DialogTitle>
                    <DialogDescription className="text-center text-[#b5bac1]">
                        Donne un nom à ton serveur pour commencer.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name_server" className="text-xs font-bold uppercase text-[#b5bac1]">Nom du
                            serveur</Label>
                        <Input
                            id="name_server"
                            name="name_server"
                            placeholder="nom duserveur"
                            required
                            className="bg-[#1e1f22] border-none text-white h-12 focus-visible:ring-1 focus-visible:ring-indigo-500"
                        />
                    </div>
                </div>

                <DialogFooter className="bg-[#2b2d31] p-4 -m-6 mt-4 flex items-center justify-between">
                    <DialogClose asChild>
                        <Button type="button" variant="ghost"
                                className="text-white hover:bg-transparent hover:underline">
                            Retour
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-8"
                    >
                        {isLoading ? "Création..." : "Créer"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}