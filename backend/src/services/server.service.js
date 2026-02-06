const { prisma } = require("../config/database");
const crypto = require("crypto");
const Message = require("../models/Message");
const { emitToServer, emitToUser, EVENTS } = require("../utils/socketEvents");
const AppError = require("../utils/AppError");

const ROLE_HIERARCHY = { OWNER: 4, ADMIN: 3, MODERATOR: 2, MEMBER: 1 };

const create = async (name, userId) => {
  const server = await prisma.server.create({
    data: {
      name,
      ownerId: userId,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
      channels: {
        create: {
          name: "general",
          type: "TEXT",
        },
      },
    },
    include: {
      members: {
        where: { userId },
        select: { role: true },
      },
      channels: {
        select: {
          id: true,
          name: true,
          type: true,
          createdAt: true,
        },
      },
    },
  });

  return {
    id: server.id,
    name: server.name,
    img: server.img,
    ownerId: server.ownerId,
    createdAt: server.createdAt,
    role: server.members[0].role,
    channels: server.channels,
  };
};

const findAll = async (userId) => {
  const memberships = await prisma.serverMember.findMany({
    where: { userId },
    include: {
      server: {
        select: {
          id: true,
          name: true,
          img: true,
          ownerId: true,
          createdAt: true,
        },
      },
    },
  });

  return memberships.map((m) => ({
    ...m.server,
    role: m.role,
  }));
};

const findOne = async (id, member) => {
  const server = await prisma.server.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      img: true,
      ownerId: true,
      createdAt: true,
      _count: {
        select: { members: true },
      },
    },
  });

  if (!server) {
    throw new AppError(404, "Server not found.");
  }

  return {
    id: server.id,
    name: server.name,
    img: server.img,
    ownerId: server.ownerId,
    createdAt: server.createdAt,
    memberCount: server._count.members,
    role: member.role,
  };
};

const update = async (id, data) => {
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.img !== undefined) updateData.img = data.img;

  const server = await prisma.server.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      img: true,
      ownerId: true,
      createdAt: true,
    },
  });

  emitToServer(id, EVENTS.SERVER_UPDATED, { server });

  return server;
};

const remove = async (id, memberRole) => {
  if (memberRole !== "OWNER") {
    throw new AppError(403, "Only the owner can delete the server.");
  }

  emitToServer(id, EVENTS.SERVER_DELETED, { serverId: id });

  await prisma.server.delete({ where: { id } });
};

const getMembers = async (serverId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(Math.max(parseInt(query.limit) || 20, 1), 100);
  const search = query.search || "";

  const where = { serverId };

  if (search) {
    where.user = {
      username: { contains: search },
    };
  }

  const [members, total] = await Promise.all([
    prisma.serverMember.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            img: true,
            status: true,
          },
        },
      },
      orderBy: [
        { role: "asc" },
        { joinedAt: "asc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.serverMember.count({ where }),
  ]);

  return {
    members: members.map((m) => ({
      userId: m.user.id,
      username: m.user.username,
      firstname: m.user.firstname,
      lastname: m.user.lastname,
      img: m.user.img,
      status: m.user.status,
      role: m.role,
      joinedAt: m.joinedAt,
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateMemberRole = async (serverId, userId, role, requester) => {
  const targetMember = await prisma.serverMember.findUnique({
    where: {
      userId_serverId: {
        userId,
        serverId,
      },
    },
  });

  if (!targetMember) {
    throw new AppError(404, "Member not found.");
  }

  if (targetMember.role === "OWNER") {
    throw new AppError(403, "Cannot modify the server owner.");
  }

  if (ROLE_HIERARCHY[requester.role] <= ROLE_HIERARCHY[targetMember.role]) {
    throw new AppError(403, "You can only manage members with a lower role.");
  }

  if (role === "OWNER") {
    throw new AppError(400, "Use transfer ownership to change owner.");
  }

  if (ROLE_HIERARCHY[requester.role] <= ROLE_HIERARCHY[role]) {
    throw new AppError(403, "You cannot assign a role equal to or higher than yours.");
  }

  const updated = await prisma.serverMember.update({
    where: {
      userId_serverId: {
        userId,
        serverId,
      },
    },
    data: { role },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  emitToServer(serverId, EVENTS.MEMBER_ROLE_CHANGED, {
    serverId,
    userId: updated.user.id,
    username: updated.user.username,
    role: updated.role,
  });

  return {
    userId: updated.user.id,
    username: updated.user.username,
    role: updated.role,
  };
};

const kickMember = async (serverId, userId, requester) => {
  if (userId === requester.userId) {
    throw new AppError(400, "Use leave endpoint to leave the server.");
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
    throw new AppError(404, "Member not found.");
  }

  if (targetMember.role === "OWNER") {
    throw new AppError(403, "Cannot kick the server owner.");
  }

  if (ROLE_HIERARCHY[requester.role] <= ROLE_HIERARCHY[targetMember.role]) {
    throw new AppError(403, "You can only kick members with a lower role.");
  }

  await prisma.serverMember.delete({
    where: {
      userId_serverId: {
        userId,
        serverId,
      },
    },
  });

  emitToServer(serverId, EVENTS.MEMBER_KICKED, {
    serverId,
    userId,
    kickedBy: requester.userId,
  });

  emitToUser(userId, EVENTS.MEMBER_KICKED, {
    serverId,
    kickedBy: requester.userId,
  });
};

const leave = async (serverId, userId, memberRole) => {
  if (memberRole === "OWNER") {
    throw new AppError(400, "Owner cannot leave the server. Transfer ownership first.");
  }

  await prisma.serverMember.delete({
    where: {
      userId_serverId: {
        userId,
        serverId,
      },
    },
  });

  emitToServer(serverId, EVENTS.MEMBER_LEFT, {
    serverId,
    userId,
  });
};

const transferOwnership = async (serverId, userId, requesterId, requesterRole) => {
  if (requesterRole !== "OWNER") {
    throw new AppError(403, "Only the owner can transfer ownership.");
  }

  if (userId === requesterId) {
    throw new AppError(400, "You are already the owner.");
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
    throw new AppError(404, "Member not found.");
  }

  await prisma.$transaction([
    prisma.serverMember.update({
      where: {
        userId_serverId: {
          serverId,
          userId,
        },
      },
      data: { role: "OWNER" },
    }),
    prisma.serverMember.update({
      where: {
        userId_serverId: {
          serverId,
          userId: requesterId,
        },
      },
      data: { role: "ADMIN" },
    }),
    prisma.server.update({
      where: { id: serverId },
      data: { ownerId: userId },
    }),
  ]);

  emitToServer(serverId, EVENTS.SERVER_OWNER_CHANGED, {
    serverId,
    newOwnerId: userId,
    previousOwnerId: requesterId,
  });
};

const createInvitation = async (serverId, userId, data) => {
  const { maxUses, expiresIn } = data;

  const code = crypto.randomBytes(8).toString("hex");

  const invitation = await prisma.invitation.create({
    data: {
      code,
      serverId,
      createdBy: userId,
      maxUses: maxUses || null,
      expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : null,
    },
  });

  return {
    id: invitation.id,
    code: invitation.code,
    maxUses: invitation.maxUses,
    uses: invitation.usesCount,
    expiresAt: invitation.expiresAt,
    createdAt: invitation.createdAt,
  };
};

const getInvitations = async (serverId) => {
  const invitations = await prisma.invitation.findMany({
    where: { serverId },
    select: {
      id: true,
      code: true,
      maxUses: true,
      usesCount: true,
      expiresAt: true,
      createdAt: true,
      creator: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return invitations;
};

const deleteInvitation = async (serverId, invitationId) => {
  const invitation = await prisma.invitation.findFirst({
    where: {
      id: invitationId,
      serverId,
    },
  });

  if (!invitation) {
    throw new AppError(404, "Invitation not found.");
  }

  await prisma.invitation.delete({ where: { id: invitationId } });
};

const joinByCode = async (code, userId) => {
  const invitation = await prisma.invitation.findUnique({
    where: { code },
  });

  if (!invitation) {
    throw new AppError(404, "Invalid invitation code.");
  }

  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    throw new AppError(400, "Invitation has expired.");
  }

  if (invitation.maxUses && invitation.usesCount >= invitation.maxUses) {
    throw new AppError(400, "Invitation has reached maximum uses.");
  }

  const existingMember = await prisma.serverMember.findUnique({
    where: {
      userId_serverId: {
        userId,
        serverId: invitation.serverId,
      },
    },
  });

  if (existingMember) {
    throw new AppError(400, "You are already a member of this server.");
  }

  const ban = await prisma.ban.findUnique({
    where: {
      serverId_userId: {
        serverId: invitation.serverId,
        userId,
      },
    },
  });

  if (ban) {
    throw new AppError(403, "You are banned from this server.");
  }

  await prisma.$transaction([
    prisma.serverMember.create({
      data: {
        serverId: invitation.serverId,
        userId,
        role: "MEMBER",
      },
    }),
    prisma.invitation.update({
      where: { id: invitation.id },
      data: { usesCount: { increment: 1 } },
    }),
  ]);

  const server = await prisma.server.findUnique({
    where: { id: invitation.serverId },
    select: {
      id: true,
      name: true,
      img: true,
      ownerId: true,
      createdAt: true,
    },
  });

  const joiningUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true },
  });

  emitToServer(invitation.serverId, EVENTS.MEMBER_JOINED, {
    serverId: invitation.serverId,
    userId,
    username: joiningUser?.username,
    role: "MEMBER",
    joinedAt: new Date(),
  });

  const firstChannel = await prisma.channel.findFirst({
    where: { serverId: invitation.serverId, type: "TEXT" },
    orderBy: { createdAt: "asc" },
  });

  if (firstChannel) {
    const systemMsg = await Message.create({
      channel_id: firstChannel.id,
      author_id: userId,
      content: `${joiningUser?.username || "A user"} has joined the server.`,
      type: "system",
    });

    emitToServer(invitation.serverId, EVENTS.MESSAGE_CREATED, {
      message: {
        id: systemMsg._id,
        content: systemMsg.content,
        type: systemMsg.type,
        channelId: systemMsg.channel_id,
        author: { id: userId, username: joiningUser?.username },
        createdAt: systemMsg.created_at,
      },
    });
  }

  return {
    ...server,
    role: "MEMBER",
  };
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
  getMembers,
  updateMemberRole,
  kickMember,
  leave,
  transferOwnership,
  createInvitation,
  getInvitations,
  deleteInvitation,
  joinByCode,
};
