const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const { prisma } = require("../../src/config/database");
const { secret } = require("../../src/config/jwt");

describe("Server API", () => {
  const mockUser = {
    id: "user-1",
    email: "test@example.com",
    username: "testuser",
  };

  const mockServer = {
    id: "server-1",
    name: "Test Server",
    ownerId: "user-1",
    createdAt: new Date(),
  };

  const token = jwt.sign({ id: mockUser.id, email: mockUser.email }, secret);

  describe("POST /api/servers", () => {
    it("should create a new server", async () => {
      prisma.server.create.mockResolvedValue({
        ...mockServer,
        members: [{ role: "OWNER" }],
      });

      const res = await request(app)
        .post("/api/servers")
        .set("Cookie", `token=${token}`)
        .send({ name: "Test Server" });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Server created successfully.");
      expect(res.body.server).toHaveProperty("id");
      expect(res.body.server.name).toBe("Test Server");
      expect(res.body.server.role).toBe("OWNER");
    });

    it("should return 400 for missing name", async () => {
      const res = await request(app)
        .post("/api/servers")
        .set("Cookie", `token=${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it("should return 401 without token", async () => {
      const res = await request(app)
        .post("/api/servers")
        .send({ name: "Test Server" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/servers", () => {
    it("should return user servers", async () => {
      prisma.serverMember.findMany.mockResolvedValue([
        { server: mockServer, role: "OWNER" },
      ]);

      const res = await request(app)
        .get("/api/servers")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.servers).toHaveLength(1);
      expect(res.body.servers[0].name).toBe("Test Server");
    });
  });

  describe("GET /api/servers/:id", () => {
    it("should return server details", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "OWNER" });
      prisma.server.findUnique.mockResolvedValue({
        ...mockServer,
        _count: { members: 5 },
      });

      const res = await request(app)
        .get("/api/servers/server-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.server).toHaveProperty("id", "server-1");
      expect(res.body.server.memberCount).toBe(5);
    });

    it("should return 403 if not a member", async () => {
      prisma.serverMember.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/servers/server-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
    });

    it("should return 404 if server not found", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });
      prisma.server.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/servers/nonexistent")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/servers/:id", () => {
    it("should update server as owner", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "OWNER" });
      prisma.server.update.mockResolvedValue({ ...mockServer, name: "Updated" });

      const res = await request(app)
        .put("/api/servers/server-1")
        .set("Cookie", `token=${token}`)
        .send({ name: "Updated" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Server updated successfully.");
    });

    it("should update server as admin", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "ADMIN" });
      prisma.server.update.mockResolvedValue({ ...mockServer, name: "Updated" });

      const res = await request(app)
        .put("/api/servers/server-1")
        .set("Cookie", `token=${token}`)
        .send({ name: "Updated" });

      expect(res.status).toBe(200);
    });

    it("should return 403 as member", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });

      const res = await request(app)
        .put("/api/servers/server-1")
        .set("Cookie", `token=${token}`)
        .send({ name: "Updated" });

      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /api/servers/:id", () => {
    it("should delete server as owner", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "OWNER" });
      prisma.server.delete.mockResolvedValue(mockServer);

      const res = await request(app)
        .delete("/api/servers/server-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Server deleted successfully.");
    });

    it("should return 403 as admin", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "ADMIN" });

      const res = await request(app)
        .delete("/api/servers/server-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/servers/:id/members", () => {
    it("should return server members", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });
      prisma.serverMember.findMany.mockResolvedValue([
        {
          user: { id: "user-1", username: "owner", firstname: "John", lastname: "Doe", status: "ONLINE" },
          role: "OWNER",
          joinedAt: new Date(),
        },
      ]);

      const res = await request(app)
        .get("/api/servers/server-1/members")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.members).toHaveLength(1);
    });
  });

  describe("DELETE /api/servers/:id/leave", () => {
    it("should allow member to leave", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });
      prisma.serverMember.delete.mockResolvedValue({});

      const res = await request(app)
        .delete("/api/servers/server-1/leave")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("You have left the server.");
    });

    it("should prevent owner from leaving", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "OWNER" });

      const res = await request(app)
        .delete("/api/servers/server-1/leave")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Owner cannot leave");
    });
  });

  describe("DELETE /api/servers/:id/members/:userId", () => {
    it("should kick member as admin", async () => {
      prisma.serverMember.findUnique
        .mockResolvedValueOnce({ role: "ADMIN" })
        .mockResolvedValueOnce({ role: "MEMBER" });
      prisma.serverMember.delete.mockResolvedValue({});

      const res = await request(app)
        .delete("/api/servers/server-1/members/user-2")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Member kicked successfully.");
    });

    it("should prevent kicking owner", async () => {
      prisma.serverMember.findUnique
        .mockResolvedValueOnce({ role: "ADMIN" })
        .mockResolvedValueOnce({ role: "OWNER" });

      const res = await request(app)
        .delete("/api/servers/server-1/members/user-2")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Cannot kick the server owner.");
    });

    it("should prevent kicking self", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "ADMIN" });

      const res = await request(app)
        .delete("/api/servers/server-1/members/user-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("leave endpoint");
    });
  });

  describe("POST /api/servers/join/:code", () => {
    it("should join server with valid invitation", async () => {
      prisma.invitation.findUnique.mockResolvedValue({
        id: "inv-1",
        code: "abc123",
        serverId: "server-1",
        maxUses: 10,
        usesCount: 5,
        expiresAt: new Date(Date.now() + 3600000),
      });
      prisma.serverMember.findUnique.mockResolvedValue(null);
      prisma.ban.findUnique.mockResolvedValue(null);
      prisma.$transaction.mockResolvedValue([]);
      prisma.server.findUnique.mockResolvedValue(mockServer);

      const res = await request(app)
        .post("/api/servers/join/abc123")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Joined server successfully.");
    });

    it("should return 404 for invalid code", async () => {
      prisma.invitation.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/servers/join/invalid")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Invalid invitation code.");
    });

    it("should return 400 for expired invitation", async () => {
      prisma.invitation.findUnique.mockResolvedValue({
        id: "inv-1",
        code: "abc123",
        serverId: "server-1",
        expiresAt: new Date(Date.now() - 3600000),
      });

      const res = await request(app)
        .post("/api/servers/join/abc123")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invitation has expired.");
    });

    it("should return 400 if already a member", async () => {
      prisma.invitation.findUnique.mockResolvedValue({
        id: "inv-1",
        code: "abc123",
        serverId: "server-1",
        expiresAt: null,
        maxUses: null,
      });
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });

      const res = await request(app)
        .post("/api/servers/join/abc123")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("You are already a member of this server.");
    });

    it("should return 403 if banned", async () => {
      prisma.invitation.findUnique.mockResolvedValue({
        id: "inv-1",
        code: "abc123",
        serverId: "server-1",
        expiresAt: null,
        maxUses: null,
      });
      prisma.serverMember.findUnique.mockResolvedValue(null);
      prisma.ban.findUnique.mockResolvedValue({ id: "ban-1" });

      const res = await request(app)
        .post("/api/servers/join/abc123")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You are banned from this server.");
    });
  });

  describe("POST /api/servers/:id/invitations", () => {
    it("should create invitation as admin", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "ADMIN" });
      prisma.invitation.create.mockResolvedValue({
        id: "inv-1",
        code: "abc123",
        maxUses: 10,
        usesCount: 0,
        expiresAt: null,
        createdAt: new Date(),
      });

      const res = await request(app)
        .post("/api/servers/server-1/invitations")
        .set("Cookie", `token=${token}`)
        .send({ maxUses: 10 });

      expect(res.status).toBe(201);
      expect(res.body.invitation).toHaveProperty("code");
    });

    it("should return 403 as member", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });

      const res = await request(app)
        .post("/api/servers/server-1/invitations")
        .set("Cookie", `token=${token}`)
        .send({});

      expect(res.status).toBe(403);
    });
  });
});
