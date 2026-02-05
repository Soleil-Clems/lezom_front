"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Send,
  Smile,
  Search,
  Sticker,
  Image,
  FileText,
  Monitor,
  X,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError } from "@/components/ui/field";
import { sendMessageSchema, sendMessageType } from "@/schemas/message.dto";
import { useSendMessage } from "@/hooks/mutations/useSendMessage";
import { socketManager } from "@/lib/socket";
import { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Input } from "@/components/ui/input";
import { gifApiKey, gifClientKey } from "@/lib/constants";
import { Theme } from "@/types/theme";

const TENOR_API_KEY = gifApiKey;
const TENOR_CLIENT_KEY = gifClientKey;
const theme: Theme = "dark";

interface TenorGif {
  id: string;
  media_formats: {
    gif: { url: string };
    tinygif: { url: string };
  };
}

export default function Message({ channelId }: { channelId: string }) {
  const socket = socketManager.getSocket();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [gifs, setGifs] = useState<TenorGif[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const gifPickerRef = useRef<HTMLDivElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<sendMessageType>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
      type: "text",
      channelId: parseInt(channelId),
    },
  });

  const sendMessageMutation = useSendMessage();

  const handleTyping = (value: string) => {
    socket?.emit("typing", {
      channelId: parseInt(channelId),
      isTyping: value.length > 0,
    });
  };

  const onSubmit = (values: sendMessageType) => {
    sendMessageMutation.mutate(values);

    form.reset({
      content: "",
      type: "text",
      channelId: parseInt(channelId),
    });

    setSelectedFiles([]);

    socket?.emit("typing", {
      channelId: parseInt(channelId),
      isTyping: false,
    });
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
                  query
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

  // Gestion des fichiers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    setShowAttachMenu(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Capture d'écran
  const handleScreenCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      // Attendre que la vidéo soit prête
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);

      // Arrêter le stream
      stream.getTracks().forEach((track) => track.stop());

      // Convertir en blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `screenshot-${Date.now()}.png`, {
            type: "image/png",
          });
          setSelectedFiles((prev) => [...prev, file]);
        }
      });

      setShowAttachMenu(false);
    } catch (error) {
      console.error("Erreur capture d'écran:", error);
    }
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

      if (
          attachMenuRef.current &&
          !attachMenuRef.current.contains(e.target as Node)
      ) {
        setShowAttachMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!channelId) return null;

  return (
      <div className="w-full px-4 pb-4">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Preview des fichiers sélectionnés */}
          {selectedFiles.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2 p-2 bg-[#2B2D31] rounded-lg">
                {selectedFiles.map((file, index) => (
                    <div
                        key={index}
                        className="relative bg-[#1E1F22] rounded-lg p-2 flex items-center gap-2"
                    >
                      {file.type.startsWith("image/") ? (
                          <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-16 h-16 object-cover rounded"
                          />
                      ) : (
                          <FileText className="w-8 h-8 text-gray-400" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-300 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                ))}
              </div>
          )}

          <div className="flex items-end gap-2 rounded-2xl bg-[#1E1F22] p-2 shadow-lg relative">
            {/* Menu Attachement */}
            <div ref={attachMenuRef} className="relative">
              <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setShowAttachMenu(!showAttachMenu);
                    setShowEmojiPicker(false);
                    setShowGifPicker(false);
                  }}
              >
                <Plus className="h-5 w-5 text-gray-300" />
              </Button>

              {showAttachMenu && (
                  <div className="absolute bottom-12 left-0 z-50 bg-[#111214] rounded-lg shadow-2xl w-[240px] overflow-hidden border border-zinc-800">
                    <div className="p-2 space-y-1">
                      <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-200 hover:bg-[#5865f2] rounded transition-colors"
                      >
                        <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center">
                          <Image className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Télécharger un fichier</p>
                          <p className="text-xs text-gray-400">
                            Images, vidéos, documents
                          </p>
                        </div>
                      </button>

                      <button
                          type="button"
                          onClick={handleScreenCapture}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-200 hover:bg-[#5865f2] rounded transition-colors"
                      >
                        <div className="w-8 h-8 bg-[#ED4245] rounded-full flex items-center justify-center">
                          <Monitor className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Capture d'écran</p>
                          <p className="text-xs text-gray-400">
                            Partager votre écran
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
              )}

              <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
              />
            </div>

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
                    setShowAttachMenu(false);
                  }}
              >
                <Smile className="h-5 w-5 text-gray-300" />
              </Button>

              {showEmojiPicker && (
                  <div className="absolute bottom-12 right-0 z-50">
                    <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        theme={theme}
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
                    setShowAttachMenu(false);
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
                disabled={sendMessageMutation.isPending}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
  );
}