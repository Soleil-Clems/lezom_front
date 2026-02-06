export type CookieStore = {
    getAll: () => Array<{ name: string; value: string }>;
};