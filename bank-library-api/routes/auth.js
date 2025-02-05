const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Login (Generate JWT)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Search for users in the database.
  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
