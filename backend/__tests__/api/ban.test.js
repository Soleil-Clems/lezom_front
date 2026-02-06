const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const { prisma } = require("../../src/config/database");
const { secret } = require("../../src/config/jwt");

describe("Ban API", () => {
  const token = jwt.sign({ id: "user-1", email: "test@example.com" }, secret);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/servers/:id/bans", () => {
    it("should ban user as admin", async () => {
      prisma.serverMember.findUnique
        .mockResolvedValueOnce({ role: "ADMIN" })
        .mockResolvedValueOnce({ role: "MEMBER" });
      prisma.ban.findUnique.mockResolvedValue(null);
      prisma.$transaction.mockResolvedValue([]);

      const res = await request(app)
        .post("/api/servers/server-1/bans")
        .set("Cookie", `token=${token}`)
        .send({ userId: "user-2", reason: "Spamming" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User banned successfully.");
    });

    it("should return 400 trying to ban yourself", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "ADMIN" });

      const res = await request(app)
        .post("/api/servers/server-1/bans")
        .set("Cookie", `token=${token}`)
        .send({ userId: "user-1" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("You cannot ban yourself.");
    });

    it("should return 403 trying to ban user with higher or equal role", async () => {
      prisma.serverMember.findUnique
        .mockResolvedValueOnce({ role: "ADMIN" })
        .mockResolvedValueOnce({ role: "OWNER" });

      const res = await request(app)
        .post("/api/servers/server-1/bans")
        .set("Cookie", `token=${token}`)
        .send({ userId: "user-2" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You cannot ban a user with equal or higher role.");
    });

    it("should return 400 if user already banned", async () => {
      prisma.serverMember.findUnique
        .mockResolvedValueOnce({ role: "ADMIN" })
        .mockResolvedValueOnce({ role: "MEMBER" });
      prisma.ban.findUnique.mockResolvedValue({ id: "ban-1", serverId: "server-1", userId: "user-2" });

      const res = await request(app)
        .post("/api/servers/server-1/bans")
        .set("Cookie", `token=${token}`)
        .send({ userId: "user-2" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User is already banned.");
    });

    it("should return 404 if target not a member", async () => {
      prisma.serverMember.findUnique
        .mockResolvedValueOnce({ role: "ADMIN" })
        .mockResolvedValueOnce(null);

      const res = await request(app)
        .post("/api/servers/server-1/bans")
        .set("Cookie", `token=${token}`)
        .send({ userId: "user-2" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User is not a member of this server.");
    });

    it("should return 403 as MEMBER role", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });

      const res = await request(app)
        .post("/api/servers/server-1/bans")
        .set("Cookie", `token=${token}`)
        .send({ userId: "user-2" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You don't have permission to perform this action.");
    });
  });

  describe("DELETE /api/servers/:id/bans/:userId", () => {
    it("should unban user", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "ADMIN" });
      prisma.ban.findUnique.mockResolvedValue({ id: "ban-1", serverId: "server-1", userId: "user-2" });
      prisma.ban.delete.mockResolvedValue({});

      const res = await request(app)
        .delete("/api/servers/server-1/bans/user-2")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User unbanned successfully.");
    });

    it("should return 404 if ban not found", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "ADMIN" });
      prisma.ban.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete("/api/servers/server-1/bans/user-2")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Ban not found.");
    });

    it("should return 403 as MEMBER role", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });

      const res = await request(app)
        .delete("/api/servers/server-1/bans/user-2")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You don't have permission to perform this action.");
    });
  });

  describe("GET /api/servers/:id/bans", () => {
    it("should return bans list", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "ADMIN" });
      prisma.ban.findMany.mockResolvedValue([
        {
          id: "ban-1",
          user: { id: "user-2", username: "banned-user" },
          bannedByUser: { id: "user-1", username: "admin-user" },
          reason: "Spamming",
          createdAt: new Date(),
        },
      ]);

      const res = await request(app)
        .get("/api/servers/server-1/bans")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.bans).toHaveLength(1);
    });

    it("should return 403 as MEMBER role", async () => {
      prisma.serverMember.findUnique.mockResolvedValue({ role: "MEMBER" });

      const res = await request(app)
        .get("/api/servers/server-1/bans")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You don't have permission to perform this action.");
    });
  });
});
