import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { UserPlus } from "lucide-react";

interface Props {
  content: string;
  date?: Date;
}

export default function SystemMessage({ content, date }: Props) {
  const td = useTranslations("dates");
  const locale = useLocale();

  const formatDate = (dateString: Date | undefined) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const time = d.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (days === 0) return td("todayAt", { time });
    if (days === 1) return td("yesterdayAt", { time });
    return td("dateAt", { date: d.toLocaleDateString(locale, { day: "2-digit", month: "2-digit" }), time });
  };

  const parseContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const name = part.slice(2, -2);
        return (
          <span key={index} className="font-bold text-emerald-400">
            {name}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex justify-center w-full py-2">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2b2d31] border border-zinc-700 rounded-full text-sm text-zinc-400">
        <UserPlus className="w-4 h-4 text-zinc-500" />
        <span>{parseContent(content)}</span>
        {date && <span className="text-xs text-zinc-500">— {formatDate(date)}</span>}
      </div>
    </div>
  );
}
