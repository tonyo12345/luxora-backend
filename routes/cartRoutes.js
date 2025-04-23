const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} = require("../controllers/cartController");
const { authenticateUser } = require("../middleware/authMiddleWare.js");

// All routes require authentication


// GET /api/cart – Get user's cart
router.get("/", authenticateUser, getCart);

// POST /api/cart – Add item to cart
router.post("/", authenticateUser, addToCart);

// PUT /api/cart/:itemId – Update item quantity
router.put("/:id", authenticateUser, updateCartItem);

// DELETE /api/cart/:itemId – Remove item from cart
router.delete("/:id", authenticateUser, removeCartItem);

module.exports = router;
