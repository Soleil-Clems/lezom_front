const { prisma } = require("../config/database");
const crypto = require("crypto");
const { emitToServer, emitToUser, EVENTS } = require("../utils/socketEvents");

const createServer = async (req, res) => {
  try {
    const { name } = req.body;

    const server = await prisma.server.create({
      data: {
        name,
        ownerId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        members: {
          where: { userId: req.user.id },
          select: { role: true },
        },
      },
    });

    res.status(201).json({
      message: "Server created successfully.",
      server: {
        id: server.id,
        name: server.name,
        ownerId: server.ownerId,
        createdAt: server.createdAt,
        role: server.members[0].role,
      },
    });
  } catch (error) {
    console.error("CreateServer error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getServers = async (req, res) => {
  try {
    const memberships = await prisma.serverMember.findMany({
      where: { userId: req.user.id },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            ownerId: true,
            createdAt: true,
          },
        },
      },
    });

    const servers = memberships.map((m) => ({
      ...m.server,
      role: m.role,
    }));

    res.json({ servers });
  } catch (error) {
    console.error("GetServers error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getServer = async (req, res) => {
  try {
    const { id } = req.params;

    const server = await prisma.server.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        ownerId: true,
        createdAt: true,
        _count: {
          select: { members: true },
        },
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server not found." });
    }

    res.json({
      server: {
        id: server.id,
        name: server.name,
        ownerId: server.ownerId,
        createdAt: server.createdAt,
        memberCount: server._count.members,
        role: req.member.role,
      },
    });
  } catch (error) {
    console.error("GetServer error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateServer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const server = await prisma.server.update({
      where: { id },
      data: { name },
      select: {
        id: true,
        name: true,
        ownerId: true,
        createdAt: true,
      },
    });

    emitToServer(id, EVENTS.SERVER_UPDATED, { server });

    res.json({
      message: "Server updated successfully.",
      server,
    });
  } catch (error) {
    console.error("UpdateServer error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteServer = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.member.role !== "OWNER") {
      return res.status(403).json({ message: "Only the owner can delete the server." });
    }

    emitToServer(id, EVENTS.SERVER_DELETED, { serverId: id });

    await prisma.server.delete({ where: { id } });

    res.json({ message: "Server deleted successfully." });
  } catch (error) {
    console.error("DeleteServer error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const members = await prisma.serverMember.findMany({
      where: { serverId: id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            status: true,
          },
        },
      },
      orderBy: [
        { role: "asc" },
        { joinedAt: "asc" },
      ],
    });

    res.json({
      members: members.map((m) => ({
        userId: m.user.id,
        username: m.user.username,
        firstname: m.user.firstname,
        lastname: m.user.lastname,
        status: m.user.status,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
    });
  } catch (error) {
    console.error("GetMembers error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { role } = req.body;

    const targetMember = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId,
          serverId: id,
        },
      },
    });

    if (!targetMember) {
      return res.status(404).json({ message: "Member not found." });
    }

    if (targetMember.role === "OWNER") {
      return res.status(403).json({ message: "Cannot modify the server owner." });
    }

    if (req.member.role === "ADMIN" && targetMember.role !== "MEMBER") {
      return res.status(403).json({ message: "Admins can only manage members." });
    }

    if (role === "OWNER") {
      return res.status(400).json({ message: "Use transfer ownership to change owner." });
    }

    const updated = await prisma.serverMember.update({
      where: {
        userId_serverId: {
          userId,
          serverId: id,
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

    emitToServer(id, EVENTS.MEMBER_ROLE_CHANGED, {
      serverId: id,
      userId: updated.user.id,
      username: updated.user.username,
      role: updated.role,
    });

    res.json({
      message: "Member role updated successfully.",
      member: {
        userId: updated.user.id,
        username: updated.user.username,
        role: updated.role,
      },
    });
  } catch (error) {
    console.error("UpdateMemberRole error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const kickMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ message: "Use leave endpoint to leave the server." });
    }

    const targetMember = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId,
          serverId: id,
        },
      },
    });

    if (!targetMember) {
      return res.status(404).json({ message: "Member not found." });
    }

    if (targetMember.role === "OWNER") {
      return res.status(403).json({ message: "Cannot kick the server owner." });
    }

    if (req.member.role === "ADMIN" && targetMember.role !== "MEMBER") {
      return res.status(403).json({ message: "Admins can only kick members." });
    }

    await prisma.serverMember.delete({
      where: {
        userId_serverId: {
          userId,
          serverId: id,
        },
      },
    });

    emitToServer(id, EVENTS.MEMBER_KICKED, {
      serverId: id,
      userId,
      kickedBy: req.user.id,
    });

    emitToUser(userId, EVENTS.MEMBER_KICKED, {
      serverId: id,
      kickedBy: req.user.id,
    });

    res.json({ message: "Member kicked successfully." });
  } catch (error) {
    console.error("KickMember error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const leaveServer = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.member.role === "OWNER") {
      return res.status(400).json({
        message: "Owner cannot leave the server. Transfer ownership first.",
      });
    }

    await prisma.serverMember.delete({
      where: {
        userId_serverId: {
          userId: req.user.id,
          serverId: id,
        },
      },
    });

    emitToServer(id, EVENTS.MEMBER_LEFT, {
      serverId: id,
      userId: req.user.id,
    });

    res.json({ message: "You have left the server." });
  } catch (error) {
    console.error("LeaveServer error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const transferOwnership = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (req.member.role !== "OWNER") {
      return res.status(403).json({ message: "Only the owner can transfer ownership." });
    }

    if (userId === req.user.id) {
      return res.status(400).json({ message: "You are already the owner." });
    }

    const targetMember = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId,
          serverId: id,
        },
      },
    });

    if (!targetMember) {
      return res.status(404).json({ message: "Member not found." });
    }

    await prisma.$transaction([
      prisma.serverMember.update({
        where: {
          userId_serverId: {
            serverId: id,
            userId,
          },
        },
        data: { role: "OWNER" },
      }),
      prisma.serverMember.update({
        where: {
          userId_serverId: {
            serverId: id,
            userId: req.user.id,
          },
        },
        data: { role: "ADMIN" },
      }),
      prisma.server.update({
        where: { id },
        data: { ownerId: userId },
      }),
    ]);

    emitToServer(id, EVENTS.SERVER_OWNER_CHANGED, {
      serverId: id,
      newOwnerId: userId,
      previousOwnerId: req.user.id,
    });

    res.json({ message: "Ownership transferred successfully." });
  } catch (error) {
    console.error("TransferOwnership error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const createInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { maxUses, expiresIn } = req.body;

    const code = crypto.randomBytes(8).toString("hex");

    const invitation = await prisma.invitation.create({
      data: {
        code,
        serverId: id,
        createdBy: req.user.id,
        maxUses: maxUses || null,
        expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : null,
      },
    });

    res.status(201).json({
      message: "Invitation created successfully.",
      invitation: {
        id: invitation.id,
        code: invitation.code,
        maxUses: invitation.maxUses,
        uses: invitation.usesCount,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt,
      },
    });
  } catch (error) {
    console.error("CreateInvitation error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getInvitations = async (req, res) => {
  try {
    const { id } = req.params;

    const invitations = await prisma.invitation.findMany({
      where: { serverId: id },
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

    res.json({ invitations });
  } catch (error) {
    console.error("GetInvitations error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteInvitation = async (req, res) => {
  try {
    const { id, invitationId } = req.params;

    const invitation = await prisma.invitation.findFirst({
      where: {
        id: invitationId,
        serverId: id,
      },
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found." });
    }

    await prisma.invitation.delete({ where: { id: invitationId } });

    res.json({ message: "Invitation deleted successfully." });
  } catch (error) {
    console.error("DeleteInvitation error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const joinServer = async (req, res) => {
  try {
    const { code } = req.params;

    const invitation = await prisma.invitation.findUnique({
      where: { code },
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invalid invitation code." });
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invitation has expired." });
    }

    if (invitation.maxUses && invitation.usesCount >= invitation.maxUses) {
      return res.status(400).json({ message: "Invitation has reached maximum uses." });
    }

    const existingMember = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId: req.user.id,
          serverId: invitation.serverId,
        },
      },
    });

    if (existingMember) {
      return res.status(400).json({ message: "You are already a member of this server." });
    }

    const ban = await prisma.ban.findUnique({
      where: {
        serverId_userId: {
          serverId: invitation.serverId,
          userId: req.user.id,
        },
      },
    });

    if (ban) {
      return res.status(403).json({ message: "You are banned from this server." });
    }

    await prisma.$transaction([
      prisma.serverMember.create({
        data: {
          serverId: invitation.serverId,
          userId: req.user.id,
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
        ownerId: true,
        createdAt: true,
      },
    });

    emitToServer(invitation.serverId, EVENTS.MEMBER_JOINED, {
      serverId: invitation.serverId,
      userId: req.user.id,
      username: req.user.username,
      role: "MEMBER",
      joinedAt: new Date(),
    });

    res.status(201).json({
      message: "Joined server successfully.",
      server: {
        ...server,
        role: "MEMBER",
      },
    });
  } catch (error) {
    console.error("JoinServer error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createServer,
  getServers,
  getServer,
  updateServer,
  deleteServer,
  getMembers,
  updateMemberRole,
  kickMember,
  leaveServer,
  transferOwnership,
  createInvitation,
  getInvitations,
  deleteInvitation,
  joinServer,
};
