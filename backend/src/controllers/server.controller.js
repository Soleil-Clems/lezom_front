const serverService = require("../services/server.service");
const AppError = require("../utils/AppError");

const createServer = async (req, res) => {
  try {
    const server = await serverService.create(req.body.name, req.user.id);
    res.status(201).json({
      message: "Server created successfully.",
      server,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("CreateServer error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getServers = async (req, res) => {
  try {
    const servers = await serverService.findAll(req.user.id);
    res.json({ servers });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("GetServers error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getServer = async (req, res) => {
  try {
    const server = await serverService.findOne(req.params.id, req.member);
    res.json({ server });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("GetServer error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateServer = async (req, res) => {
  try {
    const server = await serverService.update(req.params.id, req.body);
    res.json({
      message: "Server updated successfully.",
      server,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("UpdateServer error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteServer = async (req, res) => {
  try {
    await serverService.remove(req.params.id, req.member.role);
    res.json({ message: "Server deleted successfully." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("DeleteServer error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getMembers = async (req, res) => {
  try {
    const result = await serverService.getMembers(req.params.id, req.query);
    res.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("GetMembers error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const member = await serverService.updateMemberRole(
      req.params.id,
      req.params.userId,
      req.body.role,
      req.member
    );
    res.json({
      message: "Member role updated successfully.",
      member,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("UpdateMemberRole error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const kickMember = async (req, res) => {
  try {
    await serverService.kickMember(req.params.id, req.params.userId, {
      userId: req.user.id,
      role: req.member.role,
    });
    res.json({ message: "Member kicked successfully." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("KickMember error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const leaveServer = async (req, res) => {
  try {
    await serverService.leave(req.params.id, req.user.id, req.member.role);
    res.json({ message: "You have left the server." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("LeaveServer error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const transferOwnership = async (req, res) => {
  try {
    await serverService.transferOwnership(
      req.params.id,
      req.params.userId,
      req.user.id,
      req.member.role
    );
    res.json({ message: "Ownership transferred successfully." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("TransferOwnership error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const createInvitation = async (req, res) => {
  try {
    const invitation = await serverService.createInvitation(
      req.params.id,
      req.user.id,
      req.body
    );
    res.status(201).json({
      message: "Invitation created successfully.",
      invitation,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("CreateInvitation error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getInvitations = async (req, res) => {
  try {
    const invitations = await serverService.getInvitations(req.params.id);
    res.json({ invitations });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("GetInvitations error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteInvitation = async (req, res) => {
  try {
    await serverService.deleteInvitation(req.params.id, req.params.invitationId);
    res.json({ message: "Invitation deleted successfully." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("DeleteInvitation error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const joinServer = async (req, res) => {
  try {
    const server = await serverService.joinByCode(req.params.code, req.user.id);
    res.status(201).json({
      message: "Joined server successfully.",
      server,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
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
