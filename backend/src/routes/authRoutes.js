const express    = require("express");
const router     = express.Router();
const { register, login, getProfile, checkEmail, resetPassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/check-email
router.post("/check-email", checkEmail);

// POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

// GET /api/auth/profile  (protected)
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
