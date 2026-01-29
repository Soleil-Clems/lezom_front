const Joi = require("joi");

const createServerSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.min": "Server name is required.",
    "string.max": "Server name must be at most 100 characters.",
    "any.required": "Server name is required.",
  }),
});

const updateServerSchema = Joi.object({
  name: Joi.string().min(1).max(100).messages({
    "string.min": "Server name cannot be empty.",
    "string.max": "Server name must be at most 100 characters.",
  }),
})
  .min(1)
  .messages({
    "object.min": "No fields to update.",
  });

const updateMemberRoleSchema = Joi.object({
  role: Joi.string().valid("ADMIN", "MEMBER").required().messages({
    "any.only": "Role must be ADMIN or MEMBER.",
    "any.required": "Role is required.",
  }),
});

const createInvitationSchema = Joi.object({
  maxUses: Joi.number().integer().min(1).max(100).allow(null).messages({
    "number.min": "Max uses must be at least 1.",
    "number.max": "Max uses cannot exceed 100.",
  }),
  expiresIn: Joi.number().integer().min(1).max(604800).allow(null).messages({
    "number.min": "Expiration must be at least 1 second.",
    "number.max": "Expiration cannot exceed 7 days (604800 seconds).",
  }),
});

module.exports = {
  createServerSchema,
  updateServerSchema,
  updateMemberRoleSchema,
  createInvitationSchema,
};
