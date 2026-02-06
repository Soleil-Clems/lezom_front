const channelService = require("../services/channel.service");
const AppError = require("../utils/AppError");

const createChannel = async (req, res) => {
  try {
    const channel = await channelService.create(req.body, req.user.id);
    res.status(201).json({
      message: "Channel created successfully.",
      channel,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("CreateChannel error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getChannels = async (req, res) => {
  try {
    const channels = await channelService.findAll(req.params.serverId, req.user.id);
    res.json({ channels });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("GetChannels error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getChannel = async (req, res) => {
  try {
    const channel = await channelService.findOne(req.params.id);
    res.json({ channel });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("GetChannel error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateChannel = async (req, res) => {
  try {
    const channel = await channelService.update(req.params.id, req.body);
    res.json({
      message: "Channel updated successfully.",
      channel,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("UpdateChannel error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteChannel = async (req, res) => {
  try {
    await channelService.remove(req.params.id, req.channel.serverId);
    res.json({ message: "Channel deleted successfully." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
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
