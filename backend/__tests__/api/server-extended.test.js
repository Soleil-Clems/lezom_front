const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const { prisma } = require("../../src/config/database");
const { secret } = require("../../src/config/jwt");

describe("Server Extended API", () => {
  const token = jwt.sign({ id: "user-1", email: "test@example.com" }, secret);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("PUT /api/servers/:id/members/:userId - Update Member Role", () => {
    it("should update role as OWNER", async () => {
      prisma.serverMember.findUnique
        .mockResolvedValueOnce({ role: "OWNER" })
        .mockResolvedValueOnce({ role: "MEMBER" });
      prisma.serverMember.update.mockResolvedValue({
        role: "ADMIN",
        user: { id: "user-2", username: "targetuser" },
      });

      const res = await request(app)
        .put("/api/servers/server-1/members/user-2")
        .set("Cookie", `token=${token}`)
        .send({ role: "ADMIN" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Member role updated successfully.");
      expect(res.body.member).toEqual({
        userId: "user-2",
        username: "targetuser",
        role: "ADMIN",
      });
    });

    it("should return 404 if member not found", async () => {
      prisma.serverMember.findUnique
        .mockResolvedValueOnce({ role: "OWNER" })
        .mockResolvedValueOnce(null);

      const res = await request(app)
        .put("/api/servers/server-1/members/user-2")
        .set("Cookie", `token=${token}`)
        .send({ role: "ADMIN" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Member not found.");
    });

    it("should return 403 if target is OWNER", async () => {
      prisma.serverMember.findUnique
        .mockResolvedValueOnce({ role: "OWNER" })
        .mockResolvedValueOnce({ role: "OWNER" });

      const res = await request(app)
        .put("/api/servers/server-1/members/user-2")
        .set("Cookie", `token=${token}`)
        .send({ role: "ADMIN" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Cannot modify the server owner.");
    });

    it("should return 403 if requester role <= target role", async () => {
      prisma.serverMember.findUnique
        .mockResolvedValueOnce({ role: "MODERATOR" })
        .mockResolvedValueOnce({ role: "MODERATOR" });

      const res = await request(app)
        .put("/api/servers/server-1/members/user-2")
        .set("Cookie", `token=${token}`)
        .send({ role: "MEMBER" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You can only manage members with a lower role.");
    });

    it("should return 400 if trying to assign OWNER role via validation", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "OWNER" });

      const res = await request(app)
        .put("/api/servers/server-1/members/user-2")
        .set("Cookie", `token=${token}`)
        .send({ role: "OWNER" });

      expect(res.status).toBe(400);
    });

    it("should return 403 if assigning role >= requester's role", async () => {
      prisma.serverMember.findUnique
        .mockResolvedValueOnce({ role: "MODERATOR" })
        .mockResolvedValueOnce({ role: "MEMBER" });

      const res = await request(app)
        .put("/api/servers/server-1/members/user-2")
        .set("Cookie", `token=${token}`)
        .send({ role: "MODERATOR" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You cannot assign a role equal to or higher than yours.");
    });

    it("should return 400 if role field is missing", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "OWNER" });

      const res = await request(app)
        .put("/api/servers/server-1/members/user-2")
        .set("Cookie", `token=${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it("should return 400 if role is invalid value", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "OWNER" });

      const res = await request(app)
        .put("/api/servers/server-1/members/user-2")
        .set("Cookie", `token=${token}`)
        .send({ role: "INVALID" });

      expect(res.status).toBe(400);
    });

    it("should return 403 if requester is not a member", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce(null);

      const res = await request(app)
        .put("/api/servers/server-1/members/user-2")
        .set("Cookie", `token=${token}`)
        .send({ role: "ADMIN" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You are not a member of this server.");
    });

    it("should return 403 if requester is MEMBER (not in allowed roles)", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "MEMBER" });

      const res = await request(app)
        .put("/api/servers/server-1/members/user-2")
        .set("Cookie", `token=${token}`)
        .send({ role: "MODERATOR" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You don't have permission to perform this action.");
    });
  });

  describe("POST /api/servers/:id/transfer/:userId - Transfer Ownership", () => {
    it("should transfer ownership as owner", async () => {
      prisma.serverMember.findUnique
        .mockResolvedValueOnce({ role: "OWNER" })
        .mockResolvedValueOnce({ role: "MEMBER" });
      prisma.serverMember.update.mockResolvedValue({});
      prisma.server.update.mockResolvedValue({});
      prisma.$transaction.mockResolvedValue([]);

      const res = await request(app)
        .post("/api/servers/server-1/transfer/user-2")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Ownership transferred successfully.");
    });

    it("should return 403 if not owner", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "ADMIN" });

      const res = await request(app)
        .post("/api/servers/server-1/transfer/user-2")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You don't have permission to perform this action.");
    });

    it("should return 400 if transferring to self", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "OWNER" });

      const res = await request(app)
        .post("/api/servers/server-1/transfer/user-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("You are already the owner.");
    });

    it("should return 404 if target member not found", async () => {
      prisma.serverMember.findUnique
        .mockResolvedValueOnce({ role: "OWNER" })
        .mockResolvedValueOnce(null);

      const res = await request(app)
        .post("/api/servers/server-1/transfer/user-2")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Member not found.");
    });

    it("should return 403 if requester is not a member", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce(null);

      const res = await request(app)
        .post("/api/servers/server-1/transfer/user-2")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You are not a member of this server.");
    });
  });

  describe("GET /api/servers/:id/invitations - List Invitations", () => {
    it("should return invitations as ADMIN", async () => {
      const mockInvitations = [
        {
          id: "inv-1",
          code: "abc123",
          maxUses: 10,
          usesCount: 2,
          expiresAt: null,
          createdAt: new Date().toISOString(),
          creator: { id: "user-1", username: "testuser" },
        },
        {
          id: "inv-2",
          code: "def456",
          maxUses: null,
          usesCount: 0,
          expiresAt: null,
          createdAt: new Date().toISOString(),
          creator: { id: "user-1", username: "testuser" },
        },
      ];

      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "ADMIN" });
      prisma.invitation.findMany.mockResolvedValue(mockInvitations);

      const res = await request(app)
        .get("/api/servers/server-1/invitations")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.invitations).toHaveLength(2);
      expect(res.body.invitations[0]).toHaveProperty("code", "abc123");
    });

    it("should return invitations as OWNER", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "OWNER" });
      prisma.invitation.findMany.mockResolvedValue([]);

      const res = await request(app)
        .get("/api/servers/server-1/invitations")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.invitations).toHaveLength(0);
    });

    it("should return 403 if requester is MEMBER", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "MEMBER" });

      const res = await request(app)
        .get("/api/servers/server-1/invitations")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You don't have permission to perform this action.");
    });

    it("should return 403 if requester is MODERATOR", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "MODERATOR" });

      const res = await request(app)
        .get("/api/servers/server-1/invitations")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You don't have permission to perform this action.");
    });

    it("should return 403 if not a member", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce(null);

      const res = await request(app)
        .get("/api/servers/server-1/invitations")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You are not a member of this server.");
    });
  });

  describe("DELETE /api/servers/:id/invitations/:invitationId - Delete Invitation", () => {
    it("should delete invitation as ADMIN", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "ADMIN" });
      prisma.invitation.findFirst.mockResolvedValue({
        id: "inv-1",
        code: "abc123",
        serverId: "server-1",
      });
      prisma.invitation.delete.mockResolvedValue({});

      const res = await request(app)
        .delete("/api/servers/server-1/invitations/inv-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Invitation deleted successfully.");
    });

    it("should delete invitation as OWNER", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "OWNER" });
      prisma.invitation.findFirst.mockResolvedValue({
        id: "inv-1",
        code: "abc123",
        serverId: "server-1",
      });
      prisma.invitation.delete.mockResolvedValue({});

      const res = await request(app)
        .delete("/api/servers/server-1/invitations/inv-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Invitation deleted successfully.");
    });

    it("should return 404 if invitation not found", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "ADMIN" });
      prisma.invitation.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .delete("/api/servers/server-1/invitations/inv-nonexistent")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Invitation not found.");
    });

    it("should return 403 if requester is MEMBER", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce({ role: "MEMBER" });

      const res = await request(app)
        .delete("/api/servers/server-1/invitations/inv-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You don't have permission to perform this action.");
    });

    it("should return 403 if not a member", async () => {
      prisma.serverMember.findUnique.mockResolvedValueOnce(null);

      const res = await request(app)
        .delete("/api/servers/server-1/invitations/inv-1")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("You are not a member of this server.");
    });
  });
});
