const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const { secret } = require("./jwt");
const { prisma } = require("./database");

let io;

const userSockets = new Map();

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
      const userId = socket.user.id;
      console.log(`User connected: ${userId}`);

      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId).add(socket.id);

      const isFirstConnection = userSockets.get(userId).size === 1;

      socket.join(`user:${userId}`);

      if (isFirstConnection) {
        await prisma.user.update({
          where: { id: userId },
          data: { status: "online" },
        });
      }

      const memberships = await prisma.serverMember.findMany({
        where: { userId },
        select: { serverId: true },
      });

      memberships.forEach((m) => {
        socket.join(`server:${m.serverId}`);
      });

      console.log(`User ${userId} joined ${memberships.length} server rooms`);

      if (isFirstConnection) {
        memberships.forEach((m) => {
          socket.to(`server:${m.serverId}`).emit("user:online", {
            userId,
          });
        });
      }

      socket.on("server:join", async (serverId) => {
        const isMember = await prisma.serverMember.findFirst({
          where: { serverId, userId },
        });
        if (isMember) {
          socket.join(`server:${serverId}`);
        }
      });

      socket.on("server:leave", (serverId) => {
        socket.leave(`server:${serverId}`);
      });

      socket.on("channel:join", (channelId) => {
        socket.join(`channel:${channelId}`);
      });

      socket.on("channel:leave", (channelId) => {
        socket.leave(`channel:${channelId}`);
      });

      socket.on("typing", ({ channelId, isTyping }) => {
        socket.to(`channel:${channelId}`).emit("user:typing", {
          userId,
          username: socket.user.username,
          channelId,
          isTyping,
        });
      });

      socket.on("dm:typing", ({ conversationId, targetUserId }) => {
        io.to(`user:${targetUserId}`).emit("dm:typing", {
          conversationId,
          userId,
        });
      });

      socket.on("dm:stopTyping", ({ conversationId, targetUserId }) => {
        io.to(`user:${targetUserId}`).emit("dm:stopTyping", {
          conversationId,
          userId,
        });
      });

      socket.on("disconnect", async () => {
        console.log(`User disconnected: ${userId}`);

        const sockets = userSockets.get(userId);
        if (sockets) {
          sockets.delete(socket.id);

          if (sockets.size === 0) {
            userSockets.delete(userId);

            await prisma.user.update({
              where: { id: userId },
              data: { status: "offline", lastSeen: new Date() },
            });

            memberships.forEach((m) => {
              socket.to(`server:${m.serverId}`).emit("user:offline", {
                userId,
              });
            });
          }
        }
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
