const jwt = require("jsonwebtoken");
const { prisma } = require("../config/database");
const { secret, options, cookieOptions } = require("../config/jwt");
const {
  validatePassword,
  hashPassword,
  comparePassword,
  isEmailTaken,
  isUsernameTaken,
} = require("../utils/user.utils");

const register = async (req, res) => {
  try {
    const { email, password, username, firstname, lastname } = req.body;

    if (!email || !password || !username || !firstname || !lastname) {
      return res
        .status(400)
        .json({
          message:
            "All fields are required (email, password, username, firstname, lastname).",
        });
    }

    if (await isEmailTaken(email)) {
      return res.status(400).json({ message: "Email already in use." });
    }
    if (await isUsernameTaken(username)) {
      return res.status(400).json({ message: "Username already in use." });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        firstname,
        lastname,
      },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, secret, options);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secret, options);

    res.cookie("token", token, cookieOptions);

    res.json({
      message: "Logged in successfully.",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out successfully." });
};

module.exports = { register, login, logout };
