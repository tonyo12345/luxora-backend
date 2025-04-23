const express = require("express");
const router = express.Router();
const {
  createAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");
const { authenticateUser } = require("../middleware/authMiddleWare");

router.post("/", authenticateUser, createAddress);
router.get("/:id", authenticateUser, getUserAddresses);
router.put("/:id", authenticateUser, updateAddress);
router.delete("/:id", authenticateUser, deleteAddress);

module.exports = router;
