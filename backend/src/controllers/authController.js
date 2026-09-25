const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── Register ────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(409).json({ success: false, message: "Email already registered" });

    const bcrypt = require("bcryptjs");
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Login ───────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const bcrypt = require("bcryptjs");
    const match  = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Get Profile (protected) ─────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ["id", "name", "email", "createdAt"],
    });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Check Email Exists ───────────────────────────────────────────────────────
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ success: false, message: "No account found with this email" });
    res.status(200).json({ success: true, message: "Email found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Reset Password ───────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return res.status(400).json({ success: false, message: "Email and new password required" });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const bcrypt = require("bcryptjs");
    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getProfile, checkEmail, resetPassword };
