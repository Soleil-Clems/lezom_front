export type BanType = {
  id: number;
  reason: string | null;
  bannedAt: string;
  expiresAt: string | null;
  user: {
    id: number;
    username: string;
  };
  bannedBy: {
    id: number;
    username: string;
  } | null;
};
