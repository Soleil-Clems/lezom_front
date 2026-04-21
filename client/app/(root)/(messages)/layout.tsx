'use client';

import { usePathname } from 'next/navigation';
import ConversationList from '@/components/ui-client/ConversationList';
import { FriendsSidebar } from '@/components/ui-client/FriendsSidebar';

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isConversationOpen = pathname.startsWith('/conversation/');

  return (
    <div className="flex h-full w-full">
      <aside
        className={`${
          isConversationOpen ? 'hidden' : 'flex'
        } md:flex w-full md:w-72 shrink-0 flex-col bg-[#2B2D31] border-r border-zinc-700`}
      >
        <ConversationList />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">{children}</main>

      {isConversationOpen && <FriendsSidebar />}
    </div>
  );
}
