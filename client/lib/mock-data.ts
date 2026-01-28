export type Server = {
  id: string;
  name: string;
  image?: string;
  hasNotification?: boolean;
};

export type Channel = {
  id: string;
  serverId: string;
  name: string;
  type: 'text' | 'voice';
};

export const MOCK_SERVERS: Server[] = [
  { id: "1", name: "RTC", hasNotification: true },
  { id: "2", name: "DEV", image: "https://api.dicebear.com/7.x/identicon/svg?seed=dev" },
  { id: "3", name: "DESIGN", hasNotification: false },
  { id: "4", name: "GAMING", image: "https://api.dicebear.com/7.x/identicon/svg?seed=game" },
];

export const MOCK_CHANNELS: Record<string, Channel[]> = {
  "1": [
    { id: "c1", serverId: "1", name: "général", type: "text" },
    { id: "c2", serverId: "1", name: "annonces", type: "text" },
    { id: "c3", serverId: "1", name: "Vocal", type: "voice" },
  ],
  "2": [
    { id: "c4", serverId: "2", name: "react-js", type: "text" },
    { id: "c5", serverId: "2", name: "next-js", type: "text" },
  ],
};