const conversationService = require("../services/conversation.service");
const AppError = require("../utils/AppError");

const createOrGet = async (req, res) => {
  try {
    const conversation = await conversationService.createOrGet(req.user.id, req.body.userId);
    res.status(201).json({ conversation });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("CreateOrGetConversation error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const findAll = async (req, res) => {
  try {
    const conversations = await conversationService.findAll(req.user.id);
    res.json({ conversations });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("FindAllConversations error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const findOne = async (req, res) => {
  try {
    const conversation = await conversationService.findOne(req.params.id, req.user.id);
    res.json({ conversation });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("FindOneConversation error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const findMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    const result = await conversationService.findMessages(req.params.id, req.user.id, page, limit);
    res.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("FindMessages error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const createMessage = async (req, res) => {
  try {
    const { content, type } = req.body;
    const messageData = await conversationService.createMessage(
      req.params.id,
      req.user.id,
      content,
      type
    );
    res.status(201).json({
      message: "Message sent successfully.",
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

const updateMessage = async (req, res) => {
  try {
    const messageData = await conversationService.updateMessage(
      req.params.id,
      req.body.content,
      req.user.id
    );
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
    await conversationService.deleteMessage(req.params.id, req.user.id);
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
  createOrGet,
  findAll,
  findOne,
  findMessages,
  createMessage,
  updateMessage,
  deleteMessage,
};
