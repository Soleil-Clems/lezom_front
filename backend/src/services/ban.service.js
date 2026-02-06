const { prisma } = require("../config/database");
const { emitToServer, emitToUser, EVENTS } = require("../utils/socketEvents");
const AppError = require("../utils/AppError");

const ROLE_HIERARCHY = { OWNER: 4, ADMIN: 3, MODERATOR: 2, MEMBER: 1 };

const banUser = async (serverId, userId, requester) => {
  if (userId === requester.userId) {
    throw new AppError(400, "You cannot ban yourself.");
  }

  const targetMember = await prisma.serverMember.findUnique({
    where: {
      userId_serverId: {
        userId,
        serverId,
      },
    },
  });

  if (!targetMember) {
    throw new AppError(404, "User is not a member of this server.");
  }

  if (ROLE_HIERARCHY[requester.role] <= ROLE_HIERARCHY[targetMember.role]) {
    throw new AppError(403, "You cannot ban a user with equal or higher role.");
  }

  const existingBan = await prisma.ban.findUnique({
    where: {
      serverId_userId: {
        serverId,
        userId,
      },
    },
  });

  if (existingBan) {
    throw new AppError(400, "User is already banned.");
  }

  await prisma.$transaction([
    prisma.ban.create({
      data: {
        serverId,
        userId,
        bannedBy: requester.userId,
        reason: requester.reason || null,
      },
    }),
    prisma.serverMember.delete({
      where: {
        userId_serverId: {
          userId,
          serverId,
        },
      },
    }),
  ]);

  emitToServer(serverId, EVENTS.MEMBER_BANNED, {
    serverId,
    userId,
    bannedBy: requester.userId,
  });

  emitToUser(userId, EVENTS.MEMBER_BANNED, {
    serverId,
    bannedBy: requester.userId,
  });
};

const unbanUser = async (serverId, userId) => {
  const ban = await prisma.ban.findUnique({
    where: {
      serverId_userId: {
        serverId,
        userId,
      },
    },
  });

  if (!ban) {
    throw new AppError(404, "Ban not found.");
  }

  await prisma.ban.delete({
    where: {
      serverId_userId: {
        serverId,
        userId,
      },
    },
  });
};

const getBans = async (serverId) => {
  const bans = await prisma.ban.findMany({
    where: { serverId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      bannedByUser: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bans.map((b) => ({
    id: b.id,
    user: b.user,
    bannedBy: b.bannedByUser,
    reason: b.reason,
    createdAt: b.createdAt,
  }));
};

module.exports = { banUser, unbanUser, getBans };
