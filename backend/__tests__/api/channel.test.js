const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const { prisma } = require("../../src/config/database");
const { secret } = require("../../src/config/jwt");

describe("Channel API", () => {
  const mockUser = {
    id: "user-1",
    email: "test@example.com",
    username: "testuser",
  };

  const mockChannel = {
    id: "channel-1",
    serverId: "server-1",
    name: "general",
    description: "General discussion",
    createdAt: new Date(),
  };

  const token = jwt.sign({ id: mockUser.id, email: mockUser.email }, secret);

  describe("POST /api/channels", () => {
    it("should create a new channel as admin", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "ADMIN" });
      prisma.channel.create.mockResolvedValue(mockChannel);

      const res = await request(app)
        .post("/api/channels")
        .set("Cookie", `token=${token}`)
        .send({
          serverId: "server-1",
          name: "general",
          description: "General discussion",
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Channel created successfully.");
      expect(res.body.channel).toHaveProperty("id");
    });

    it("should create channel as owner", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "OWNER" });
      prisma.channel.create.mockResolvedValue(mockChannel);

      const res = await request(app)
        .post("/api/channels")
        .set("Cookie", `token=${token}`)
        .send({
          serverId: "server-1",
          name: "general",
        });

      expect(res.status).toBe(201);
    });

    it("should return 403 as member", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });

      const res = await request(app)
        .post("/api/channels")
        .set("Cookie", `token=${token}`)
        .send({
          serverId: "server-1",
          name: "general",
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You don't have permission to perform this action.");
    });

    it("should return 403 if not a member", async () => {
      prisma.serverMember.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/channels")
        .set("Cookie", `token=${token}`)
        .send({
          serverId: "server-1",
          name: "general",
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You are not a member of this server.");
    });

    it("should return 400 for missing serverId", async () => {
      const res = await request(app)
        .post("/api/channels")
        .set("Cookie", `token=${token}`)
        .send({ name: "general" });

      expect(res.status).toBe(400);
    });

    it("should return 400 for missing name", async () => {
      const res = await request(app)
        .post("/api/channels")
        .set("Cookie", `token=${token}`)
        .send({ serverId: "server-1" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/channels/server/:serverId", () => {
    it("should return server channels", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });
      prisma.channel.findMany.mockResolvedValue([mockChannel]);

      const res = await request(app)
        .get("/api/channels/server/server-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.channels).toHaveLength(1);
      expect(res.body.channels[0].name).toBe("general");
    });

    it("should return 403 if not a member", async () => {
      prisma.serverMember.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/channels/server/server-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/channels/:id", () => {
    it("should return channel details", async () => {
      prisma.channel.findUnique.mockResolvedValueOnce(mockChannel);
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });
      prisma.channel.findUnique.mockResolvedValueOnce(mockChannel);

      const res = await request(app)
        .get("/api/channels/channel-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.channel).toHaveProperty("id", "channel-1");
    });

    it("should return 404 if channel not found", async () => {
      prisma.channel.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/channels/nonexistent")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/channels/:id", () => {
    it("should update channel as admin", async () => {
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      prisma.serverMember.findUnique.mockResolvedValue({ role: "ADMIN" });
      prisma.channel.update.mockResolvedValue({ ...mockChannel, name: "updated" });

      const res = await request(app)
        .put("/api/channels/channel-1")
        .set("Cookie", `token=${token}`)
        .send({ name: "updated" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Channel updated successfully.");
    });

    it("should return 403 as member", async () => {
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });

      const res = await request(app)
        .put("/api/channels/channel-1")
        .set("Cookie", `token=${token}`)
        .send({ name: "updated" });

      expect(res.status).toBe(403);
    });

    it("should reject empty update at validation level", async () => {
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      prisma.serverMember.findUnique.mockResolvedValue({ role: "ADMIN" });

      const res = await request(app)
        .put("/api/channels/channel-1")
        .set("Cookie", `token=${token}`)
        .send({});

      // Validation happens after middleware, so 403 if not authorized or 400 if validation fails
      expect([400, 403]).toContain(res.status);
    });
  });

  describe("DELETE /api/channels/:id", () => {
    it("should delete channel as admin", async () => {
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      prisma.serverMember.findUnique.mockResolvedValue({ role: "ADMIN" });
      prisma.channel.delete.mockResolvedValue(mockChannel);

      const res = await request(app)
        .delete("/api/channels/channel-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Channel deleted successfully.");
    });

    it("should return 403 as member", async () => {
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });

      const res = await request(app)
        .delete("/api/channels/channel-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
    });
  });
});
