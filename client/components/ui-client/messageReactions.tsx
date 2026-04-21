'use client';

import { reactionType } from '@/schemas/reaction.dto';

interface MessageReactionsProps {
  reactions: reactionType[];
  currentUserId: number;
  onReact: (emoji: string) => void;
}

export default function MessageReactions({
  reactions,
  currentUserId,
  onReact,
}: MessageReactionsProps) {
  if (!reactions || reactions.length === 0) return null;

  const grouped = reactions.reduce<Record<string, reactionType[]>>((acc, reaction) => {
    if (!acc[reaction.emoji]) acc[reaction.emoji] = [];
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(grouped).map(([emoji, group]) => {
        const hasReacted = group.some((r) => Number(r.author.id) === currentUserId);

        return (
          <button
            key={emoji}
            onClick={(e) => {
              e.stopPropagation();
              onReact(emoji);
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-sm border transition-colors ${
              hasReacted
                ? 'bg-indigo-500/30 border-indigo-400 text-white'
                : 'bg-zinc-700/50 border-zinc-600 text-zinc-300 hover:bg-zinc-600/50'
            }`}
          >
            <span>{emoji}</span>
            <span className="text-xs font-medium">{group.length}</span>
          </button>
        );
      })}
    </div>
  );
}
