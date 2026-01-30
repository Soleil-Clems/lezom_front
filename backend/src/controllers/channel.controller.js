const { prisma } = require("../config/database");
const { emitToServer, EVENTS } = require("../utils/socketEvents");

const createChannel = async (req, res) => {
  try {
    const { serverId, name, description } = req.body;

    // Verify user is ADMIN or OWNER of the server
    const member = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId: req.user.id,
          serverId,
        },
      },
    });

    if (!member) {
      return res.status(403).json({ message: "You are not a member of this server." });
    }

    if (!["OWNER", "ADMIN"].includes(member.role)) {
      return res.status(403).json({ message: "You don't have permission to perform this action." });
    }

    const channel = await prisma.channel.create({
      data: {
        name,
        description: description || null,
        serverId,
      },
    });

    emitToServer(serverId, EVENTS.CHANNEL_CREATED, {
      channel: {
        id: channel.id,
        serverId: channel.serverId,
        name: channel.name,
        description: channel.description,
        createdAt: channel.createdAt,
      },
    });

    res.status(201).json({
      message: "Channel created successfully.",
      channel: {
        id: channel.id,
        serverId: channel.serverId,
        name: channel.name,
        description: channel.description,
        createdAt: channel.createdAt,
      },
    });
  } catch (error) {
    console.error("CreateChannel error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getChannels = async (req, res) => {
  try {
    const { serverId } = req.params;

    // Verify user is a member of the server
    const member = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId: req.user.id,
          serverId,
        },
      },
    });

    if (!member) {
      return res.status(403).json({ message: "You are not a member of this server." });
    }

    const channels = await prisma.channel.findMany({
      where: { serverId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    res.json({ channels });
  } catch (error) {
    console.error("GetChannels error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await prisma.channel.findUnique({
      where: { id },
      select: {
        id: true,
        serverId: true,
        name: true,
        description: true,
        createdAt: true,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    res.json({ channel });
  } catch (error) {
    console.error("GetChannel error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;

    const channel = await prisma.channel.update({
      where: { id },
      data,
      select: {
        id: true,
        serverId: true,
        name: true,
        description: true,
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
        updatedAt: channel.updatedAt,
      },
    });

    res.json({
      message: "Channel updated successfully.",
      channel,
    });
  } catch (error) {
    console.error("UpdateChannel error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { serverId } = req.channel;

    await prisma.channel.delete({ where: { id } });

    emitToServer(serverId, EVENTS.CHANNEL_DELETED, {
      channelId: id,
      serverId,
    });

    res.json({ message: "Channel deleted successfully." });
  } catch (error) {
    console.error("DeleteChannel error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createChannel,
  getChannels,
  getChannel,
  updateChannel,
  deleteChannel,
};
