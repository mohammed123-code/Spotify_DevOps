import bcrypt from 'bcrypt';
import pool from '../config/db.js';

const SALT_ROUNDS = 12;

// Get user profile
export const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, profile_image, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json(users[0]);
  } catch (error) {
    console.error('[UserController] getProfile error:', error);
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
};

// Update user profile (username, profile_image)
export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, profile_image } = req.body;

  try {
    const [users] = await pool.query('SELECT username, profile_image FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = users[0];
    const newUsername = username !== undefined ? username : user.username;
    const newProfileImage = profile_image !== undefined ? profile_image : user.profile_image;

    await pool.query(
      'UPDATE users SET username = ?, profile_image = ? WHERE id = ?',
      [newUsername, newProfileImage, userId]
    );

    return res.json({
      message: 'Profile updated successfully.',
      user: {
        id: userId,
        username: newUsername,
        profile_image: newProfileImage
      }
    });
  } catch (error) {
    console.error('[UserController] updateProfile error:', error);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }

  try {
    // Get user password hash
    const [users] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = users[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid current password.' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update DB
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, userId]);

    // Optional: Delete user's active sessions (refresh tokens) so they must re-authenticate on other devices
    await pool.query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);

    return res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('[UserController] changePassword error:', error);
    return res.status(500).json({ error: 'Failed to change password.' });
  }
};
