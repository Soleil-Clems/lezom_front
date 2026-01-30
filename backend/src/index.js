require("dotenv").config();

const http = require("http");
const app = require("./app");
const { connectMongoDB, connectPrisma } = require("./config/database");
const { initSocket } = require("./config/socket");

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await connectMongoDB();
    await connectPrisma();

    const httpServer = http.createServer(app);
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket ready`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
