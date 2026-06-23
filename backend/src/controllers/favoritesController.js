import pool from '../config/db.js';

// Get all favorites for user
export const getFavorites = async (req, res) => {
  const userId = req.user.id;
  try {
    const [favorites] = await pool.query(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
      [userId]
    );
    return res.json(favorites);
  } catch (error) {
    console.error('[FavoritesController] getFavorites error:', error);
    return res.status(500).json({ error: 'Failed to retrieve favorites.' });
  }
};

// Add track to favorites
export const addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { spotify_track_id, track_name, artist_name, album_name, cover_url, preview_url, duration_ms } = req.body;

  if (!spotify_track_id || !track_name || !artist_name || !duration_ms) {
    return res.status(400).json({ error: 'Missing track details (spotify_track_id, track_name, artist_name, duration_ms are required).' });
  }

  try {
    // Check if track is already in favorites
    const [existing] = await pool.query(
      'SELECT id FROM favorites WHERE user_id = ? AND spotify_track_id = ?',
      [userId, spotify_track_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Track is already in your favorites.' });
    }

    await pool.query(
      `INSERT INTO favorites (user_id, spotify_track_id, track_name, artist_name, album_name, cover_url, preview_url, duration_ms) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, spotify_track_id, track_name, artist_name, album_name || '', cover_url || '', preview_url || '', duration_ms]
    );

    return res.status(201).json({ message: 'Track added to favorites.' });
  } catch (error) {
    console.error('[FavoritesController] addFavorite error:', error);
    return res.status(500).json({ error: 'Failed to add track to favorites.' });
  }
};

// Remove track from favorites
export const removeFavorite = async (req, res) => {
  const userId = req.user.id;
  const { trackId } = req.params; // spotify_track_id

  try {
    const [result] = await pool.query(
      'DELETE FROM favorites WHERE user_id = ? AND spotify_track_id = ?',
      [userId, trackId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Track not found in favorites.' });
    }

    return res.json({ message: 'Track removed from favorites.' });
  } catch (error) {
    console.error('[FavoritesController] removeFavorite error:', error);
    return res.status(500).json({ error: 'Failed to remove track from favorites.' });
  }
};
