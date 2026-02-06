const userService = require("../services/user.service");
const AppError = require("../utils/AppError");

const getMe = async (req, res) => {
  try {
    const user = await userService.getMe(req.user.id);
    res.json({ user });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateMe = async (req, res) => {
  try {
    const updatedUser = await userService.updateMe(req.user.id, req.body);
    res.json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("UpdateMe error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    res.json({ user });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("GetUser error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteMe = async (req, res) => {
  try {
    await userService.deleteMe(req.user.id);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
    });

    res.json({ message: "Account deleted successfully." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("DeleteMe error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updatePicture = async (req, res) => {
  try {
    const { id } = req.params;

    if (id !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own picture." });
    }

    const updatedUser = await userService.updatePicture(id, req.file);
    res.json({
      message: "Profile picture updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("UpdatePicture error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { getMe, getUser, updateMe, deleteMe, updatePicture };
