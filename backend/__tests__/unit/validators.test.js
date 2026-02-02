const { registerSchema, loginSchema } = require("../../src/validators/auth.validator");
const { passwordSchema } = require("../../src/validators/schemas");
const { updateMeSchema } = require("../../src/validators/user.validator");
const {
  createServerSchema,
  updateServerSchema,
  updateMemberRoleSchema,
  createInvitationSchema,
} = require("../../src/validators/server.validator");
const {
  createChannelSchema,
  updateChannelSchema,
} = require("../../src/validators/channel.validator");
const {
  createMessageSchema,
  updateMessageSchema,
} = require("../../src/validators/message.validator");
const {
  createUserSchema,
  updateUserSchema,
} = require("../../src/validators/admin.validator");

describe("Validators", () => {
  describe("passwordSchema", () => {
    it("should reject password shorter than 8 characters", () => {
      const { error } = passwordSchema.validate("Abc123");
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("at least 8 characters");
    });

    it("should reject password without uppercase letter", () => {
      const { error } = passwordSchema.validate("abcdefgh1");
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("uppercase");
    });

    it("should reject password without lowercase letter", () => {
      const { error } = passwordSchema.validate("ABCDEFGH1");
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("lowercase");
    });

    it("should reject password without number", () => {
      const { error } = passwordSchema.validate("Abcdefghi");
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("number");
    });

    it("should accept valid password", () => {
      const { error } = passwordSchema.validate("Password123");
      expect(error).toBeUndefined();
    });
  });

  describe("Auth Validators", () => {
    describe("registerSchema", () => {
      const validData = {
        email: "test@example.com",
        password: "Password123",
        username: "testuser",
        firstname: "John",
        lastname: "Doe",
      };

      it("should accept valid registration data", () => {
        const { error } = registerSchema.validate(validData);
        expect(error).toBeUndefined();
      });

      it("should reject invalid email format", () => {
        const { error } = registerSchema.validate({ ...validData, email: "invalid" });
        expect(error).toBeDefined();
      });

      it("should reject missing email", () => {
        const { email, ...dataWithoutEmail } = validData;
        const { error } = registerSchema.validate(dataWithoutEmail);
        expect(error).toBeDefined();
      });

      it("should reject username longer than 32 characters", () => {
        const { error } = registerSchema.validate({
          ...validData,
          username: "a".repeat(33),
        });
        expect(error).toBeDefined();
      });

      it("should reject firstname longer than 50 characters", () => {
        const { error } = registerSchema.validate({
          ...validData,
          firstname: "a".repeat(51),
        });
        expect(error).toBeDefined();
      });

      it("should reject lastname longer than 50 characters", () => {
        const { error } = registerSchema.validate({
          ...validData,
          lastname: "a".repeat(51),
        });
        expect(error).toBeDefined();
      });
    });

    describe("loginSchema", () => {
      it("should accept valid login data", () => {
        const { error } = loginSchema.validate({
          email: "test@example.com",
          password: "password",
        });
        expect(error).toBeUndefined();
      });

      it("should reject invalid email", () => {
        const { error } = loginSchema.validate({
          email: "invalid",
          password: "password",
        });
        expect(error).toBeDefined();
      });

      it("should reject missing password", () => {
        const { error } = loginSchema.validate({
          email: "test@example.com",
        });
        expect(error).toBeDefined();
      });
    });
  });

  describe("User Validators", () => {
    describe("updateMeSchema", () => {
      it("should accept valid update data", () => {
        const { error } = updateMeSchema.validate({ username: "newuser" });
        expect(error).toBeUndefined();
      });

      it("should reject empty update", () => {
        const { error } = updateMeSchema.validate({});
        expect(error).toBeDefined();
      });

      it("should require currentPassword when changing password", () => {
        const { error } = updateMeSchema.validate({ password: "NewPassword123" });
        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("Current password");
      });

      it("should accept password change with currentPassword", () => {
        const { error } = updateMeSchema.validate({
          password: "NewPassword123",
          currentPassword: "OldPassword123",
        });
        expect(error).toBeUndefined();
      });

      it("should reject invalid email format", () => {
        const { error } = updateMeSchema.validate({ email: "invalid" });
        expect(error).toBeDefined();
      });
    });
  });

  describe("Server Validators", () => {
    describe("createServerSchema", () => {
      it("should accept valid server name", () => {
        const { error } = createServerSchema.validate({ name: "My Server" });
        expect(error).toBeUndefined();
      });

      it("should reject missing name", () => {
        const { error } = createServerSchema.validate({});
        expect(error).toBeDefined();
      });

      it("should reject name longer than 100 characters", () => {
        const { error } = createServerSchema.validate({ name: "a".repeat(101) });
        expect(error).toBeDefined();
      });

      it("should reject empty name", () => {
        const { error } = createServerSchema.validate({ name: "" });
        expect(error).toBeDefined();
      });
    });

    describe("updateServerSchema", () => {
      it("should accept valid update", () => {
        const { error } = updateServerSchema.validate({ name: "New Name" });
        expect(error).toBeUndefined();
      });

      it("should reject empty update", () => {
        const { error } = updateServerSchema.validate({});
        expect(error).toBeDefined();
      });
    });

    describe("updateMemberRoleSchema", () => {
      it("should accept ADMIN role", () => {
        const { error } = updateMemberRoleSchema.validate({ role: "ADMIN" });
        expect(error).toBeUndefined();
      });

      it("should accept MEMBER role", () => {
        const { error } = updateMemberRoleSchema.validate({ role: "MEMBER" });
        expect(error).toBeUndefined();
      });

      it("should reject OWNER role", () => {
        const { error } = updateMemberRoleSchema.validate({ role: "OWNER" });
        expect(error).toBeDefined();
      });

      it("should reject invalid role", () => {
        const { error } = updateMemberRoleSchema.validate({ role: "INVALID" });
        expect(error).toBeDefined();
      });
    });

    describe("createInvitationSchema", () => {
      it("should accept empty object", () => {
        const { error } = createInvitationSchema.validate({});
        expect(error).toBeUndefined();
      });

      it("should accept valid maxUses", () => {
        const { error } = createInvitationSchema.validate({ maxUses: 10 });
        expect(error).toBeUndefined();
      });

      it("should reject maxUses over 100", () => {
        const { error } = createInvitationSchema.validate({ maxUses: 101 });
        expect(error).toBeDefined();
      });

      it("should accept valid expiresIn", () => {
        const { error } = createInvitationSchema.validate({ expiresIn: 3600 });
        expect(error).toBeUndefined();
      });

      it("should reject expiresIn over 7 days", () => {
        const { error } = createInvitationSchema.validate({ expiresIn: 604801 });
        expect(error).toBeDefined();
      });
    });
  });

  describe("Channel Validators", () => {
    describe("createChannelSchema", () => {
      it("should accept valid channel data", () => {
        const { error } = createChannelSchema.validate({
          serverId: "server-123",
          name: "general",
        });
        expect(error).toBeUndefined();
      });

      it("should accept channel with description", () => {
        const { error } = createChannelSchema.validate({
          serverId: "server-123",
          name: "general",
          description: "General discussion",
        });
        expect(error).toBeUndefined();
      });

      it("should reject missing serverId", () => {
        const { error } = createChannelSchema.validate({ name: "general" });
        expect(error).toBeDefined();
      });

      it("should reject missing name", () => {
        const { error } = createChannelSchema.validate({ serverId: "server-123" });
        expect(error).toBeDefined();
      });

      it("should reject name longer than 100 characters", () => {
        const { error } = createChannelSchema.validate({
          serverId: "server-123",
          name: "a".repeat(101),
        });
        expect(error).toBeDefined();
      });

      it("should reject description longer than 500 characters", () => {
        const { error } = createChannelSchema.validate({
          serverId: "server-123",
          name: "general",
          description: "a".repeat(501),
        });
        expect(error).toBeDefined();
      });
    });

    describe("updateChannelSchema", () => {
      it("should accept valid update", () => {
        const { error } = updateChannelSchema.validate({ name: "new-name" });
        expect(error).toBeUndefined();
      });

      it("should reject empty update", () => {
        const { error } = updateChannelSchema.validate({});
        expect(error).toBeDefined();
      });

      it("should accept description update", () => {
        const { error } = updateChannelSchema.validate({ description: "New desc" });
        expect(error).toBeUndefined();
      });
    });
  });

  describe("Message Validators", () => {
    describe("createMessageSchema", () => {
      it("should accept valid message data", () => {
        const { error } = createMessageSchema.validate({
          content: "Hello world",
          channelId: "channel-123",
        });
        expect(error).toBeUndefined();
      });

      it("should reject missing content", () => {
        const { error } = createMessageSchema.validate({ channelId: "channel-123" });
        expect(error).toBeDefined();
      });

      it("should reject missing channelId", () => {
        const { error } = createMessageSchema.validate({ content: "Hello" });
        expect(error).toBeDefined();
      });

      it("should reject empty content", () => {
        const { error } = createMessageSchema.validate({
          content: "",
          channelId: "channel-123",
        });
        expect(error).toBeDefined();
      });
    });

    describe("updateMessageSchema", () => {
      it("should accept valid update", () => {
        const { error } = updateMessageSchema.validate({ content: "Updated" });
        expect(error).toBeUndefined();
      });

      it("should reject missing content", () => {
        const { error } = updateMessageSchema.validate({});
        expect(error).toBeDefined();
      });

      it("should reject empty content", () => {
        const { error } = updateMessageSchema.validate({ content: "" });
        expect(error).toBeDefined();
      });
    });
  });

  describe("Admin Validators", () => {
    describe("createUserSchema", () => {
      const validData = {
        email: "test@example.com",
        password: "Password123",
        username: "testuser",
        firstname: "John",
        lastname: "Doe",
      };

      it("should accept valid user data", () => {
        const { error } = createUserSchema.validate(validData);
        expect(error).toBeUndefined();
      });

      it("should accept user with role", () => {
        const { error } = createUserSchema.validate({ ...validData, role: "ADMIN" });
        expect(error).toBeUndefined();
      });

      it("should reject invalid role", () => {
        const { error } = createUserSchema.validate({ ...validData, role: "OWNER" });
        expect(error).toBeDefined();
      });
    });

    describe("updateUserSchema", () => {
      it("should accept valid update", () => {
        const { error } = updateUserSchema.validate({ username: "newuser" });
        expect(error).toBeUndefined();
      });

      it("should reject empty update", () => {
        const { error } = updateUserSchema.validate({});
        expect(error).toBeDefined();
      });

      it("should accept role update", () => {
        const { error } = updateUserSchema.validate({ role: "ADMIN" });
        expect(error).toBeUndefined();
      });
    });
  });
});
