const { prisma } = require("../config/database");
const Message = require("../models/Message");
const { emitToServer, EVENTS } = require("../utils/socketEvents");

const createMessage = async (req, res) => {
  try {
    const { content, channelId } = req.body;

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { id: true, serverId: true },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    const member = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId: req.user.id,
          serverId: channel.serverId,
        },
      },
    });

    if (!member) {
      return res.status(403).json({ message: "You are not a member of this server." });
    }

    const message = await Message.create({
      channel_id: channelId,
      author_id: req.user.id,
      content,
    });

    const author = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
      },
    });

    emitToServer(channel.serverId, EVENTS.MESSAGE_CREATED, {
      message: {
        id: message._id,
        content: message.content,
        channelId: message.channel_id,
        author,
        createdAt: message.created_at,
      },
    });

    res.status(201).json({
      message: "Message created successfully.",
      data: {
        id: message._id,
        content: message.content,
        channelId: message.channel_id,
        author,
        createdAt: message.created_at,
      },
    });
  } catch (error) {
    console.error("CreateMessage error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: channelId } = req.params;

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { id: true, serverId: true },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    const member = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId: req.user.id,
          serverId: channel.serverId,
        },
      },
    });

    if (!member) {
      return res.status(403).json({ message: "You are not a member of this server." });
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
      },
    });

    const authorsMap = authors.reduce((acc, author) => {
      acc[author.id] = author;
      return acc;
    }, {});

    const messagesWithAuthors = messages.map((m) => ({
      id: m._id,
      content: m.content,
      channelId: m.channel_id,
      author: authorsMap[m.author_id] || null,
      createdAt: m.created_at,
      updatedAt: m.updated_at,
    }));

    res.json({ messages: messagesWithAuthors });
  } catch (error) {
    console.error("GetMessages error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    if (message.author_id !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own messages." });
    }

    const channel = await prisma.channel.findUnique({
      where: { id: message.channel_id },
      select: { serverId: true },
    });

    message.content = content;
    await message.save();

    const author = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
      },
    });

    emitToServer(channel.serverId, EVENTS.MESSAGE_UPDATED, {
      message: {
        id: message._id,
        content: message.content,
        channelId: message.channel_id,
        author,
        updatedAt: message.updated_at,
      },
    });

    res.json({
      message: "Message updated successfully.",
      data: {
        id: message._id,
        content: message.content,
        channelId: message.channel_id,
        author,
        updatedAt: message.updated_at,
      },
    });
  } catch (error) {
    console.error("UpdateMessage error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    const channel = await prisma.channel.findUnique({
      where: { id: message.channel_id },
      select: { serverId: true },
    });

    if (message.author_id !== req.user.id) {
      const member = await prisma.serverMember.findUnique({
        where: {
          userId_serverId: {
            userId: req.user.id,
            serverId: channel.serverId,
          },
        },
      });

      if (!member || !["OWNER", "ADMIN"].includes(member.role)) {
        return res.status(403).json({ message: "You don't have permission to delete this message." });
      }
    }

    await Message.findByIdAndDelete(id);

    emitToServer(channel.serverId, EVENTS.MESSAGE_DELETED, {
      messageId: id,
      channelId: message.channel_id,
    });

    res.json({ message: "Message deleted successfully." });
  } catch (error) {
    console.error("DeleteMessage error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
};
