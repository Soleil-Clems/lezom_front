const { prisma } = require("../config/database");

/**
 * Check if user is a member of the server that the channel belongs to
 */
const isChannelMember = async (req, res, next) => {
  try {
    const channelId = req.params.id;

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { serverId: true },
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

    req.member = member;
    req.channel = channel;
    next();
  } catch (error) {
    console.error("isChannelMember error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Check if user has required role in the server that the channel belongs to
 * @param {string[]} roles - Allowed roles (e.g., ["OWNER", "ADMIN"])
 */
const hasChannelRole = (roles) => async (req, res, next) => {
  try {
    const channelId = req.params.id;

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { serverId: true },
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

    if (!roles.includes(member.role)) {
      return res.status(403).json({ message: "You don't have permission to perform this action." });
    }

    req.member = member;
    req.channel = channel;
    next();
  } catch (error) {
    console.error("hasChannelRole error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { isChannelMember, hasChannelRole };
