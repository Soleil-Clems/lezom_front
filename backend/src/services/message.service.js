const { prisma } = require("../config/database");
const Message = require("../models/Message");
const { emitToServer, EVENTS } = require("../utils/socketEvents");
const AppError = require("../utils/AppError");

const create = async (channelId, authorId, content, type) => {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    select: { id: true, serverId: true, type: true },
  });

  if (!channel) {
    throw new AppError(404, "Channel not found.");
  }

  if (channel.type === "CALL") {
    throw new AppError(400, "Cannot send messages to a voice channel.");
  }

  const member = await prisma.serverMember.findUnique({
    where: {
      userId_serverId: {
        userId: authorId,
        serverId: channel.serverId,
      },
    },
  });

  if (!member) {
    throw new AppError(403, "You are not a member of this server.");
  }

  const message = await Message.create({
    channel_id: channelId,
    author_id: authorId,
    content,
    type: type || "text",
  });

  const author = await prisma.user.findUnique({
    where: { id: authorId },
    select: {
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      img: true,
    },
  });

  const messageData = {
    id: message._id,
    content: message.content,
    type: message.type,
    channelId: message.channel_id,
    author,
    createdAt: message.created_at,
  };

  emitToServer(channel.serverId, EVENTS.MESSAGE_CREATED, {
    message: messageData,
  });

  return messageData;
};

const findAll = async (channelId, userId) => {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    select: { id: true, serverId: true },
  });

  if (!channel) {
    throw new AppError(404, "Channel not found.");
  }

  const member = await prisma.serverMember.findUnique({
    where: {
      userId_serverId: {
        userId,
        serverId: channel.serverId,
      },
    },
  });

  if (!member) {
    throw new AppError(403, "You are not a member of this server.");
  }

  const messages = await Message.find({ channel_id: channelId })
    .sort({ created_at: 1 })
    .lean();

  const authorIds = [...new Set(messages.map((m) => m.author_id))];
  const authors = await prisma.user.findMany({
    where: { id: { in: authorIds } },
    select: {
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      img: true,
    },
  });

  const authorsMap = authors.reduce((acc, author) => {
    acc[author.id] = author;
    return acc;
  }, {});

  return messages.map((m) => ({
    id: m._id,
    content: m.content,
    type: m.type,
    channelId: m.channel_id,
    author: authorsMap[m.author_id] || null,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  }));
};

const update = async (id, content, userId) => {
  const message = await Message.findById(id);

  if (!message) {
    throw new AppError(404, "Message not found.");
  }

  if (message.author_id !== userId) {
    throw new AppError(403, "You can only edit your own messages.");
  }

  const channel = await prisma.channel.findUnique({
    where: { id: message.channel_id },
    select: { serverId: true },
  });

  message.content = content;
  await message.save();

  const author = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      img: true,
    },
  });

  const messageData = {
    id: message._id,
    content: message.content,
    type: message.type,
    channelId: message.channel_id,
    author,
    updatedAt: message.updated_at,
  };

  emitToServer(channel.serverId, EVENTS.MESSAGE_UPDATED, {
    message: messageData,
  });

  return messageData;
};

const remove = async (id, userId) => {
  const message = await Message.findById(id);

  if (!message) {
    throw new AppError(404, "Message not found.");
  }

  const channel = await prisma.channel.findUnique({
    where: { id: message.channel_id },
    select: { serverId: true },
  });

  if (message.author_id !== userId) {
    const member = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId,
          serverId: channel.serverId,
        },
      },
    });

    if (!member || !["OWNER", "ADMIN", "MODERATOR"].includes(member.role)) {
      throw new AppError(403, "You don't have permission to delete this message.");
    }
  }

  await Message.findByIdAndDelete(id);

  emitToServer(channel.serverId, EVENTS.MESSAGE_DELETED, {
    messageId: id,
    channelId: message.channel_id,
  });
};

module.exports = { create, findAll, update, remove };
