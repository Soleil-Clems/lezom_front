"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Send, Smile, Search, Sticker } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError } from "@/components/ui/field";
import { sendMessageSchema, sendMessageType } from "@/schemas/message.dto";
import { useSendMessage } from "@/hooks/mutations/useSendMessage";
import { useSendPrivateMessage } from "@/hooks/mutations/useSendPrivateMessage";
import { socketManager } from "@/lib/socket";
import { useSocketTyping } from "@/hooks/websocket/useSocketTyping";
import { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Input } from "@/components/ui/input";
import { gifApiKey, gifClientKey } from "@/lib/constants";

const TENOR_API_KEY = gifApiKey;
const TENOR_CLIENT_KEY = gifClientKey;

interface TenorGif {
  id: string;
  media_formats: {
    gif: { url: string };
    tinygif: { url: string };
  };
}

interface MessageProps {
  channelId?: string;
  conversationId?: string;
}

export default function Message({ channelId, conversationId }: MessageProps) {
  const socket = socketManager.getSocket();
  const isPrivateMessage = !!conversationId;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifs, setGifs] = useState<TenorGif[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const gifPickerRef = useRef<HTMLDivElement>(null);

  const privateTyping = useSocketTyping(conversationId);
  const sendPrivateMessageMutation = useSendPrivateMessage(conversationId);
  const sendChannelMessageMutation = useSendMessage();

  const form = useForm<sendMessageType>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
      type: "text",
      channelId: channelId ? parseInt(channelId) : 0,
    },
  });

  const handleTyping = (value: string) => {
    if (isPrivateMessage) {
      privateTyping.startTyping();
    } else {
      socket?.emit("typing", {
        channelId: parseInt(channelId!),
        isTyping: value.length > 0,
      });
    }
  };

  const stopTyping = () => {
    if (isPrivateMessage) {
      privateTyping.stopTyping();
    } else {
      socket?.emit("typing", {
        channelId: parseInt(channelId!),
        isTyping: false,
      });
    }
  };

  const onSubmit = (values: sendMessageType) => {
    if (isPrivateMessage) {
      sendPrivateMessageMutation.mutate({
        content: values.content,
        type: values.type,
      });
    } else {
      sendChannelMessageMutation.mutate(values);
    }

    form.reset({
      content: "",
      type: "text",
      channelId: channelId ? parseInt(channelId) : 0,
    });

    stopTyping();
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const current = form.getValues("content");
    form.setValue("content", current + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const fetchGifs = async (query: string) => {
    setIsLoadingGifs(true);
    try {
      const endpoint =
        query === "trending"
          ? `https://tenor.googleapis.com/v2/featured?key=${TENOR_API_KEY}&client_key=${TENOR_CLIENT_KEY}&limit=20`
          : `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(
              query,
            )}&key=${TENOR_API_KEY}&client_key=${TENOR_CLIENT_KEY}&limit=20`;

      const res = await fetch(endpoint);
      const data = await res.json();
      setGifs(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingGifs(false);
    }
  };

  useEffect(() => {
    if (showGifPicker && gifs.length === 0) {
      fetchGifs("trending");
    }
  }, [showGifPicker]);

  const handleGifSearch = () => {
    if (searchQuery.trim()) {
      fetchGifs(searchQuery);
    }
  };

  const onGifClick = (url: string) => {
    form.setValue("content", url);
    form.setValue("type", "gif");
    setShowGifPicker(false);
    form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false);
      }

      if (
        gifPickerRef.current &&
        !gifPickerRef.current.contains(e.target as Node)
      ) {
        setShowGifPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!channelId && !conversationId) return null;

  const isPending = isPrivateMessage
    ? sendPrivateMessageMutation.isPending
    : sendChannelMessageMutation.isPending;

  return (
    <div className="w-full px-4 pb-4">
      {isPrivateMessage && privateTyping.isAnyoneTyping && (
        <div className="px-2 py-1 text-xs text-zinc-400 italic">
          {privateTyping.typingUsers.length === 1
            ? `${privateTyping.typingUsers[0].username} est en train d'écrire...`
            : `${privateTyping.typingUsers.length} personnes sont en train d'écrire...`}
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-end gap-2 rounded-2xl bg-[#1E1F22] p-2 shadow-lg relative">
          <Button type="button" size="icon" variant="ghost">
            <Plus className="h-5 w-5 text-gray-300" />
          </Button>

          <div className="flex-1">
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Textarea
                    {...field}
                    placeholder="Écris ton message..."
                    className="min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent px-2 text-gray-100 focus-visible:ring-0 overflow-y-auto"
                    onChange={(e) => {
                      field.onChange(e);
                      handleTyping(e.target.value);
                    }}
                    onBlur={() => {
                      field.onBlur();
                      if (isPrivateMessage) {
                        privateTyping.stopTyping();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="mt-1 text-xs text-red-500"
                    />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Emoji */}
          <div ref={emojiPickerRef} className="relative">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowGifPicker(false);
              }}
            >
              <Smile className="h-5 w-5 text-gray-300" />
            </Button>

            {showEmojiPicker && (
              <div className="absolute bottom-12 right-0 z-50">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  theme={Theme.DARK}
                  width={350}
                  height={400}
                />
              </div>
            )}
          </div>

          {/* GIF */}
          <div ref={gifPickerRef} className="relative">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => {
                setShowGifPicker(!showGifPicker);
                setShowEmojiPicker(false);
              }}
            >
              <Sticker className="h-5 w-5 text-gray-300" />
            </Button>

            {showGifPicker && (
              <div className="absolute bottom-12 right-0 z-50 bg-[#2B2D31] rounded-lg w-[420px] h-[520px] flex flex-col">
                <div className="p-4 border-b border-zinc-700">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleGifSearch();
                        }
                      }}
                      className="flex-1 bg-[#1E1F22] text-white"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={handleGifSearch}
                    >
                      <Search />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {isLoadingGifs ? (
                    <p className="text-center text-gray-400">Chargement...</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {gifs.map((gif) => (
                        <button
                          key={gif.id}
                          type="button"
                          onClick={() => onGifClick(gif.media_formats.gif.url)}
                        >
                          <img
                            src={gif.media_formats.tinygif.url}
                            className="rounded-lg"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 rounded-xl bg-purple-discord text-white"
            disabled={isPending}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
