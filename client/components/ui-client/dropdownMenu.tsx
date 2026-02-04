"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, UserPlus, PlusCircle, Settings2 } from "lucide-react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModalChanelContent } from "./modalchanel"

interface ServerSettingsDropdownProps {
  serverId: string | number;
}

export function ServerSettingsDropdown({ serverId }: ServerSettingsDropdownProps) {
  return (
    /* 1. Le Dialog englobe le menu pour pouvoir être déclenché depuis l'intérieur */
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Settings size={20} />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56 bg-[#111214] border-none text-[#b5bac1] p-2">
          <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase text-zinc-500">
            Options du serveur
          </DropdownMenuLabel>
          
          <DropdownMenuGroup className="space-y-0.5">
            {/* 2. Le DialogTrigger est placé ici. Important: preventDefault sur Select */}
            <DialogTrigger asChild>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-[#5865f2] hover:text-white focus:bg-[#5865f2] focus:text-white rounded-sm transition-colors"
                onSelect={(e) => e.preventDefault()}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Créer un channel</span>
              </DropdownMenuItem>
            </DialogTrigger>
            
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-[#5865f2] hover:text-white focus:bg-[#5865f2] focus:text-white rounded-sm">
              <Link href={`/settings/${serverId}`}>
                <Settings2 className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Paramètres serveur</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer hover:bg-[#5865f2] hover:text-white focus:bg-[#5865f2] focus:text-white rounded-sm">
              <UserPlus className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Inviter un utilisateur</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator className="bg-zinc-800 my-1" />
          
          <DropdownMenuItem className="text-rose-500 cursor-pointer hover:bg-rose-500 hover:text-white focus:bg-rose-500 focus:text-white rounded-sm">
            <LogOut className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Quitter le serveur</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 3. Le contenu de la modale est rendu en dehors du menu mais dans le Dialog */}
      <ModalChanelContent />
    </Dialog>
  )
}