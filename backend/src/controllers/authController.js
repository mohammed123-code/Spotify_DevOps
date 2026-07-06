import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = 12;

// Helper to generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email, is_admin: user.is_admin },
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
    const user = { id: userId, username, email, is_admin: 0 };

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
        profile_image: user.profile_image,
        is_admin: user.is_admin
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
    const [users] = await pool.query('SELECT id, username, email, is_admin FROM users WHERE id = ?', [decoded.id]);
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


