'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { setLocale } from '@/i18n/actions';

const languages = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: string) => {
    startTransition(async () => {
      await setLocale(value);
    });
  };

  return (
    <Select value={locale} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-[130px] bg-[#1E1F22] border-none text-zinc-300 h-9">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-[#1e1f22] border-none text-zinc-300">
        {languages.map((lang) => (
          <SelectItem
            key={lang.value}
            value={lang.value}
            className="hover:bg-indigo-500 focus:bg-indigo-500"
          >
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
