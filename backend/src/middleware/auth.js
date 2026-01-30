const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const { prisma } = require("../config/database");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    console.error("VerifyAdmin error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { verifyToken, verifyAdmin };
