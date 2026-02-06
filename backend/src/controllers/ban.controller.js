const banService = require("../services/ban.service");
const AppError = require("../utils/AppError");

const banUser = async (req, res) => {
  try {
    const { id: serverId } = req.params;
    const { userId, reason } = req.body;

    await banService.banUser(serverId, userId, {
      userId: req.user.id,
      role: req.member.role,
      reason,
    });

    res.json({ message: "User banned successfully." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("BanUser error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const unbanUser = async (req, res) => {
  try {
    const { id: serverId, userId } = req.params;
    await banService.unbanUser(serverId, userId);
    res.json({ message: "User unbanned successfully." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("UnbanUser error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getBans = async (req, res) => {
  try {
    const { id: serverId } = req.params;
    const bans = await banService.getBans(serverId);
    res.json({ bans });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("GetBans error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { banUser, unbanUser, getBans };
