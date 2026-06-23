import spotifyService from '../services/spotifyService.js';

// Search songs, artists, albums
export const search = async (req, res) => {
  const { q, type } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query (q) is required.' });
  }

  try {
    const data = await spotifyService.search(q, type);
    return res.json(data);
  } catch (error) {
    console.error('[SpotifyController] Search error:', error.message);
    return res.status(500).json({ error: 'Failed to search Spotify.' });
  }
};

// Get featured playlists
export const getFeaturedPlaylists = async (req, res) => {
  try {
    const data = await spotifyService.getFeaturedPlaylists();
    return res.json(data);
  } catch (error) {
    console.error('[SpotifyController] Get featured playlists error:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve featured playlists.' });
  }
};

// Get new releases
export const getNewReleases = async (req, res) => {
  try {
    const data = await spotifyService.getNewReleases();
    return res.json(data);
  } catch (error) {
    console.error('[SpotifyController] Get new releases error:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve new releases.' });
  }
};

// Get track by ID
export const getTrack = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await spotifyService.getTrack(id);
    return res.json(data);
  } catch (error) {
    console.error('[SpotifyController] Get track error:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve track.' });
  }
};

// Get artist by ID (includes top tracks)
export const getArtist = async (req, res) => {
  const { id } = req.params;
  try {
    const artist = await spotifyService.getArtist(id);
    let topTracks = [];
    try {
      const topTracksData = await spotifyService.getArtistTopTracks(id);
      topTracks = topTracksData.tracks || [];
    } catch (trackError) {
      console.warn('[SpotifyController] Failed to fetch artist top tracks:', trackError.message);
    }
    return res.json({ artist, topTracks });
  } catch (error) {
    console.error('[SpotifyController] Get artist error:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve artist details.' });
  }
};

// Get album by ID
export const getAlbum = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await spotifyService.getAlbum(id);
    return res.json(data);
  } catch (error) {
    console.error('[SpotifyController] Get album error:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve album.' });
  }
};

// Get recommendations
export const getRecommendations = async (req, res) => {
  const { seedTracks } = req.query;

  if (!seedTracks) {
    return res.status(400).json({ error: 'seedTracks parameter is required.' });
  }

  try {
    const data = await spotifyService.getRecommendations(seedTracks);
    return res.json(data);
  } catch (error) {
    console.error('[SpotifyController] Get recommendations error:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve recommendations.' });
  }
};
