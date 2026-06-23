import pool from '../config/db.js';

// Get all playlists for the logged-in user
export const getUserPlaylists = async (req, res) => {
  const userId = req.user.id;
  try {
    const [playlists] = await pool.query(
      'SELECT * FROM playlists WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return res.json(playlists);
  } catch (error) {
    console.error('[PlaylistController] getUserPlaylists error:', error);
    return res.status(500).json({ error: 'Failed to retrieve playlists.' });
  }
};

// Create a new playlist
export const createPlaylist = async (req, res) => {
  const userId = req.user.id;
  const { name, description, cover_image, is_public } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Playlist name is required.' });
  }

  try {
    const defaultCover = cover_image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300';
    const [result] = await pool.query(
      'INSERT INTO playlists (user_id, name, description, cover_image, is_public) VALUES (?, ?, ?, ?, ?)',
      [userId, name, description || '', defaultCover, is_public ?? false]
    );

    const [newPlaylist] = await pool.query('SELECT * FROM playlists WHERE id = ?', [result.insertId]);
    return res.status(201).json(newPlaylist[0]);
  } catch (error) {
    console.error('[PlaylistController] createPlaylist error:', error);
    return res.status(500).json({ error: 'Failed to create playlist.' });
  }
};

// Get playlist by ID including tracks
export const getPlaylistById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [playlists] = await pool.query('SELECT * FROM playlists WHERE id = ?', [id]);
    if (playlists.length === 0) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }

    const playlist = playlists[0];

    // Check permissions (private playlists can only be viewed by the owner)
    if (!playlist.is_public && playlist.user_id !== userId) {
      return res.status(403).json({ error: 'You do not have permission to view this playlist.' });
    }

    // Get tracks inside this playlist
    const [tracks] = await pool.query(
      'SELECT * FROM playlist_tracks WHERE playlist_id = ? ORDER BY added_at ASC',
      [id]
    );

    return res.json({
      ...playlist,
      tracks
    });
  } catch (error) {
    console.error('[PlaylistController] getPlaylistById error:', error);
    return res.status(500).json({ error: 'Failed to retrieve playlist details.' });
  }
};

// Update playlist name, description, cover
export const updatePlaylist = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { name, description, cover_image, is_public } = req.body;

  try {
    // Check ownership
    const [playlists] = await pool.query('SELECT * FROM playlists WHERE id = ?', [id]);
    if (playlists.length === 0) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }

    const playlist = playlists[0];
    if (playlist.user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this playlist.' });
    }

    await pool.query(
      'UPDATE playlists SET name = ?, description = ?, cover_image = ?, is_public = ? WHERE id = ?',
      [
        name !== undefined ? name : playlist.name,
        description !== undefined ? description : playlist.description,
        cover_image !== undefined ? cover_image : playlist.cover_image,
        is_public !== undefined ? is_public : playlist.is_public,
        id
      ]
    );

    const [updated] = await pool.query('SELECT * FROM playlists WHERE id = ?', [id]);
    return res.json({ message: 'Playlist updated successfully.', playlist: updated[0] });
  } catch (error) {
    console.error('[PlaylistController] updatePlaylist error:', error);
    return res.status(500).json({ error: 'Failed to update playlist.' });
  }
};

// Delete a playlist
export const deletePlaylist = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check ownership
    const [playlists] = await pool.query('SELECT user_id FROM playlists WHERE id = ?', [id]);
    if (playlists.length === 0) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }

    if (playlists[0].user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this playlist.' });
    }

    await pool.query('DELETE FROM playlists WHERE id = ?', [id]);
    return res.json({ message: 'Playlist deleted successfully.' });
  } catch (error) {
    console.error('[PlaylistController] deletePlaylist error:', error);
    return res.status(500).json({ error: 'Failed to delete playlist.' });
  }
};

// Add track to playlist
export const addTrackToPlaylist = async (req, res) => {
  const { id } = req.params; // playlist id
  const userId = req.user.id;
  const { spotify_track_id, track_name, artist_name, album_name, cover_url, preview_url, duration_ms } = req.body;

  if (!spotify_track_id || !track_name || !artist_name || !duration_ms) {
    return res.status(400).json({ error: 'Missing track details (spotify_track_id, track_name, artist_name, duration_ms are required).' });
  }

  try {
    // Check ownership
    const [playlists] = await pool.query('SELECT user_id FROM playlists WHERE id = ?', [id]);
    if (playlists.length === 0) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }

    if (playlists[0].user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to add tracks to this playlist.' });
    }

    // Check if track already in playlist to prevent unique constraint error
    const [existing] = await pool.query(
      'SELECT id FROM playlist_tracks WHERE playlist_id = ? AND spotify_track_id = ?',
      [id, spotify_track_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Track is already in this playlist.' });
    }

    await pool.query(
      `INSERT INTO playlist_tracks (playlist_id, spotify_track_id, track_name, artist_name, album_name, cover_url, preview_url, duration_ms) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, spotify_track_id, track_name, artist_name, album_name || '', cover_url || '', preview_url || '', duration_ms]
    );

    return res.status(201).json({ message: 'Track added to playlist successfully.' });
  } catch (error) {
    console.error('[PlaylistController] addTrackToPlaylist error:', error);
    return res.status(500).json({ error: 'Failed to add track to playlist.' });
  }
};

// Remove track from playlist
export const removeTrackFromPlaylist = async (req, res) => {
  const { id, trackId } = req.params; // playlist id, spotify_track_id
  const userId = req.user.id;

  try {
    // Check ownership
    const [playlists] = await pool.query('SELECT user_id FROM playlists WHERE id = ?', [id]);
    if (playlists.length === 0) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }

    if (playlists[0].user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to remove tracks from this playlist.' });
    }

    const [result] = await pool.query(
      'DELETE FROM playlist_tracks WHERE playlist_id = ? AND spotify_track_id = ?',
      [id, trackId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Track not found in this playlist.' });
    }

    return res.json({ message: 'Track removed from playlist successfully.' });
  } catch (error) {
    console.error('[PlaylistController] removeTrackFromPlaylist error:', error);
    return res.status(500).json({ error: 'Failed to remove track from playlist.' });
  }
};
