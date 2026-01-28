require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { connectMongoDB, connectPrisma } = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

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
