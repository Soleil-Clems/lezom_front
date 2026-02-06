const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { prisma } = require("../config/database");

const SALT_ROUNDS = 10;
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

const generateRefreshToken = async (userId) => {
  const token = crypto.randomUUID();
  const tokenHash = await bcrypt.hash(token, SALT_ROUNDS);

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    },
  });

  return token;
};

const validateRefreshToken = async (userId, plainToken) => {
  const tokens = await prisma.refreshToken.findMany({
    where: {
      userId,
      isRevoked: false,
    },
  });

  for (const stored of tokens) {
    if (stored.expiresAt < new Date()) {
      await prisma.refreshToken.update({
        where: { id: stored.id },
        data: { isRevoked: true },
      });
      continue;
    }

    const isMatch = await bcrypt.compare(plainToken, stored.tokenHash);
    if (isMatch) {
      return stored;
    }
  }

  return null;
};

const revokeRefreshToken = async (userId, plainToken) => {
  const tokens = await prisma.refreshToken.findMany({
    where: {
      userId,
      isRevoked: false,
    },
  });

  for (const stored of tokens) {
    const isMatch = await bcrypt.compare(plainToken, stored.tokenHash);
    if (isMatch) {
      await prisma.refreshToken.update({
        where: { id: stored.id },
        data: { isRevoked: true },
      });
      return true;
    }
  }

  return false;
};

const revokeAllUserTokens = async (userId) => {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      isRevoked: false,
    },
    data: { isRevoked: true },
  });
};

module.exports = {
  generateRefreshToken,
  validateRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
};
