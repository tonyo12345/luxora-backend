const express = require("express");
const {
  getUserProfile,
  updateUser,
  deleteUser,
} = require("../controllers/userController.js");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleWare.js");

const router = express.Router();

router.get("/:id", authenticateUser, getUserProfile);
router.put("/:id", authenticateUser, updateUser);
router.delete("/:id", authenticateUser, authorizeAdmin, deleteUser);

module.exports = router;
