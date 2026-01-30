const Joi = require("joi");

const createChannelSchema = Joi.object({
  serverId: Joi.string().required().messages({
    "any.required": "Server ID is required.",
  }),
  name: Joi.string().min(1).max(100).required().messages({
    "string.min": "Channel name is required.",
    "string.max": "Channel name must be at most 100 characters.",
    "any.required": "Channel name is required.",
  }),
  description: Joi.string().max(500).allow("", null).messages({
    "string.max": "Description must be at most 500 characters.",
  }),
});

const updateChannelSchema = Joi.object({
  name: Joi.string().min(1).max(100).messages({
    "string.min": "Channel name cannot be empty.",
    "string.max": "Channel name must be at most 100 characters.",
  }),
  description: Joi.string().max(500).allow("", null).messages({
    "string.max": "Description must be at most 500 characters.",
  }),
})
  .min(1)
  .messages({
    "object.min": "No fields to update.",
  });

module.exports = {
  createChannelSchema,
  updateChannelSchema,
};
