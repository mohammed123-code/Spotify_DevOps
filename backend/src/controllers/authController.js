import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { sendOTPEmail } from '../services/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = 12;

// Helper to generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

// Helper to generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

// Register
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  try {
    // Check if email already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );

    const userId = result.insertId;
    const user = { id: userId, username, email };

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [userId, refreshTokenHash, expiresAt]
    );

    return res.status(201).json({
      message: 'User registered successfully.',
      accessToken,
      refreshToken,
      user
    });
  } catch (error) {
    console.error('[AuthController] Register error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, refreshTokenHash, expiresAt]
    );

    return res.json({
      message: 'Login successful.',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile_image: user.profile_image
      }
    });
  } catch (error) {
    console.error('[AuthController] Login error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Logout
export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required.' });
  }

  try {
    // Decode user_id from token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid refresh token.' });
    }

    // Invalidate refresh token by deleting it from db
    // Since we hash refresh tokens, we'll scan all refresh tokens for this user and bcrypt.compare
    const [tokens] = await pool.query('SELECT * FROM refresh_tokens WHERE user_id = ?', [decoded.id]);
    
    for (const t of tokens) {
      const match = await bcrypt.compare(refreshToken, t.token_hash);
      if (match) {
        await pool.query('DELETE FROM refresh_tokens WHERE id = ?', [t.id]);
        break;
      }
    }

    return res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('[AuthController] Logout error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required.' });
  }

  try {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid or expired refresh token.' });
    }

    // Verify token exists in database
    const [tokens] = await pool.query('SELECT * FROM refresh_tokens WHERE user_id = ? AND expires_at > NOW()', [decoded.id]);
    
    let dbToken = null;
    for (const t of tokens) {
      const match = await bcrypt.compare(refreshToken, t.token_hash);
      if (match) {
        dbToken = t;
        break;
      }
    }

    if (!dbToken) {
      return res.status(401).json({ error: 'Refresh token not found or expired in DB.' });
    }

    // Get user details
    const [users] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found.' });
    }

    const user = users[0];

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Swap refresh tokens (delete old, insert new)
    await pool.query('DELETE FROM refresh_tokens WHERE id = ?', [dbToken.id]);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, newRefreshTokenHash, expiresAt]
    );

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('[AuthController] Refresh token error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Forgot Password - generates 6-digit OTP, stores in DB with expiry (10 min), sends email
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    // Find user
    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    
    // To prevent email enumeration, return success even if user isn't found, but don't do anything.
    if (users.length === 0) {
      return res.json({ message: 'If the email exists, an OTP has been sent.' });
    }

    const userId = users[0].id;

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash the OTP
    const otpHash = await bcrypt.hash(otp, 12);

    // Save in DB (clean up old OTPs first)
    await pool.query('DELETE FROM otps WHERE user_id = ?', [userId]);
    await pool.query(
      'INSERT INTO otps (user_id, otp_hash, expires_at, attempts) VALUES (?, ?, ?, 0)',
      [userId, otpHash, expiry]
    );

    // Send email
    await sendOTPEmail(email, otp);

    return res.json({ message: 'If the email exists, an OTP has been sent.' });
  } catch (error) {
    console.error('[AuthController] Forgot password error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Verify OTP - validates OTP + email, resets password
export const verifyOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required.' });
  }

  try {
    // Find user
    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid user or OTP.' });
    }

    const userId = users[0].id;

    // Fetch the latest OTP for this user
    const [otps] = await pool.query(
      'SELECT * FROM otps WHERE user_id = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (otps.length === 0) {
      return res.status(400).json({ error: 'OTP has expired or is invalid. Please request a new one.' });
    }

    const otpRecord = otps[0];

    // Check attempts limit (Max 3 attempts, lock out)
    if (otpRecord.attempts >= 3) {
      return res.status(400).json({ error: 'OTP verification locked out due to too many failed attempts. Please request a new code.' });
    }

    // Increment attempts
    await pool.query('UPDATE otps SET attempts = attempts + 1 WHERE id = ?', [otpRecord.id]);

    // Compare OTP
    const isMatch = await bcrypt.compare(otp.trim(), otpRecord.otp_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid OTP code. Please check and try again.' });
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update user password and delete used OTP and active sessions for security
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, userId]);
    await pool.query('DELETE FROM otps WHERE user_id = ?', [userId]);
    await pool.query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);

    return res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    console.error('[AuthController] Verify OTP error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
