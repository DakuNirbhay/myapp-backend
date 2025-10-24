const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/* POST /api/register */
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, studentId, phone, password } = req.body;
    if (!firstName || !lastName || !username || !email || !studentId || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ message: "Email or username already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, username, email, studentId, phone, password: hashed });

    return res.status(201).json({
      message: "Registered successfully",
      user: { id: user._id, name: `${user.firstName} ${user.lastName}`, email: user.email },
    });
  } catch (e) {
    console.error("Register error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

/* POST /api/login */
router.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: "Email/Username and password are required" });
    }

    const query = emailOrUsername.includes("@") ? { email: emailOrUsername } : { username: emailOrUsername };
    const user = await User.findOne(query);

    // ⛔ Block login if user not registered
    if (!user) {
      return res.status(401).json({ message: "User not found. Please register first before logging in." });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid password" });

    // optional token
    let token;
    if (process.env.JWT_SECRET) {
      token = jwt.sign({ sub: user._id.toString(), email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });
    }

    return res.json({
      message: "Login successful",
      user: { id: user._id, name: `${user.firstName} ${user.lastName}`, email: user.email, username: user.username },
      ...(token ? { token } : {}),
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

