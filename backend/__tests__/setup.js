process.env.JWT_SECRET = "test-secret-key-for-testing";
process.env.NODE_ENV = "test";

jest.mock("../src/config/jwt", () => ({
  secret: "test-secret-key-for-testing",
  accessOptions: { expiresIn: "15m" },
  refreshOptions: { expiresIn: "7d" },
  accessCookieOptions: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  },
  refreshCookieOptions: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  get options() {
    return this.accessOptions;
  },
  get cookieOptions() {
    return this.accessCookieOptions;
  },
}));

jest.mock("../src/config/database", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    server: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    channel: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    serverMember: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    channelMember: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    invitation: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    ban: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    refreshToken: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    conversation: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((callbacks) => Promise.all(callbacks)),
  },
}));

jest.mock("../src/utils/socketEvents", () => ({
  emitToServer: jest.fn(),
  emitToChannel: jest.fn(),
  emitToUser: jest.fn(),
  EVENTS: {
    SERVER_UPDATED: "server:updated",
    SERVER_DELETED: "server:deleted",
    SERVER_OWNER_CHANGED: "server:ownerChanged",
    MEMBER_JOINED: "member:joined",
    MEMBER_LEFT: "member:left",
    MEMBER_KICKED: "member:kicked",
    MEMBER_BANNED: "member:banned",
    MEMBER_UNBANNED: "member:unbanned",
    MEMBER_ROLE_CHANGED: "member:roleChanged",
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
  },
}));

jest.mock("../src/models/Message", () => ({
  create: jest.fn(),
  find: jest.fn(() => ({
    sort: jest.fn(() => ({
      lean: jest.fn(),
    })),
  })),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

jest.mock("../src/models/PrivateMessage", () => ({
  create: jest.fn(),
  find: jest.fn(() => ({
    sort: jest.fn(() => ({
      skip: jest.fn(() => ({
        limit: jest.fn(() => ({
          lean: jest.fn(),
        })),
      })),
    })),
  })),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock("../src/utils/storage", () => ({
  isConfigured: jest.fn(() => false),
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});
