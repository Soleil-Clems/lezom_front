module.exports = {
  secret: process.env.JWT_SECRET,
  accessOptions: {
    expiresIn: "15m",
  },
  refreshOptions: {
    expiresIn: "7d",
  },
  accessCookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  },
  refreshCookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  get options() {
    return this.accessOptions;
  },
  get cookieOptions() {
    return this.accessCookieOptions;
  },
};
