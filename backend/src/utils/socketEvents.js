const { getIO } = require("../config/socket");

/**
 * Emit event to all members of a server
 */
const emitToServer = (serverId, event, data) => {
  const io = getIO();
  io.to(`server:${serverId}`).emit(event, data);
};

/**
 * Emit event to a specific channel
 */
const emitToChannel = (channelId, event, data) => {
  const io = getIO();
  io.to(`channel:${channelId}`).emit(event, data);
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
  MEMBER_BANNED: "member:banned",
  MEMBER_UNBANNED: "member:unbanned",
  MEMBER_ROLE_CHANGED: "member:roleChanged",
  SERVER_OWNER_CHANGED: "server:ownerChanged",
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",
  CHANNEL_CREATED: "channel:created",
  CHANNEL_UPDATED: "channel:updated",
  CHANNEL_DELETED: "channel:deleted",
  MESSAGE_CREATED: "message:created",
  MESSAGE_UPDATED: "message:updated",
  MESSAGE_DELETED: "message:deleted",
  USER_TYPING: "user:typing",
  DM_MESSAGE_CREATED: "dm:messageCreated",
  DM_MESSAGE_UPDATED: "dm:messageUpdated",
  DM_MESSAGE_DELETED: "dm:messageDeleted",
  DM_TYPING: "dm:typing",
  DM_STOP_TYPING: "dm:stopTyping",
};

module.exports = {
  emitToServer,
  emitToChannel,
  emitToUser,
  EVENTS,
};
