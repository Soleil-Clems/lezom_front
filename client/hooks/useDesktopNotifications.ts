"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSocket } from "@/hooks/websocket/useSocket";
import { useAuthUser } from "@/hooks/queries/useAuthUser";

interface ChannelNotificationPayload {
  messageId: number;
  channelId: number;
  channelName: string;
  serverId: number;
  serverName: string;
  senderId: number;
  senderName: string;
  contentPreview: string;
}

interface PrivateMessagePayload {
  sender?: { id: number; firstName?: string; username?: string };
  conversation?: number | { id: number };
  conversationId?: number;
  content?: string;
}

interface FriendRequestReceivedPayload {
  requestId: number;
  senderId: number;
  senderName: string;
}

interface FriendRequestAcceptedPayload {
  requestId: number;
  accepterId: number;
  accepterName: string;
}

function getConversationId(msg: PrivateMessagePayload): number | undefined {
  if (typeof msg.conversation === "number") return msg.conversation;
  if (msg.conversation && typeof msg.conversation === "object") return msg.conversation.id;
  return msg.conversationId;
}

export function useDesktopNotifications() {
  const { isConnected, on, off } = useSocket();
  const { data: authUser } = useAuthUser();
  const pathname = usePathname();
  const router = useRouter();

  // Pathname lives in a ref so socket handlers see fresh value without re-subscribing on every route change.
  const pathnameRef = useRef(pathname);
  const unreadRef = useRef<Map<string, number>>(new Map());
  const lastBadgeRef = useRef(-1);
  const prevAuthIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const current = authUser?.id;
    if (prevAuthIdRef.current !== undefined && prevAuthIdRef.current !== current) {
      unreadRef.current.clear();
      lastBadgeRef.current = 0;
      window.lezomDesktop?.setBadge(0);
    }
    prevAuthIdRef.current = current;
  }, [authUser?.id]);

  const updateBadge = () => {
    if (!window.lezomDesktop) return;
    let total = 0;
    unreadRef.current.forEach((v) => {
      total += v;
    });
    if (total === lastBadgeRef.current) return;
    lastBadgeRef.current = total;
    window.lezomDesktop.setBadge(total);
  };

  useEffect(() => {
    if (!window.lezomDesktop || !authUser) return;
    const dmMatch = pathname.match(/^\/conversation\/(\d+)/);
    if (dmMatch) {
      unreadRef.current.delete(`dm-${dmMatch[1]}`);
      updateBadge();
    }
    const chMatch = pathname.match(/^\/servers\/\d+\/(\d+)/);
    if (chMatch) {
      unreadRef.current.delete(`channel-${chMatch[1]}`);
      updateBadge();
    }
    if (pathname === "/") {
      for (const key of Array.from(unreadRef.current.keys())) {
        if (key.startsWith("friend-")) unreadRef.current.delete(key);
      }
      updateBadge();
    }
  }, [pathname, authUser]);

  useEffect(() => {
    if (!window.lezomDesktop || !isConnected || !authUser) return;

    const desktop = window.lezomDesktop;

    const handleDM = async (message: PrivateMessagePayload) => {
      const senderId = message.sender?.id;
      if (senderId != null && Number(senderId) === Number(authUser.id)) return;

      const convId = getConversationId(message);
      if (!convId) return;

      const focused = await desktop.isFocused();
      const onPage = pathnameRef.current === `/conversation/${convId}`;
      if (focused && onPage) return;

      const senderName =
        message.sender?.firstName || message.sender?.username || "Nouveau message";
      const body = (message.content ?? "").slice(0, 200);

      desktop.notify({
        title: senderName,
        body,
        type: "dm",
        conversationId: convId,
        tag: `dm-${convId}`,
      });

      unreadRef.current.set(`dm-${convId}`, (unreadRef.current.get(`dm-${convId}`) ?? 0) + 1);
      updateBadge();
    };

    const handleChannel = async (payload: ChannelNotificationPayload) => {
      if (Number(payload.senderId) === Number(authUser.id)) return;

      const focused = await desktop.isFocused();
      const onPage = pathnameRef.current === `/servers/${payload.serverId}/${payload.channelId}`;
      if (focused && onPage) return;

      desktop.notify({
        title: `#${payload.channelName} · ${payload.serverName}`,
        body: `${payload.senderName}: ${payload.contentPreview}`,
        type: "channel",
        channelId: payload.channelId,
        serverId: payload.serverId,
        tag: `channel-${payload.channelId}`,
      });

      const key = `channel-${payload.channelId}`;
      unreadRef.current.set(key, (unreadRef.current.get(key) ?? 0) + 1);
      updateBadge();
    };

    const handleFriendRequest = async (payload: FriendRequestReceivedPayload) => {
      if (Number(payload.senderId) === Number(authUser.id)) return;
      const focused = await desktop.isFocused();
      const onPage = pathnameRef.current === "/";
      if (focused && onPage) return;

      desktop.notify({
        title: "Nouvelle demande d'ami",
        body: `${payload.senderName} souhaite vous ajouter`,
        type: "friend-request",
        tag: `friend-request-${payload.requestId}`,
      });

      unreadRef.current.set(`friend-request-${payload.requestId}`, 1);
      updateBadge();
    };

    const handleFriendAccepted = async (payload: FriendRequestAcceptedPayload) => {
      if (Number(payload.accepterId) === Number(authUser.id)) return;
      const focused = await desktop.isFocused();
      const onPage = pathnameRef.current === "/";
      if (focused && onPage) return;

      desktop.notify({
        title: "Demande d'ami acceptée",
        body: `${payload.accepterName} a accepté votre demande`,
        type: "friend-accepted",
        tag: `friend-accepted-${payload.requestId}`,
      });

      unreadRef.current.set(`friend-accepted-${payload.requestId}`, 1);
      updateBadge();
    };

    on("newPrivateMessage", handleDM);
    on("channelMessageNotification", handleChannel);
    on("friendRequestReceived", handleFriendRequest);
    on("friendRequestAccepted", handleFriendAccepted);

    return () => {
      off("newPrivateMessage", handleDM);
      off("channelMessageNotification", handleChannel);
      off("friendRequestReceived", handleFriendRequest);
      off("friendRequestAccepted", handleFriendAccepted);
    };
  }, [isConnected, authUser, on, off]);

  useEffect(() => {
    if (!window.lezomDesktop) return;

    return window.lezomDesktop.onNotificationClick((payload) => {
      if (payload.type === "dm" && payload.conversationId) {
        router.push(`/conversation/${payload.conversationId}`);
        unreadRef.current.delete(`dm-${payload.conversationId}`);
      } else if (payload.type === "channel" && payload.channelId && payload.serverId) {
        router.push(`/servers/${payload.serverId}/${payload.channelId}`);
        unreadRef.current.delete(`channel-${payload.channelId}`);
      } else if (payload.type === "friend-request" || payload.type === "friend-accepted") {
        router.push("/");
        if (payload.tag) unreadRef.current.delete(payload.tag);
      }
      updateBadge();
    });
  }, [router]);
}
