'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="dark min-h-screen bg-own-dark flex flex-col items-center justify-center p-6 gap-6">
      <Image src="/lezom.svg" alt="Lezom" width={48} height={48} className="opacity-40" />
      <div className="text-center">
        <h1 className="text-7xl font-bold text-white/10">404</h1>
        <h2 className="text-xl font-semibold text-white mt-2">{t('notFound')}</h2>
        <p className="text-[#B5BAC1] mt-2 max-w-sm">{t('notFoundDesc')}</p>
      </div>
      <Link
        href="/"
        className="mt-2 px-6 py-2.5 bg-purple-discord text-white text-sm font-medium rounded-md hover:bg-purple-discord/85 transition-colors"
      >
        {t('backToHome')}
      </Link>
    </div>
  );
}
