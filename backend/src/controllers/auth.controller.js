const authService = require("../services/auth.service");
const { accessCookieOptions, refreshCookieOptions } = require("../config/jwt");
const AppError = require("../utils/AppError");

const register = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);

    res.cookie("token", accessToken, accessCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshCookieOptions);

    res.status(201).json({
      message: "User created successfully.",
      user,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    res.cookie("token", accessToken, accessCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshCookieOptions);

    res.json({
      message: "Logged in successfully.",
      user,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const refresh = async (req, res) => {
  try {
    const { accessToken } = await authService.refreshAccessToken(
      req.cookies.token,
      req.cookies.refresh_token
    );

    res.cookie("token", accessToken, accessCookieOptions);

    res.json({ message: "Token refreshed successfully." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Refresh error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const logout = async (req, res) => {
  try {
    await authService.logout(req.user?.id, req.cookies.refresh_token);

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

    res.json({ message: "Logged out successfully." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const logoutAll = async (req, res) => {
  try {
    await authService.logoutAll(req.user.id);

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

    res.json({ message: "All sessions logged out successfully." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("LogoutAll error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { register, login, refresh, logout, logoutAll };
