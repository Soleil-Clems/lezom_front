require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const { connectMongoDB, connectPrisma } = require("./config/database");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const start = async () => {
  try {
    await connectMongoDB();
    await connectPrisma();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
