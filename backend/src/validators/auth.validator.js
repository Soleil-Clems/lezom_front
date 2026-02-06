const Joi = require("joi");
const { passwordSchema } = require("./schemas");

const registerSchema = Joi.object({
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
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
});

module.exports = { registerSchema, loginSchema };
