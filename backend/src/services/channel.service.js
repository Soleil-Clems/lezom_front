const { prisma } = require("../config/database");
const { emitToServer, EVENTS } = require("../utils/socketEvents");
const AppError = require("../utils/AppError");

const create = async (data, userId) => {
  const { serverId, name, description, type } = data;

  const member = await prisma.serverMember.findUnique({
    where: {
      userId_serverId: {
        userId,
        serverId,
      },
    },
  });

  if (!member) {
    throw new AppError(403, "You are not a member of this server.");
  }

  if (!["OWNER", "ADMIN"].includes(member.role)) {
    throw new AppError(403, "You don't have permission to perform this action.");
  }

  const channel = await prisma.channel.create({
    data: {
      name,
      description: description || null,
      type: type || "TEXT",
      serverId,
    },
  });

  emitToServer(serverId, EVENTS.CHANNEL_CREATED, {
    channel: {
      id: channel.id,
      serverId: channel.serverId,
      name: channel.name,
      description: channel.description,
      type: channel.type,
      createdAt: channel.createdAt,
    },
  });

  return {
    id: channel.id,
    serverId: channel.serverId,
    name: channel.name,
    description: channel.description,
    type: channel.type,
    createdAt: channel.createdAt,
  };
};

const findAll = async (serverId, userId) => {
  const member = await prisma.serverMember.findUnique({
    where: {
      userId_serverId: {
        userId,
        serverId,
      },
    },
  });

  if (!member) {
    throw new AppError(403, "You are not a member of this server.");
  }

  const channels = await prisma.channel.findMany({
    where: { serverId },
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return channels;
};

const findOne = async (id) => {
  const channel = await prisma.channel.findUnique({
    where: { id },
    select: {
      id: true,
      serverId: true,
      name: true,
      description: true,
      type: true,
      createdAt: true,
    },
  });

  if (!channel) {
    throw new AppError(404, "Channel not found.");
  }

  return channel;
};

const update = async (id, data, serverId) => {
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;

  const channel = await prisma.channel.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      serverId: true,
      name: true,
      description: true,
      type: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  emitToServer(channel.serverId, EVENTS.CHANNEL_UPDATED, {
    channel: {
      id: channel.id,
      serverId: channel.serverId,
      name: channel.name,
      description: channel.description,
      type: channel.type,
      updatedAt: channel.updatedAt,
    },
  });

  return channel;
};

const remove = async (id, serverId) => {
  await prisma.channel.delete({ where: { id } });

  emitToServer(serverId, EVENTS.CHANNEL_DELETED, {
    channelId: id,
    serverId,
  });
};

module.exports = { create, findAll, findOne, update, remove };
