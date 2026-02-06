const { prisma } = require("../config/database");
const PrivateMessage = require("../models/PrivateMessage");
const { emitToUser, EVENTS } = require("../utils/socketEvents");
const AppError = require("../utils/AppError");

const createOrGet = async (userId, otherUserId) => {
  if (otherUserId === userId) {
    throw new AppError(400, "You cannot create a conversation with yourself.");
  }

  const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } });
  if (!otherUser) {
    throw new AppError(404, "User not found.");
  }

  const [user1Id, user2Id] =
    userId < otherUserId ? [userId, otherUserId] : [otherUserId, userId];

  let conversation = await prisma.conversation.findUnique({
    where: {
      user1Id_user2Id: { user1Id, user2Id },
    },
    include: {
      user1: {
        select: { id: true, username: true, img: true, status: true },
      },
      user2: {
        select: { id: true, username: true, img: true, status: true },
      },
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { user1Id, user2Id },
      include: {
        user1: {
          select: { id: true, username: true, img: true, status: true },
        },
        user2: {
          select: { id: true, username: true, img: true, status: true },
        },
      },
    });
  }

  return conversation;
};

const findAll = async (userId) => {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
    include: {
      user1: {
        select: { id: true, username: true, img: true, status: true },
      },
      user2: {
        select: { id: true, username: true, img: true, status: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return conversations;
};

const findOne = async (id, userId) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      user1: {
        select: { id: true, username: true, img: true, status: true },
      },
      user2: {
        select: { id: true, username: true, img: true, status: true },
      },
    },
  });

  if (!conversation) {
    throw new AppError(404, "Conversation not found.");
  }

  if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
    throw new AppError(403, "You are not a participant in this conversation.");
  }

  return conversation;
};

const findMessages = async (id, userId, page, limit) => {
  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation) {
    throw new AppError(404, "Conversation not found.");
  }

  if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
    throw new AppError(403, "You are not a participant in this conversation.");
  }

  const total = await PrivateMessage.countDocuments({ conversation_id: id });
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;

  const messages = await PrivateMessage.find({ conversation_id: id })
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  messages.reverse();

  const senderIds = [...new Set(messages.map((m) => m.sender_id))];
  const senders = await prisma.user.findMany({
    where: { id: { in: senderIds } },
    select: { id: true, username: true, img: true },
  });
  const sendersMap = senders.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  const formatted = messages.map((m) => ({
    id: m._id,
    content: m.content,
    type: m.type,
    conversationId: m.conversation_id,
    sender: sendersMap[m.sender_id] || null,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  }));

  return {
    messages: formatted,
    meta: { total, page, limit, totalPages },
  };
};

const createMessage = async (conversationId, senderId, content, type) => {
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) {
    throw new AppError(404, "Conversation not found.");
  }

  if (conversation.user1Id !== senderId && conversation.user2Id !== senderId) {
    throw new AppError(403, "You are not a participant in this conversation.");
  }

  const message = await PrivateMessage.create({
    conversation_id: conversationId,
    sender_id: senderId,
    content,
    type: type || "text",
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  const sender = await prisma.user.findUnique({
    where: { id: senderId },
    select: { id: true, username: true, img: true },
  });

  const messageData = {
    id: message._id,
    content: message.content,
    type: message.type,
    conversationId: message.conversation_id,
    sender,
    createdAt: message.created_at,
  };

  const otherUserId =
    conversation.user1Id === senderId ? conversation.user2Id : conversation.user1Id;

  emitToUser(otherUserId, EVENTS.DM_MESSAGE_CREATED, { message: messageData });
  emitToUser(senderId, EVENTS.DM_MESSAGE_CREATED, { message: messageData });

  return messageData;
};

const updateMessage = async (id, content, userId) => {
  const message = await PrivateMessage.findById(id);
  if (!message) {
    throw new AppError(404, "Message not found.");
  }

  if (message.sender_id !== userId) {
    throw new AppError(403, "You can only edit your own messages.");
  }

  message.content = content;
  await message.save();

  const conversation = await prisma.conversation.findUnique({
    where: { id: message.conversation_id },
  });

  const otherUserId =
    conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;

  const messageData = {
    id: message._id,
    content: message.content,
    type: message.type,
    conversationId: message.conversation_id,
    updatedAt: message.updated_at,
  };

  emitToUser(otherUserId, EVENTS.DM_MESSAGE_UPDATED, { message: messageData });
  emitToUser(userId, EVENTS.DM_MESSAGE_UPDATED, { message: messageData });

  return messageData;
};

const deleteMessage = async (id, userId) => {
  const message = await PrivateMessage.findById(id);
  if (!message) {
    throw new AppError(404, "Message not found.");
  }

  if (message.sender_id !== userId) {
    throw new AppError(403, "You can only delete your own messages.");
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: message.conversation_id },
  });

  await PrivateMessage.findByIdAndDelete(id);

  const otherUserId =
    conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;

  emitToUser(otherUserId, EVENTS.DM_MESSAGE_DELETED, {
    messageId: id,
    conversationId: message.conversation_id,
  });
  emitToUser(userId, EVENTS.DM_MESSAGE_DELETED, {
    messageId: id,
    conversationId: message.conversation_id,
  });
};

module.exports = {
  createOrGet,
  findAll,
  findOne,
  findMessages,
  createMessage,
  updateMessage,
  deleteMessage,
};
