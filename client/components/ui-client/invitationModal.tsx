"use client"
import { useState, useEffect } from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useCreateInvitation } from "@/hooks/mutations/useInvitation"

type InvitationModalContentProps = {
    serverId: string | number;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const MAX_USES_OPTIONS = [
    { label: "1 utilisation", value: "1" },
    { label: "5 utilisations", value: "5" },
    { label: "10 utilisations", value: "10" },
    { label: "25 utilisations", value: "25" },
    { label: "50 utilisations", value: "50" },
    { label: "100 utilisations", value: "100" },
    { label: "Illimité", value: "unlimited" },
]

const EXPIRES_OPTIONS = [
    { label: "30 minutes", value: "1800" },
    { label: "1 heure", value: "3600" },
    { label: "6 heures", value: "21600" },
    { label: "12 heures", value: "43200" },
    { label: "1 jour", value: "86400" },
    { label: "7 jours", value: "604800" },
    { label: "Jamais", value: "never" },
]

function getExpirationLabel(expiresIn: string): string {
    const option = EXPIRES_OPTIONS.find(o => o.value === expiresIn)
    return option ? option.label.toLowerCase() : ""
}

export function InvitationModalContent({ serverId, open, onOpenChange }: InvitationModalContentProps) {
    const [maxUses, setMaxUses] = useState("unlimited")
    const [expiresIn, setExpiresIn] = useState("604800")
    const [invitation, setInvitation] = useState<any>(null)
    const [copied, setCopied] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    const createInvitation = useCreateInvitation()

    useEffect(() => {
        if (!open) {
            setInvitation(null)
            setMaxUses("unlimited")
            setExpiresIn("604800")
            setCopied(false)
            setShowSettings(false)
        }
    }, [open])

    useEffect(() => {
        if (open && !invitation && !createInvitation.isPending) {
            generateInvitation()
        }
    }, [open])

    const generateInvitation = () => {
        const params = {
            maxUses: maxUses === "unlimited" ? null : parseInt(maxUses),
            expiresIn: expiresIn === "never" ? null : parseInt(expiresIn),
        }

        createInvitation.mutate(
            { serverId, params },
            {
                onSuccess: (data) => {
                    setInvitation(data)
                },
            }
        )
    }

    const invitationUrl = invitation
        ? `${typeof window !== "undefined" ? window.location.origin : ""}/join/${invitation.code}`
        : ""

    const handleCopy = async () => {
        await navigator.clipboard.writeText(invitationUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <DialogContent className="bg-[#313338] border-none text-white sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Inviter sur le serveur</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <div className="space-y-2">
                    <p className="text-zinc-400 text-sm">Envoie ce lien à un ami :</p>
                    <div className="flex items-center gap-2">
                        <Input
                            readOnly
                            value={createInvitation.isPending ? "Génération..." : invitationUrl}
                            className="bg-[#1e1f22] border-none text-zinc-300"
                        />
                        <Button
                            variant="default"
                            onClick={handleCopy}
                            disabled={!invitation}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white shrink-0"
                        >
                            {copied ? <Check className="h-4 w-4" /> : "Copier"}
                        </Button>
                    </div>
                    {invitation && (
                        <p className="text-zinc-500 text-xs">
                            Ton lien d'invitation expire {expiresIn === "never" ? "jamais" : `dans ${getExpirationLabel(expiresIn)}`}.
                        </p>
                    )}
                </div>

                <div>
                    <button
                        type="button"
                        onClick={() => setShowSettings(!showSettings)}
                        className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
                    >
                        {showSettings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        Modifier les paramètres
                    </button>

                    {showSettings && (
                        <div className="mt-3 p-4 bg-[#2b2d31] rounded-md space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">Expire après</label>
                                <Select value={expiresIn} onValueChange={setExpiresIn}>
                                    <SelectTrigger className="w-full bg-[#1e1f22] border-none text-zinc-300">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1e1f22] border-none text-zinc-300">
                                        {EXPIRES_OPTIONS.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="hover:bg-indigo-500 focus:bg-indigo-500"
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">Nombre maximum d'utilisations</label>
                                <Select value={maxUses} onValueChange={setMaxUses}>
                                    <SelectTrigger className="w-full bg-[#1e1f22] border-none text-zinc-300">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1e1f22] border-none text-zinc-300">
                                        {MAX_USES_OPTIONS.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="hover:bg-indigo-500 focus:bg-indigo-500"
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={generateInvitation}
                                disabled={createInvitation.isPending}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                            >
                                {createInvitation.isPending ? "Génération..." : "Générer un nouveau lien"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </DialogContent>
    )
}
