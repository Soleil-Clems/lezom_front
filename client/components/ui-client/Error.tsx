'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export default function Error({ message }: { message?: string }) {
  const t = useTranslations('common');

  return (
    <div className="min-h-screen bg-own-dark flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md bg-purple-discord space-y-2">
        <p className="text-white font-medium ">{t('error')}</p>
        {message && <p className="text-sm text-zinc-300 break-words">{message}</p>}
      </div>
    </div>
  );
}
