const { prisma } = require("../config/database");
const {
  hashPassword,
  comparePassword,
  isEmailTaken,
  isUsernameTaken,
} = require("../utils/user.utils");

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
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
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateMe = async (req, res) => {
  try {
    const { username, firstname, lastname, email, password, currentPassword } =
      req.body;

    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (password) {
      const isValidPassword = await comparePassword(
        currentPassword,
        currentUser.password
      );
      if (!isValidPassword) {
        return res.status(401).json({ message: "Current password is incorrect." });
      }
    }

    if (email && (await isEmailTaken(email, req.user.id))) {
      return res.status(400).json({ message: "Email already in use." });
    }
    if (username && (await isUsernameTaken(username, req.user.id))) {
      return res.status(400).json({ message: "Username already in use." });
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (email) updateData.email = email;
    if (password) updateData.password = await hashPassword(password);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
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
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UpdateMe error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.user.delete({
      where: { id: req.user.id },
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("DeleteMe error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { getMe, updateMe, deleteMe };
