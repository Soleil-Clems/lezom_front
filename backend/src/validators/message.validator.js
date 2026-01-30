const Joi = require("joi");

const createMessageSchema = Joi.object({
  content: Joi.string().min(1).required().messages({
    "string.min": "Message content is required.",
    "any.required": "Message content is required.",
  }),
  channelId: Joi.string().required().messages({
    "any.required": "Channel ID is required.",
  }),
});

const updateMessageSchema = Joi.object({
  content: Joi.string().min(1).required().messages({
    "string.min": "Message content is required.",
    "any.required": "Message content is required.",
  }),
});

module.exports = {
  createMessageSchema,
  updateMessageSchema,
};
