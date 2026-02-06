const messageService = require("../services/message.service");
const AppError = require("../utils/AppError");

const createMessage = async (req, res) => {
  try {
    const { content, channelId, type } = req.body;
    const messageData = await messageService.create(channelId, req.user.id, content, type);
    res.status(201).json({
      message: "Message created successfully.",
      data: messageData,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("CreateMessage error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await messageService.findAll(req.params.id, req.user.id);
    res.json({ messages });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("GetMessages error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateMessage = async (req, res) => {
  try {
    const messageData = await messageService.update(req.params.id, req.body.content, req.user.id);
    res.json({
      message: "Message updated successfully.",
      data: messageData,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("UpdateMessage error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteMessage = async (req, res) => {
  try {
    await messageService.remove(req.params.id, req.user.id);
    res.json({ message: "Message deleted successfully." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
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
