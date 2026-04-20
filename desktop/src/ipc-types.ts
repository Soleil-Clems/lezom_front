export interface NotifyPayload {
  title: string;
  body: string;
  type: 'dm' | 'channel';
  conversationId?: number;
  channelId?: number;
  serverId?: number;
  tag?: string;
}
