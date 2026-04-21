'use client';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { MessageSquare, Plus, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { serversType } from '@/schemas/server.dto';
import { ServerItem } from '@/components/ui-client/serverItem';
import Error from '@/components/ui-client/Error';
import Loading from '@/components/ui-client/Loading';
import { useSocketServers } from '@/hooks/websocket/useSocketServers';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ModalServerContent } from './modalserver';
import { useGetAllServers } from '@/hooks/queries/useGetAllServers';
import { useTranslations } from 'next-intl';

export function ServerSidebar() {
  const { data: servers, isError, isLoading } = useGetAllServers();
  const [open, setOpen] = useState(false);
  const { setOpenMobile } = useSidebar();
  const t = useTranslations('server');
  const tm = useTranslations('messages');

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return (
    <TooltipProvider>
      <Sidebar collapsible="offcanvas" className="w-[280px] md:w-20 border-r-0 bg-[#1E1F22]">
        <SidebarHeader className="flex items-center justify-center py-4">
          <span className="text-[10px] font-bold tracking-tight text-muted-foreground hidden md:block uppercase">
            {t('servers')}
          </span>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="flex flex-col items-start md:items-center gap-3 px-3">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  onClick={() => setOpenMobile(false)}
                  className="group flex items-center gap-3 w-full outline-none"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[24px] bg-[#313338] text-indigo-400 transition-all duration-200 hover:rounded-[16px] hover:bg-indigo-500 hover:text-white">
                    <MessageSquare size={25} />
                  </div>
                  <span className="block md:hidden font-bold text-zinc-400 hover:text-white">
                    {tm('privateMessages')}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="hidden md:block">
                <p>{tm('privateMessages')}</p>
              </TooltipContent>
            </Tooltip>

            <Separator className="w-8 bg-zinc-600" />

            {servers.map((server: serversType, index: number) => (
              <ServerItem
                key={`${server.id}-${index}`}
                id={server.id}
                name={server.name}
                image={''}
              />
            ))}

            <Dialog open={open} onOpenChange={setOpen}>
              <Tooltip delayDuration={0}>
                <DialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <button className="group flex items-center gap-3 w-full outline-none">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[24px] bg-[#313338] text-green-500 transition-all duration-200 hover:rounded-[16px] hover:bg-green-500 hover:text-white">
                        <Plus size={25} />
                      </div>
                      <span className="block md:hidden font-bold text-zinc-400 hover:text-white">
                        {t('addServer')}
                      </span>
                    </button>
                  </TooltipTrigger>
                </DialogTrigger>
                <TooltipContent side="right" className="hidden md:block">
                  <p>{t('addServer')}</p>
                </TooltipContent>
              </Tooltip>
              <ModalServerContent onSuccess={() => setOpen(false)} />
            </Dialog>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="py-4 px-3 flex flex-col items-start md:items-center">
          <a
            href="/profil"
            onClick={() => setOpenMobile(false)}
            className="group flex items-center gap-3 outline-none"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white transition-all duration-200 hover:rounded-[16px]">
              <User size={24} />
            </div>
          </a>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
