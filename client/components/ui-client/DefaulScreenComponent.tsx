'use client';
import { useGetAllServers } from '@/hooks/queries/useGetAllServers';
import Loading from '@/components/ui-client/Loading';
import Error from '@/components/ui-client/Error';
import { serversType } from '@/schemas/server.dto';
import { useTranslations } from 'next-intl';

function DefaulScreenComponent({ id }: { id: string | number }) {
  const { data: servers, isLoading, isError } = useGetAllServers();
  const t = useTranslations('server');

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }

  const server: serversType = servers.find((s: serversType) => s.id.toString() === id.toString());

  return (
    <main className="flex-1 flex items-center justify-center bg-[#313338] text-zinc-500">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white mb-2">
          {t('welcomeTo', { name: server?.name })}
        </h1>
        <p>{t('selectChannel')}</p>
      </div>
    </main>
  );
}

export default DefaulScreenComponent;
