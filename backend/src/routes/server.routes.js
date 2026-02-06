const express = require("express");
const router = express.Router();
const {
  createServer,
  getServers,
  getServer,
  updateServer,
  deleteServer,
  getMembers,
  updateMemberRole,
  kickMember,
  leaveServer,
  transferOwnership,
  createInvitation,
  getInvitations,
  deleteInvitation,
  joinServer,
} = require("../controllers/server.controller");
const { banUser, unbanUser, getBans } = require("../controllers/ban.controller");
const { verifyToken } = require("../middleware/auth");
const { isMember, hasServerRole } = require("../middleware/server");
const validate = require("../middleware/validate");
const {
  createServerSchema,
  updateServerSchema,
  updateMemberRoleSchema,
  createInvitationSchema,
} = require("../validators/server.validator");
const { banUserSchema } = require("../validators/ban.validator");

router.use(verifyToken);

router.post("/", validate(createServerSchema), createServer);
router.get("/", getServers);
router.get("/:id", isMember, getServer);
router.put("/:id", hasServerRole(["OWNER", "ADMIN"]), validate(updateServerSchema), updateServer);
router.delete("/:id", hasServerRole(["OWNER"]), deleteServer);

router.post("/join/:code", joinServer);
router.delete("/:id/leave", isMember, leaveServer);

router.get("/:id/members", isMember, getMembers);
router.put("/:id/members/:userId", hasServerRole(["OWNER", "ADMIN", "MODERATOR"]), validate(updateMemberRoleSchema), updateMemberRole);
router.delete("/:id/members/:userId", hasServerRole(["OWNER", "ADMIN", "MODERATOR"]), kickMember);

router.post("/:id/transfer/:userId", hasServerRole(["OWNER"]), transferOwnership);

router.post("/:id/invitations", hasServerRole(["OWNER", "ADMIN"]), validate(createInvitationSchema), createInvitation);
router.get("/:id/invitations", hasServerRole(["OWNER", "ADMIN"]), getInvitations);
router.delete("/:id/invitations/:invitationId", hasServerRole(["OWNER", "ADMIN"]), deleteInvitation);

router.post("/:id/bans", hasServerRole(["OWNER", "ADMIN"]), validate(banUserSchema), banUser);
router.delete("/:id/bans/:userId", hasServerRole(["OWNER", "ADMIN"]), unbanUser);
router.get("/:id/bans", hasServerRole(["OWNER", "ADMIN"]), getBans);

module.exports = router;
