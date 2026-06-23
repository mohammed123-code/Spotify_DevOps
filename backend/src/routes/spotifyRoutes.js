import express from 'express';
import {
  search,
  getFeaturedPlaylists,
  getNewReleases,
  getTrack,
  getArtist,
  getAlbum,
  getRecommendations
} from '../controllers/spotifyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all Spotify proxy routes
router.use(authMiddleware);

router.get('/search', search);
router.get('/featured-playlists', getFeaturedPlaylists);
router.get('/new-releases', getNewReleases);
router.get('/track/:id', getTrack);
router.get('/artist/:id', getArtist);
router.get('/album/:id', getAlbum);
router.get('/recommendations', getRecommendations);

export default router;
