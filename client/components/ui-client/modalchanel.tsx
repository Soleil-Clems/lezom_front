"use client"

import {Button} from "@/components/ui/button"
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useState} from "react"
import {channelRequest} from "@/requests/channelRequest"
import {useParams} from "next/navigation"
import {useCreateChannel} from "@/hooks/mutations/useCreateChannel";
import {createChannelType} from "@/schemas/channel.dto";

type ModalChanelContentProps = {
    onSuccess: () => void;
};

export function ModalChanelContent({onSuccess}: ModalChanelContentProps) {
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const createChannelMutation = useCreateChannel()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        const serverId = Number(params.serverId);

        const body: createChannelType = {
            name: String(formData.get("name_chanel")),
            type: formData.get("type_chanel") as "text" | "call",
            serverId: serverId
        };

        try {
            await createChannelMutation.mutateAsync(body);
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
                    <DialogTitle className="text-2xl font-bold text-white">Crée ton Chanel</DialogTitle>
                    <DialogDescription className="text-[#b5bac1]">
                        Remplie les différentes informations pour créer ton chanel.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-bold uppercase text-[#b5bac1]">Nom du
                            Chanel</Label>
                        <Input
                            id="name"
                            name="name_chanel"
                            placeholder="nouveau-salon"
                            required
                            className="bg-[#1e1f22] border-none text-white focus-visible:ring-1 focus-visible:ring-indigo-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type_chanel" className="text-xs font-bold uppercase text-[#b5bac1]">Type de
                            salon</Label>
                        <select
                            id="type_chanel"
                            name="type_chanel"
                            className="flex h-10 w-full rounded-md bg-[#1e1f22] border-none px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                        >
                            <option value="text">text</option>
                            <option value="call">call</option>
                        </select>
                    </div>
                </div>

                <DialogFooter className="bg-[#2b2d31] p-4 -m-6 mt-4 flex items-center justify-end gap-3">
                    <DialogClose asChild>
                        <Button type="button" variant="ghost"
                                className="text-white hover:bg-transparent hover:underline">
                            Annuler
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6"
                    >
                        {isLoading ? "Création..." : "Confirmer"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}