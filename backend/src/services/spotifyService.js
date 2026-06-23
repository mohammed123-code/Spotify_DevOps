import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class SpotifyService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiryTime = null;
  }

  /**
   * Retrieves the access token, requesting a new one if expired.
   */
  async getAccessToken() {
    const now = Date.now();
    // If token exists and is valid (with 60 seconds buffer), return it
    if (this.accessToken && this.tokenExpiryTime && now < (this.tokenExpiryTime - 60000)) {
      return this.accessToken;
    }

    // Otherwise, fetch a new one
    await this.refreshAccessToken();
    return this.accessToken;
  }

  /**
   * Requests a new Client Credentials Access Token from Spotify.
   */
  async refreshAccessToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Spotify Client ID or Client Secret is missing in environment variables.');
    }

    try {
      const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const response = await axios.post('https://accounts.spotify.com/api/token', 
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authHeader}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      // expires_in is in seconds, store as absolute timestamp in ms
      this.tokenExpiryTime = Date.now() + (response.data.expires_in * 1000);
      console.log('[SpotifyService] Access token refreshed successfully. Expires in:', response.data.expires_in, 'seconds');
    } catch (error) {
      console.error('[SpotifyService] Failed to retrieve Spotify access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Spotify API');
    }
  }

  /**
   * Performs an authorized GET request to the Spotify API.
   */
  async get(endpoint, params = {}) {
    const token = await this.getAccessToken();
    try {
      const response = await axios.get(`https://api.spotify.com/v1/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params
      });
      return response.data;
    } catch (error) {
      console.error(`[SpotifyService] Spotify API GET request failed for /${endpoint}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Search for songs, artists, albums.
   */
  async search(query, type = 'track,artist,album', limit = 20) {
    return this.get('search', { q: query, type, limit });
  }

  /**
   * Fetch featured playlists.
   */
  async getFeaturedPlaylists(limit = 10) {
    return this.get('browse/featured-playlists', { limit });
  }

  /**
   * Fetch new releases.
   */
  async getNewReleases(limit = 10) {
    return this.get('browse/new-releases', { limit });
  }

  /**
   * Fetch details for a specific track.
   */
  async getTrack(trackId) {
    return this.get(`tracks/${trackId}`);
  }

  /**
   * Fetch details for a specific artist.
   */
  async getArtist(artistId) {
    return this.get(`artists/${artistId}`);
  }

  /**
   * Fetch top tracks of an artist.
   */
  async getArtistTopTracks(artistId, market = 'US') {
    return this.get(`artists/${artistId}/top-tracks`, { market });
  }

  /**
   * Fetch details for a specific album.
   */
  async getAlbum(albumId) {
    return this.get(`albums/${albumId}`);
  }

  /**
   * Fetch track recommendations based on seed track IDs.
   */
  async getRecommendations(seedTracks, limit = 10) {
    return this.get('recommendations', { seed_tracks: seedTracks, limit });
  }
}

export default new SpotifyService();
