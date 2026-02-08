export type BanType = {
    id: number;
    reason: string | null;
    bannedAt: string;
    user: {
        id: number;
        username: string;
    };
    bannedBy: {
        id: number;
        username: string;
    } | null;
};
