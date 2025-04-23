const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db.js");

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role = "customer" } = req.body;
  // Get user input from request body
  const allowedRoles = ["customer", "admin"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role provided" });
  }
  // Check if the user already exists in the database
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (rows.length > 0) {
    return res.status(400).json({ message: "User already exists" }); // Return error if email is already registered
  }

  // Hash the password using bcrypt with 10 salt rounds
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the new user into the database
  await pool.execute(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role]
  );

  // Respond with success
  res.status(201).json({ message: "User registered successfully" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body; // Get login credentials from request

  // Check if both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  // Look for a user with the provided email
  const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  const user = users[0]; // Get the first user if found

  // If no user is found, return unauthorized
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Compare provided password with hashed password in the DB
  const match = await bcrypt.compare(password, user.password);

  // If password doesn't match, return unauthorized
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Create access token (short-lived) using user ID
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  // Create refresh token (long-lived) to be stored in cookie
  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // Set refresh token in secure HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevents JS access (XSS safe)
    secure: true, // Ensures it's sent only over HTTPS
    sameSite: "strict", // Helps prevent CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send access token in response body
  res.json({ accessToken, role: user.role });
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies

  // If refresh token is not present, return unauthorized
  if (!refreshToken) {
    return res.status(401).json({ message: "no token" });
  }

  try {
    // Verify refresh token using secret
    const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // Generate a new access token
    const NewAccessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Send the new access token back
    res.json({ accessToken: NewAccessToken });
  } catch (err) {
    // If verification fails, token is invalid or expired
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const logoutUser = (req, res) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  
    return res.status(200).json({ message: "Logged out successfully" });
  };

module.exports = { registerUser, loginUser, refreshToken, logoutUser };
