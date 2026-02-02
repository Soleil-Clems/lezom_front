const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const { prisma } = require("../../src/config/database");
const { secret } = require("../../src/config/jwt");

describe("User API", () => {
  const mockUser = {
    id: "user-1",
    email: "test@example.com",
    username: "testuser",
    firstname: "John",
    lastname: "Doe",
    role: "USER",
    status: "ONLINE",
    createdAt: new Date(),
  };

  const token = jwt.sign({ id: mockUser.id, email: mockUser.email }, secret);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/users/me", () => {
    it("should return current user profile", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app)
        .get("/api/users/me")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty("id", mockUser.id);
      expect(res.body.user).toHaveProperty("email", mockUser.email);
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get("/api/users/me");
      expect(res.status).toBe(401);
    });

    it("should return 404 if user not found", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/users/me")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found.");
    });
  });

  describe("PUT /api/users/me", () => {
    it("should update user profile", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue({ ...mockUser, username: "newuser" });

      const res = await request(app)
        .put("/api/users/me")
        .set("Cookie", `token=${token}`)
        .send({ username: "newuser" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Profile updated successfully.");
    });

    it("should return 400 for empty update", async () => {
      const res = await request(app)
        .put("/api/users/me")
        .set("Cookie", `token=${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it("should require current password when changing password", async () => {
      const res = await request(app)
        .put("/api/users/me")
        .set("Cookie", `token=${token}`)
        .send({ password: "NewPassword123" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return user by id", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app)
        .get(`/api/users/${mockUser.id}`)
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
    });

    it("should return 404 if user not found", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/users/nonexistent")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/users/me", () => {
    it("should delete user account", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.delete.mockResolvedValue(mockUser);

      const res = await request(app)
        .delete("/api/users/me")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Account deleted successfully.");
    });

    it("should return 404 if user not found", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete("/api/users/me")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
    });
  });
});
