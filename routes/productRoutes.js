const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  getProductbyID,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController.js");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleWare.js");
const upload = require("../middleware/uploadMiddleware.js");

router.get("/", getAllProducts);
router.get("/:id", getProductbyID);

// Protected routes (admin only)
// router.post("/", authenticateUser, authorizeAdmin, createProduct);
router.post(
  "/",
  authenticateUser,
  authorizeAdmin,
  upload.single("image"),
  createProduct
);
router.put(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  upload.single("image"), // matches the key in FormData
  updateProduct
);
router.delete("/:id", authenticateUser, authorizeAdmin, deleteProduct);

module.exports = router;
