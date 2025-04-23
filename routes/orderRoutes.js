const express = require("express");
const router = express.Router();
const {
  createOrder,
  updateOrderStatus,
  getUserOrders,
  getAllOrders,
} = require("../controllers/orderController");
const { authenticateUser, authorizeAdmin } = require("../middleware/authMiddleWare.js");

// Create an order from cart
router.post("/", authenticateUser, createOrder);

// Update order status (admin only)
router.put("/:id/status", authenticateUser, authorizeAdmin, updateOrderStatus);

// Get logged-in user's orders
router.get("/my-orders", authenticateUser, getUserOrders);

// Get all orders (admin only)
router.get("/", authenticateUser, authorizeAdmin, getAllOrders);

module.exports = router;