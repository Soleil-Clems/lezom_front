process.env.JWT_SECRET = "test-secret-key-for-testing";
process.env.NODE_ENV = "test";

jest.mock("../src/config/jwt", () => ({
  secret: "test-secret-key-for-testing",
  options: { expiresIn: "7d" },
  cookieOptions: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
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
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    serverMember: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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
    },
    $transaction: jest.fn((callbacks) => Promise.all(callbacks)),
  },
}));

jest.mock("../src/utils/socketEvents", () => ({
  emitToServer: jest.fn(),
  emitToUser: jest.fn(),
  EVENTS: {
    SERVER_UPDATED: "server:updated",
    SERVER_DELETED: "server:deleted",
    SERVER_OWNER_CHANGED: "server:ownerChanged",
    MEMBER_JOINED: "member:joined",
    MEMBER_LEFT: "member:left",
    MEMBER_KICKED: "member:kicked",
    MEMBER_ROLE_CHANGED: "member:roleChanged",
    CHANNEL_CREATED: "channel:created",
    CHANNEL_UPDATED: "channel:updated",
    CHANNEL_DELETED: "channel:deleted",
    MESSAGE_CREATED: "message:created",
    MESSAGE_UPDATED: "message:updated",
    MESSAGE_DELETED: "message:deleted",
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

afterEach(() => {
  jest.clearAllMocks();
});
