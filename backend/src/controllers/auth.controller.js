const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../config/database");
const { secret, options, cookieOptions } = require("../config/jwt");

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

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    const isValidPassword = await bcrypt.compare(password, user.password);
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

const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ user });
  } catch (error) {
    console.error("Me error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { register, login, logout, me };
