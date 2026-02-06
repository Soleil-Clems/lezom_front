const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const { prisma } = require("../../src/config/database");
const { secret } = require("../../src/config/jwt");
const Message = require("../../src/models/Message");

describe("Message API", () => {
  const mockUser = {
    id: "user-1",
    email: "test@example.com",
    username: "testuser",
    firstname: "John",
    lastname: "Doe",
  };

  const mockChannel = {
    id: "channel-1",
    serverId: "server-1",
  };

  const mockMessage = {
    _id: "msg-1",
    channel_id: "channel-1",
    author_id: "user-1",
    content: "Hello world",
    created_at: new Date(),
    updated_at: new Date(),
    save: jest.fn(),
  };

  const token = jwt.sign({ id: mockUser.id, email: mockUser.email }, secret);

  describe("POST /api/messages", () => {
    it("should create a new message", async () => {
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });
      Message.create.mockResolvedValue(mockMessage);
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app)
        .post("/api/messages")
        .set("Cookie", `token=${token}`)
        .send({
          content: "Hello world",
          channelId: "channel-1",
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Message created successfully.");
      expect(res.body.data).toHaveProperty("content", "Hello world");
    });

    it("should return 404 if channel not found", async () => {
      prisma.channel.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/messages")
        .set("Cookie", `token=${token}`)
        .send({
          content: "Hello",
          channelId: "nonexistent",
        });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Channel not found.");
    });

    it("should return 403 if not a server member", async () => {
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      prisma.serverMember.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/messages")
        .set("Cookie", `token=${token}`)
        .send({
          content: "Hello",
          channelId: "channel-1",
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You are not a member of this server.");
    });

    it("should return 400 for missing content", async () => {
      const res = await request(app)
        .post("/api/messages")
        .set("Cookie", `token=${token}`)
        .send({ channelId: "channel-1" });

      expect(res.status).toBe(400);
    });

    it("should return 400 for missing channelId", async () => {
      const res = await request(app)
        .post("/api/messages")
        .set("Cookie", `token=${token}`)
        .send({ content: "Hello" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/messages/channel/:id", () => {
    it("should return channel messages", async () => {
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });

      const mockMessages = [mockMessage];
      Message.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockMessages),
        }),
      });

      prisma.user.findMany.mockResolvedValue([mockUser]);

      const res = await request(app)
        .get("/api/messages/channel/channel-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.messages).toHaveLength(1);
      expect(res.body.messages[0]).toHaveProperty("content", "Hello world");
    });

    it("should return 404 if channel not found", async () => {
      prisma.channel.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/messages/channel/nonexistent")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
    });

    it("should return 403 if not a server member", async () => {
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      prisma.serverMember.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/messages/channel/channel-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
    });
  });

  describe("PATCH /api/messages/:id", () => {
    it("should update own message", async () => {
      Message.findById.mockResolvedValue(mockMessage);
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app)
        .patch("/api/messages/msg-1")
        .set("Cookie", `token=${token}`)
        .send({ content: "Updated content" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Message updated successfully.");
      expect(mockMessage.save).toHaveBeenCalled();
    });

    it("should return 404 if message not found", async () => {
      Message.findById.mockResolvedValue(null);

      const res = await request(app)
        .patch("/api/messages/nonexistent")
        .set("Cookie", `token=${token}`)
        .send({ content: "Updated" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Message not found.");
    });

    it("should return 403 for other user message", async () => {
      Message.findById.mockResolvedValue({ ...mockMessage, author_id: "other-user" });

      const res = await request(app)
        .patch("/api/messages/msg-1")
        .set("Cookie", `token=${token}`)
        .send({ content: "Updated" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You can only edit your own messages.");
    });

    it("should return 400 for empty content", async () => {
      const res = await request(app)
        .patch("/api/messages/msg-1")
        .set("Cookie", `token=${token}`)
        .send({ content: "" });

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/messages/:id", () => {
    it("should delete own message", async () => {
      Message.findById.mockResolvedValue(mockMessage);
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      Message.findByIdAndDelete.mockResolvedValue(mockMessage);

      const res = await request(app)
        .delete("/api/messages/msg-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Message deleted successfully.");
    });

    it("should allow admin to delete any message", async () => {
      Message.findById.mockResolvedValue({ ...mockMessage, author_id: "other-user" });
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      prisma.serverMember.findUnique.mockResolvedValue({ role: "ADMIN" });
      Message.findByIdAndDelete.mockResolvedValue(mockMessage);

      const res = await request(app)
        .delete("/api/messages/msg-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
    });

    it("should return 404 if message not found", async () => {
      Message.findById.mockResolvedValue(null);

      const res = await request(app)
        .delete("/api/messages/nonexistent")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
    });

    it("should return 403 for non-admin deleting other message", async () => {
      Message.findById.mockResolvedValue({ ...mockMessage, author_id: "other-user" });
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });

      const res = await request(app)
        .delete("/api/messages/msg-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You don't have permission to delete this message.");
    });
  });
});
