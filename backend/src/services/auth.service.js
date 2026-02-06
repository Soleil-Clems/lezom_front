const jwt = require("jsonwebtoken");
const { prisma } = require("../config/database");
const { secret, accessOptions } = require("../config/jwt");
const {
  hashPassword,
  comparePassword,
  isEmailTaken,
  isUsernameTaken,
} = require("../utils/user.utils");
const {
  generateRefreshToken,
  validateRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
} = require("../utils/auth.utils");
const AppError = require("../utils/AppError");

const register = async (data) => {
  const { email, password, username, firstname, lastname } = data;

  if (await isEmailTaken(email)) {
    throw new AppError(400, "Email already in use.");
  }
  if (await isUsernameTaken(username)) {
    throw new AppError(400, "Username already in use.");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
      firstname,
      lastname,
    },
  });

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    secret,
    accessOptions
  );
  const refreshToken = await generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, "Invalid credentials.");
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new AppError(401, "Invalid credentials.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastSeen: new Date() },
  });

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    secret,
    accessOptions
  );
  const refreshToken = await generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (expiredToken, refreshTokenValue) => {
  if (!refreshTokenValue) {
    throw new AppError(401, "No refresh token provided.");
  }

  let userId;
  if (expiredToken) {
    try {
      const decoded = jwt.verify(expiredToken, secret, { ignoreExpiration: true });
      userId = decoded.id;
    } catch {
      throw new AppError(401, "Invalid token.");
    }
  } else {
    throw new AppError(401, "No access token provided.");
  }

  const storedToken = await validateRefreshToken(userId, refreshTokenValue);
  if (!storedToken) {
    throw new AppError(401, "Invalid or expired refresh token.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user) {
    throw new AppError(401, "User not found.");
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    secret,
    accessOptions
  );

  return { accessToken };
};

const logout = async (userId, refreshTokenValue) => {
  if (refreshTokenValue && userId) {
    await revokeRefreshToken(userId, refreshTokenValue);
  }
};

const logoutAll = async (userId) => {
  await revokeAllUserTokens(userId);
};

module.exports = { register, login, refreshAccessToken, logout, logoutAll };
