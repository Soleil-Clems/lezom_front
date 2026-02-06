const { prisma } = require("../config/database");

/**
 * Check if user is a member of the server
 */
const isMember = async (req, res, next) => {
  try {
    const serverId = req.params.id || req.params.serverId;

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

    req.member = member;
    next();
  } catch (error) {
    console.error("isMember error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Check if user has required role in the server
 * @param {string[]} roles - Allowed roles (e.g., ["OWNER", "ADMIN"])
 */
const hasServerRole = (roles) => async (req, res, next) => {
  try {
    const serverId = req.params.id || req.params.serverId;

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

    if (!roles.includes(member.role)) {
      return res.status(403).json({ message: "You don't have permission to perform this action." });
    }

    req.member = member;
    next();
  } catch (error) {
    console.error("hasServerRole error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Check if user is banned from the server
 */
const isNotBanned = async (req, res, next) => {
  try {
    const serverId = req.params.id || req.params.serverId;

    const ban = await prisma.ban.findUnique({
      where: {
        serverId_userId: {
          serverId,
          userId: req.user.id,
        },
      },
    });

    if (ban) {
      return res.status(403).json({ message: "You are banned from this server." });
    }

    next();
  } catch (error) {
    console.error("isNotBanned error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { isMember, hasServerRole, isNotBanned };
