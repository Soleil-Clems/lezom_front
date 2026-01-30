const express = require("express");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const serverRoutes = require("./routes/server.routes");
const channelRoutes = require("./routes/channel.routes");
const messageRoutes = require("./routes/message.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/servers", serverRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
