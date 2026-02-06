const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const { prisma } = require("../../src/config/database");
const { secret } = require("../../src/config/jwt");

describe("Admin API", () => {
  const mockAdmin = {
    id: "admin-1",
    email: "admin@example.com",
    username: "admin",
    role: "ADMIN",
  };

  const mockUser = {
    id: "user-1",
    email: "user@example.com",
    username: "testuser",
    firstname: "John",
    lastname: "Doe",
    role: "MEMBER",
    status: "ONLINE",
    createdAt: new Date(),
  };

  const adminToken = jwt.sign({ id: mockAdmin.id, email: mockAdmin.email }, secret);
  const userToken = jwt.sign({ id: mockUser.id, email: mockUser.email }, secret);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/admin/users", () => {
    it("should return all users as admin", async () => {
      prisma.user.findUnique.mockResolvedValue(mockAdmin);
      prisma.user.findMany.mockResolvedValue([mockAdmin, mockUser]);

      const res = await request(app)
        .get("/api/admin/users")
        .set("Cookie", `token=${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.users).toHaveLength(2);
    });

    it("should return 403 for non-admin", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app)
        .get("/api/admin/users")
        .set("Cookie", `token=${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access denied. Admin only.");
    });
  });

  describe("GET /api/admin/users/:id", () => {
    it("should return user by id as admin", async () => {
      prisma.user.findUnique.mockResolvedValue(mockAdmin);

      const res = await request(app)
        .get("/api/admin/users/user-1")
        .set("Cookie", `token=${adminToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/admin/users", () => {
    const newUser = {
      email: "new@example.com",
      password: "Password123",
      username: "newuser",
      firstname: "New",
      lastname: "User",
    };

    it("should create user as admin", async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(mockAdmin)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      prisma.user.create.mockResolvedValue({
        id: "new-1",
        ...newUser,
        role: "MEMBER",
        status: "OFFLINE",
        createdAt: new Date(),
      });

      const res = await request(app)
        .post("/api/admin/users")
        .set("Cookie", `token=${adminToken}`)
        .send(newUser);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User created successfully.");
    });

    it("should return 400 if email taken", async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(mockAdmin)
        .mockResolvedValueOnce({ id: "other", email: newUser.email });

      const res = await request(app)
        .post("/api/admin/users")
        .set("Cookie", `token=${adminToken}`)
        .send(newUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Email already in use.");
    });
  });

  describe("PUT /api/admin/users/:id", () => {
    it("should update user as admin", async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(mockAdmin)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);
      prisma.user.update.mockResolvedValue({ ...mockUser, username: "updated" });

      const res = await request(app)
        .put("/api/admin/users/user-1")
        .set("Cookie", `token=${adminToken}`)
        .send({ username: "updated" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User updated successfully.");
    });

    it("should return 400 for empty update", async () => {
      prisma.user.findUnique.mockResolvedValue(mockAdmin);

      const res = await request(app)
        .put("/api/admin/users/user-1")
        .set("Cookie", `token=${adminToken}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/admin/users/:id", () => {
    it("should delete user as admin", async () => {
      prisma.user.findUnique.mockResolvedValue(mockAdmin);
      prisma.user.delete.mockResolvedValue(mockUser);

      const res = await request(app)
        .delete("/api/admin/users/user-1")
        .set("Cookie", `token=${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User deleted successfully.");
    });

    it("should prevent deleting self", async () => {
      prisma.user.findUnique.mockResolvedValue(mockAdmin);

      const res = await request(app)
        .delete("/api/admin/users/admin-1")
        .set("Cookie", `token=${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Cannot delete your own account from admin panel.");
    });
  });
});
