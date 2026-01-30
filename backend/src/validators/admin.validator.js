const Joi = require("joi");
const { passwordSchema } = require("./schemas");

const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
  password: passwordSchema.required().messages({
    "any.required": "Password is required.",
  }),
  username: Joi.string().max(32).required().messages({
    "string.max": "Username must be at most 32 characters.",
    "any.required": "Username is required.",
  }),
  firstname: Joi.string().max(50).required().messages({
    "string.max": "Firstname must be at most 50 characters.",
    "any.required": "Firstname is required.",
  }),
  lastname: Joi.string().max(50).required().messages({
    "string.max": "Lastname must be at most 50 characters.",
    "any.required": "Lastname is required.",
  }),
  role: Joi.string().valid("MEMBER", "ADMIN").messages({
    "any.only": "Role must be MEMBER or ADMIN.",
  }),
});

const updateUserSchema = Joi.object({
  username: Joi.string().max(32).messages({
    "string.max": "Username must be at most 32 characters.",
  }),
  firstname: Joi.string().max(50).messages({
    "string.max": "Firstname must be at most 50 characters.",
  }),
  lastname: Joi.string().max(50).messages({
    "string.max": "Lastname must be at most 50 characters.",
  }),
  email: Joi.string().email().messages({
    "string.email": "Invalid email format.",
  }),
  password: passwordSchema,
  role: Joi.string().valid("MEMBER", "ADMIN").messages({
    "any.only": "Role must be MEMBER or ADMIN.",
  }),
})
  .min(1)
  .messages({
    "object.min": "No fields to update.",
  });

module.exports = { createUserSchema, updateUserSchema };
