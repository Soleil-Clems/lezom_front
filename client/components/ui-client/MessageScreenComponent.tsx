import React, { useEffect, useRef } from "react";
import { messageType } from "@/schemas/message.dto";
import { useAuthUser } from "@/hooks/queries/useAuthUser";
import Loading from "@/components/ui-client/Loading";
import Error from "@/components/ui-client/Error";
import SystemMessage from "@/components/ui-client/SystemMessage";

interface Props {
  messages: messageType[];
  typingUsers?: string[];
}

export default function MessageScreenComponent({
                                                 messages,
                                                 typingUsers = [],
                                               }: Props) {
  const { data: user, isLoading, isError } = useAuthUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  const formatDate = (dateString: Date | undefined) => {
    const date = new Date(dateString || "");
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0)
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    if (days === 1) return "Hier";
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
      <div className="w-full p-4 space-y-4 min-h-full">
        {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                Aucun message pour le moment
              </h3>
              <p className="text-sm text-zinc-500 max-w-md">
                Soyez le premier à lancer la conversation ! Envoyez un message pour
                commencer à discuter.
              </p>
            </div>
        ) : (
            <>
              {messages.map((message) => {
                if (message.type === "system") {
                  return (
                      <SystemMessage
                          key={message.id}
                          content={message.content}
                          date={message.createdAt}
                      />
                  );
                }

                const isMyMessage = message.author.id === user?.id;


                if (message.type === "gif") {
                  return (
                      <div
                          key={message.id}
                          className={`flex flex-col gap-1 ${isMyMessage ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-2">
                    <span
                        className={`text-xs font-bold ${isMyMessage ? "text-emerald-400" : "text-indigo-400"}`}
                    >
                      {isMyMessage
                          ? "Moi"
                          : `${message.author.firstname} ${message.author.lastname}`}
                    </span>
                          <span className="text-xs text-zinc-500">
                      {formatDate(message.createdAt)}
                    </span>
                        </div>
                        <div className="relative group">
                          <img
                              src={message.content}
                              alt="GIF"
                              className="max-w-[300px] max-h-[300px] rounded-xl object-cover shadow-lg"
                              loading="lazy"
                          />
                          {/* Badge GIF optionnel */}
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            GIF
                          </div>
                        </div>
                      </div>
                  );
                }

                // Affichage des messages texte
                return (
                    <div
                        key={message.id}
                        className={`flex flex-col gap-1 ${isMyMessage ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2">
                  <span
                      className={`text-xs font-bold ${isMyMessage ? "text-emerald-400" : "text-indigo-400"}`}
                  >
                    {isMyMessage
                        ? "Moi"
                        : `${message.author.firstname} ${message.author.lastname}`}
                  </span>
                        <span className="text-xs text-zinc-500">
                    {formatDate(message.createdAt)}
                  </span>
                      </div>
                      <div
                          className={`p-3 max-w-[80%] break-words ${
                              isMyMessage
                                  ? "bg-indigo-600 rounded-l-xl rounded-br-xl text-white"
                                  : "bg-[#383a40] rounded-r-xl rounded-bl-xl text-zinc-200"
                          }`}
                      >
                        {message.content}
                      </div>
                    </div>
                );
              })}
            </>
        )}

        {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 italic animate-pulse">
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce"></span>
                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              {typingUsers.join(", ")}{" "}
              {typingUsers.length > 1 ? "écrivent..." : "écrit..."}
            </div>
        )}

        <div ref={scrollRef} />
      </div>
  );
}