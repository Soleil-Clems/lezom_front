    "use client"
    import { Button } from "@/components/ui/button"
    import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    } from "@/components/ui/dialog"
    import { Field, FieldGroup } from "@/components/ui/field"
    import { Input } from "@/components/ui/input"
    import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"

    export default function ModalChanel() {
    return (
        <Dialog>
        <form>
            <DialogTrigger asChild>
            <Button variant="outline">Ajouter un chanel</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
            <DialogHeader>
                <DialogTitle>Crée ton Chanel</DialogTitle>
                <DialogDescription>
                Remplie les différentes informations pour créer ton chanel.
                </DialogDescription>
            </DialogHeader>
            <FieldGroup>
                <Field>
                <Label htmlFor="name-1">Nom du Chanel</Label>
                <Input id="name" name="name_chanel" />
                </Field>
                <Field>
                <Label htmlFor="Descritpiton">Description</Label>
                <Input id="Description" name="description"/>
                </Field>
            </FieldGroup>
            <DialogFooter>
                <Button type="submit" className="bg-purple-discord texte-white hover:bg-gray-400 hover:text-white">Confirmer</Button>
                <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
                </DialogClose>
            </DialogFooter>
            </DialogContent>
        </form>
        </Dialog>
    )
    }
