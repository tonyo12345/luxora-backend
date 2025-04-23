const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsForProduct,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController.js");

const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleWare.js");

// Public route - get all reviews for a product
router.get("/product/:productId", getReviewsForProduct);

// Protected routes
router.post("/", authenticateUser, createReview);
router.put("/:id", authenticateUser, updateReview);
router.delete("/:id", authenticateUser, deleteReview); // Only the owner or admin can delete (checked in controller)

module.exports = router;
