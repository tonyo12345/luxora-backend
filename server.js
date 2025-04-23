const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const path = require("path");
const productRoutes = require("./routes/productRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const categoriesRoute = require("./routes/categoriesRoute.js");
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const addressRoutes = require("./routes/addressRoutes.js");

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend's URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(__dirname));
app.use(cookieParser());
app.use("/api/auth/", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoriesRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/address", addressRoutes);
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// // Serve uploaded images statically
// app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // unique file names
//   },
// });
// const upload = multer({ storage });

// // Upload route
// app.post("/api/upload", upload.single("image"), (req, res) => {
//   const filePath = `/uploads/${req.file.filename}`;
//   res.json({ imageUrl: filePath }); // Return relative path
// });

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`listening to port: http://localhost:${PORT}`)
);
