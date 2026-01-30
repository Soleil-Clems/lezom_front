const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const { secret } = require("./jwt");
const { prisma } = require("./database");

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, secret);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    try {
      console.log(`User connected: ${socket.user.id}`);

      socket.join(`user:${socket.user.id}`);

      await prisma.user.update({
        where: { id: socket.user.id },
        data: { status: "online" },
      });

      const memberships = await prisma.serverMember.findMany({
        where: { userId: socket.user.id },
        select: { serverId: true },
      });

      memberships.forEach((m) => {
        socket.join(`server:${m.serverId}`);
      });

      console.log(`User ${socket.user.id} joined ${memberships.length} server rooms`);

      memberships.forEach((m) => {
        socket.to(`server:${m.serverId}`).emit("user:online", {
          userId: socket.user.id,
        });
      });

      socket.on("server:join", async (serverId) => {
        const isMember = await prisma.serverMember.findFirst({
          where: { serverId, userId: socket.user.id },
        });
        if (isMember) {
          socket.join(`server:${serverId}`);
        }
      });

      socket.on("server:leave", (serverId) => {
        socket.leave(`server:${serverId}`);
      });

      socket.on("disconnect", async () => {
        console.log(`User disconnected: ${socket.user.id}`);

        await prisma.user.update({
          where: { id: socket.user.id },
          data: { status: "offline", lastSeen: new Date() },
        });

        memberships.forEach((m) => {
          socket.to(`server:${m.serverId}`).emit("user:offline", {
            userId: socket.user.id,
          });
        });
      });
    } catch (error) {
      console.error("Socket connection error:", error);
    }
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };
