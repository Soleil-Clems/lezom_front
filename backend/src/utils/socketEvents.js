const { getIO } = require("../config/socket");

/**
 * Emit event to all members of a server
 */
const emitToServer = (serverId, event, data) => {
  const io = getIO();
  io.to(`server:${serverId}`).emit(event, data);
};

/**
 * Emit event to a specific user
 */
const emitToUser = (userId, event, data) => {
  const io = getIO();
  io.to(`user:${userId}`).emit(event, data);
};

const EVENTS = {
  SERVER_UPDATED: "server:updated",
  SERVER_DELETED: "server:deleted",
  MEMBER_JOINED: "member:joined",
  MEMBER_LEFT: "member:left",
  MEMBER_KICKED: "member:kicked",
  MEMBER_ROLE_CHANGED: "member:roleChanged",
  SERVER_OWNER_CHANGED: "server:ownerChanged",
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",
  CHANNEL_CREATED: "channel:created",
  CHANNEL_UPDATED: "channel:updated",
  CHANNEL_DELETED: "channel:deleted",
  MESSAGE_CREATED: "message:created",
  MESSAGE_DELETED: "message:deleted",
  USER_TYPING: "user:typing",
};

module.exports = {
  emitToServer,
  emitToUser,
  EVENTS,
};
