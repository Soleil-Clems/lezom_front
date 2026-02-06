const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const { prisma } = require("../../src/config/database");
const { secret } = require("../../src/config/jwt");
const PrivateMessage = require("../../src/models/PrivateMessage");

describe("Conversation API", () => {
  const mockUser = {
    id: "user-1",
    email: "test@example.com",
    username: "testuser",
  };

  const token = jwt.sign({ id: mockUser.id, email: mockUser.email }, secret);

  const mockConversation = {
    id: "conv-1",
    user1Id: "user-1",
    user2Id: "user-2",
    user1: { id: "user-1", username: "testuser", img: null, status: "ONLINE" },
    user2: { id: "user-2", username: "otheruser", img: null, status: "ONLINE" },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMessage = {
    _id: "msg-1",
    conversation_id: "conv-1",
    sender_id: "user-1",
    content: "hello",
    type: "text",
    created_at: new Date(),
    updated_at: new Date(),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/conversations", () => {
    it("should create a new conversation", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "user-2",
        username: "otheruser",
      });
      prisma.conversation.findUnique.mockResolvedValue(null);
      prisma.conversation.create.mockResolvedValue(mockConversation);

      const res = await request(app)
        .post("/api/conversations")
        .set("Cookie", `token=${token}`)
        .send({ userId: "user-2" });

      expect(res.status).toBe(201);
      expect(res.body.conversation).toHaveProperty("id", "conv-1");
      expect(res.body.conversation.user1Id).toBe("user-1");
      expect(res.body.conversation.user2Id).toBe("user-2");
    });

    it("should return existing conversation if already exists", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "user-2",
        username: "otheruser",
      });
      prisma.conversation.findUnique.mockResolvedValue(mockConversation);

      const res = await request(app)
        .post("/api/conversations")
        .set("Cookie", `token=${token}`)
        .send({ userId: "user-2" });

      expect(res.status).toBe(201);
      expect(res.body.conversation).toHaveProperty("id", "conv-1");
      expect(prisma.conversation.create).not.toHaveBeenCalled();
    });

    it("should return 400 for conversation with yourself", async () => {
      const res = await request(app)
        .post("/api/conversations")
        .set("Cookie", `token=${token}`)
        .send({ userId: "user-1" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "You cannot create a conversation with yourself."
      );
    });

    it("should return 404 if other user not found", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/conversations")
        .set("Cookie", `token=${token}`)
        .send({ userId: "nonexistent" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found.");
    });
  });

  describe("GET /api/conversations", () => {
    it("should return user conversations", async () => {
      prisma.conversation.findMany.mockResolvedValue([mockConversation]);

      const res = await request(app)
        .get("/api/conversations")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.conversations).toHaveLength(1);
      expect(res.body.conversations[0]).toHaveProperty("id", "conv-1");
    });
  });

  describe("GET /api/conversations/:id", () => {
    it("should return conversation if participant", async () => {
      prisma.conversation.findUnique.mockResolvedValue(mockConversation);

      const res = await request(app)
        .get("/api/conversations/conv-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.conversation).toHaveProperty("id", "conv-1");
    });

    it("should return 403 if not participant", async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        ...mockConversation,
        user1Id: "user-3",
        user2Id: "user-4",
      });

      const res = await request(app)
        .get("/api/conversations/conv-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe(
        "You are not a participant in this conversation."
      );
    });

    it("should return 404 if not found", async () => {
      prisma.conversation.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/conversations/nonexistent")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Conversation not found.");
    });
  });

  describe("GET /api/conversations/:id/messages", () => {
    it("should return paginated messages", async () => {
      prisma.conversation.findUnique.mockResolvedValue(mockConversation);
      PrivateMessage.countDocuments.mockResolvedValue(1);

      const mockMessages = [
        {
          _id: "msg-1",
          conversation_id: "conv-1",
          sender_id: "user-1",
          content: "hello",
          type: "text",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      const leanMock = jest.fn().mockResolvedValue(mockMessages);
      const limitMock = jest.fn(() => ({ lean: leanMock }));
      const skipMock = jest.fn(() => ({ limit: limitMock }));
      const sortMock = jest.fn(() => ({ skip: skipMock }));
      PrivateMessage.find.mockReturnValue({ sort: sortMock });

      prisma.user.findMany.mockResolvedValue([
        { id: "user-1", username: "testuser", img: null },
      ]);

      const res = await request(app)
        .get("/api/conversations/conv-1/messages")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.messages).toHaveLength(1);
      expect(res.body.meta).toHaveProperty("total", 1);
      expect(res.body.meta).toHaveProperty("page", 1);
    });

    it("should return 403 if not participant", async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        ...mockConversation,
        user1Id: "user-3",
        user2Id: "user-4",
      });

      const res = await request(app)
        .get("/api/conversations/conv-1/messages")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe(
        "You are not a participant in this conversation."
      );
    });

    it("should return 404 if conversation not found", async () => {
      prisma.conversation.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/conversations/nonexistent/messages")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Conversation not found.");
    });
  });

  describe("POST /api/conversations/:id/messages", () => {
    it("should create message successfully", async () => {
      prisma.conversation.findUnique.mockResolvedValue(mockConversation);
      PrivateMessage.create.mockResolvedValue(mockMessage);
      prisma.conversation.update.mockResolvedValue(mockConversation);
      prisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        username: "testuser",
        img: null,
      });

      const res = await request(app)
        .post("/api/conversations/conv-1/messages")
        .set("Cookie", `token=${token}`)
        .send({ content: "hello" });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Message sent successfully.");
      expect(res.body.data).toHaveProperty("content", "hello");
    });

    it("should return 403 if not participant", async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        ...mockConversation,
        user1Id: "user-3",
        user2Id: "user-4",
      });

      const res = await request(app)
        .post("/api/conversations/conv-1/messages")
        .set("Cookie", `token=${token}`)
        .send({ content: "hello" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe(
        "You are not a participant in this conversation."
      );
    });

    it("should return 404 if conversation not found", async () => {
      prisma.conversation.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/conversations/nonexistent/messages")
        .set("Cookie", `token=${token}`)
        .send({ content: "hello" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Conversation not found.");
    });
  });

  describe("PATCH /api/conversations/messages/:id", () => {
    it("should update message as sender", async () => {
      PrivateMessage.findById.mockResolvedValue({ ...mockMessage });
      prisma.conversation.findUnique.mockResolvedValue(mockConversation);

      const res = await request(app)
        .patch("/api/conversations/messages/msg-1")
        .set("Cookie", `token=${token}`)
        .send({ content: "updated message" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Message updated successfully.");
    });

    it("should return 403 if not sender", async () => {
      PrivateMessage.findById.mockResolvedValue({
        ...mockMessage,
        sender_id: "user-2",
      });

      const res = await request(app)
        .patch("/api/conversations/messages/msg-1")
        .set("Cookie", `token=${token}`)
        .send({ content: "updated message" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You can only edit your own messages.");
    });

    it("should return 404 if message not found", async () => {
      PrivateMessage.findById.mockResolvedValue(null);

      const res = await request(app)
        .patch("/api/conversations/messages/nonexistent")
        .set("Cookie", `token=${token}`)
        .send({ content: "updated message" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Message not found.");
    });
  });

  describe("DELETE /api/conversations/messages/:id", () => {
    it("should delete message as sender", async () => {
      PrivateMessage.findById.mockResolvedValue({ ...mockMessage });
      prisma.conversation.findUnique.mockResolvedValue(mockConversation);
      PrivateMessage.findByIdAndDelete.mockResolvedValue(mockMessage);

      const res = await request(app)
        .delete("/api/conversations/messages/msg-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Message deleted successfully.");
    });

    it("should return 403 if not sender", async () => {
      PrivateMessage.findById.mockResolvedValue({
        ...mockMessage,
        sender_id: "user-2",
      });

      const res = await request(app)
        .delete("/api/conversations/messages/msg-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You can only delete your own messages.");
    });

    it("should return 404 if message not found", async () => {
      PrivateMessage.findById.mockResolvedValue(null);

      const res = await request(app)
        .delete("/api/conversations/messages/nonexistent")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Message not found.");
    });
  });
});
