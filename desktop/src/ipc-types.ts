export interface NotifyPayload {
  title: string;
  body: string;
  type: 'dm' | 'channel' | 'friend-request' | 'friend-accepted';
  conversationId?: number;
  channelId?: number;
  serverId?: number;
  tag?: string;
}
