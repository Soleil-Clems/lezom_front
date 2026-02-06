const { prisma } = require("../config/database");
const {
  hashPassword,
  isEmailTaken,
  isUsernameTaken,
} = require("../utils/user.utils");

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ users });
  } catch (error) {
    console.error("GetAllUsers error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ user });
  } catch (error) {
    console.error("GetUserById error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, username, firstname, lastname, role } = req.body;

    if (await isEmailTaken(email)) {
      return res.status(400).json({ message: "Email already in use." });
    }
    if (await isUsernameTaken(username)) {
      return res.status(400).json({ message: "Username already in use." });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        firstname,
        lastname,
        role: role || "MEMBER",
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "User created successfully.",
      user,
    });
  } catch (error) {
    console.error("CreateUser error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, firstname, lastname, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (email && (await isEmailTaken(email, id))) {
      return res.status(400).json({ message: "Email already in use." });
    }
    if (username && (await isUsernameTaken(username, id))) {
      return res.status(400).json({ message: "Username already in use." });
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (email) updateData.email = email;
    if (password) updateData.password = await hashPassword(password);
    if (role) updateData.role = role;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    res.json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UpdateUser error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (id === req.user.id) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account from admin panel." });
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("DeleteUser error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
