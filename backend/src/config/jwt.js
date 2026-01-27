module.exports = {
  secret: process.env.JWT_SECRET,
  options: {
    expiresIn: "7d",
  },
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
