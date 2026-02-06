const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const { prisma } = require("../../src/config/database");
const { hashPassword } = require("../../src/utils/user.utils");
const { secret } = require("../../src/config/jwt");

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    const validUser = {
      email: "test@example.com",
      password: "Password123",
      username: "testuser",
      firstname: "John",
      lastname: "Doe",
    };

    it("should register a new user", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: "1",
        ...validUser,
        password: "hashedpassword",
        role: "USER",
      });

      const res = await request(app)
        .post("/api/auth/register")
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User created successfully.");
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user.email).toBe(validUser.email);
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should return 400 if email is already taken", async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: "1", email: validUser.email });

      const res = await request(app)
        .post("/api/auth/register")
        .send(validUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Email already in use.");
    });

    it("should return 400 if username is already taken", async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: "1", username: validUser.username });

      const res = await request(app)
        .post("/api/auth/register")
        .send(validUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Username already in use.");
    });

    it("should return 400 for invalid email format", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...validUser, email: "invalid" });

      expect(res.status).toBe(400);
    });

    it("should return 400 for weak password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...validUser, password: "weak" });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const hashedPassword = await hashPassword("Password123");
      prisma.user.findUnique.mockResolvedValue({
        id: "1",
        email: "test@example.com",
        password: hashedPassword,
        username: "testuser",
        firstname: "John",
        lastname: "Doe",
        role: "USER",
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "Password123" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logged in successfully.");
      expect(res.body.user).toHaveProperty("id");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 401 for non-existent user", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nonexistent@example.com", password: "Password123" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid credentials.");
    });

    it("should return 401 for wrong password", async () => {
      const hashedPassword = await hashPassword("Password123");
      prisma.user.findUnique.mockResolvedValue({
        id: "1",
        email: "test@example.com",
        password: hashedPassword,
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "WrongPassword123" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid credentials.");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully with valid token", async () => {
      const token = jwt.sign({ id: "1", email: "test@example.com" }, secret);

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logged out successfully.");
    });

    it("should return 401 without token", async () => {
      const res = await request(app).post("/api/auth/logout");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Access denied. No token provided.");
    });
  });

  describe("GET /health", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
    });
  });
});
