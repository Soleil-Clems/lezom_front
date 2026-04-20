export interface DesktopNotifyPayload {
  title: string;
  body: string;
  type: "dm" | "channel";
  conversationId?: number;
  channelId?: number;
  serverId?: number;
  tag?: string;
}

export interface LezomDesktop {
  platform: string;
  isDesktop: boolean;
  notify: (payload: DesktopNotifyPayload) => Promise<void>;
  setBadge: (count: number) => void;
  focus: () => void;
  isFocused: () => Promise<boolean>;
  onNotificationClick: (
    callback: (payload: DesktopNotifyPayload) => void,
  ) => () => void;
}

declare global {
  interface Window {
    lezomDesktop?: LezomDesktop;
  }
}
