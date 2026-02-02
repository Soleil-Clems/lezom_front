import { Button } from "@/components/ui/button"
import { Settings, LogOut, UserPlus, PlusCircle, Settings2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ServerSettingsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
          <Settings size={20} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56 bg-[#111214] border-none text-zinc-400">
        <DropdownMenuLabel className="text-zinc-500 text-xs uppercase">
          Options du serveur
        </DropdownMenuLabel>
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer hover:bg-indigo-500 hover:text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Créer un channel</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer hover:bg-indigo-500 hover:text-white">
            <Settings2 className="mr-2 h-4 w-4" />
            <span>Paramètres serveur</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer hover:bg-indigo-500 hover:text-white">
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Inviter un utilisateur</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="bg-zinc-800" />
        
        <DropdownMenuItem className="text-rose-500 cursor-pointer hover:bg-rose-500 hover:text-white">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Quitter le serveur</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}