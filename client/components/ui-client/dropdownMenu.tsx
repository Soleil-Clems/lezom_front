"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Settings,
  LogOut,
  UserPlus,
  PlusCircle,
  Settings2,
} from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModalChanelContent } from "./modalchanel";
import { InvitationModalContent } from "./invitationModal";
import { LeaveServerModal } from "./LeaveServerModal";
import { TransferOwnershipModal } from "./TransferOwnershipModal";
import { useLeaveServer } from "@/hooks/mutations/useLeaveServer";

interface ServerSettingsDropdownProps {
  serverId: string | number;
  userRole?: string;
  serverName: string;
  currentUserId: number;
}

export function ServerSettingsDropdown({
  serverId,
  userRole,
  serverName,
  currentUserId,
}: ServerSettingsDropdownProps) {
  const canAccessSettings = userRole === "server_owner" || userRole === "server_admin";
  const isOwner = userRole === "server_owner";
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [chanelModalOpen, setChannelModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  const leaveServer = useLeaveServer();

  const handleLeaveServer = (newOwnerId?: number) => {
    leaveServer.mutate(
      { serverId, newOwnerId },
      {
        onSuccess: () => {
          setLeaveModalOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Dialog  open={chanelModalOpen} onOpenChange={setChannelModalOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
            >
              <Settings size={20} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 bg-[#111214] border-none text-[#b5bac1] p-2">
            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase text-zinc-500">
              Options du serveur
            </DropdownMenuLabel>

            <DropdownMenuGroup className="space-y-0.5">
              {canAccessSettings && (
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-[#5865f2] hover:text-white focus:bg-[#5865f2] focus:text-white rounded-sm transition-colors"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">Créer un channel</span>
                  </DropdownMenuItem>
                </DialogTrigger>
              )}

              {canAccessSettings && (
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer hover:bg-[#5865f2] hover:text-white focus:bg-[#5865f2] focus:text-white rounded-sm"
                >
                  <Link href={`/settings/${serverId}`}>
                    <Settings2 className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">
                      Paramètres serveur
                    </span>
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className="cursor-pointer hover:bg-[#5865f2] hover:text-white focus:bg-[#5865f2] focus:text-white rounded-sm"
                onSelect={(e) => {
                  e.preventDefault();
                  setInviteModalOpen(true);
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">
                  Inviter sur le serveur
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-zinc-800 my-1" />

            <DropdownMenuItem
              className="text-rose-500 cursor-pointer hover:bg-rose-500 hover:text-white focus:bg-rose-500 focus:text-white rounded-sm"
              onSelect={(e) => {
                e.preventDefault();
                setLeaveModalOpen(true);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Quitter le serveur</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ModalChanelContent onSuccess={() => setChannelModalOpen(false)}  />
      </Dialog>

      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <InvitationModalContent
          serverId={serverId}
          open={inviteModalOpen}
          onOpenChange={setInviteModalOpen}
        />
      </Dialog>

      {isOwner ? (
        <TransferOwnershipModal
          isOpen={leaveModalOpen}
          onClose={() => setLeaveModalOpen(false)}
          onConfirm={(newOwnerId) => handleLeaveServer(newOwnerId)}
          serverId={serverId}
          serverName={serverName}
          currentUserId={currentUserId}
          isPending={leaveServer.isPending}
        />
      ) : (
        <LeaveServerModal
          isOpen={leaveModalOpen}
          onClose={() => setLeaveModalOpen(false)}
          onConfirm={() => handleLeaveServer()}
          serverName={serverName}
          isPending={leaveServer.isPending}
        />
      )}
    </>
  );
}
