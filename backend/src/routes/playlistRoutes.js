import express from 'express';
import {
  getUserPlaylists,
  createPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist
} from '../controllers/playlistController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all playlist routes
router.use(authMiddleware);

router.get('/', getUserPlaylists);
router.post('/', createPlaylist);
router.get('/:id', getPlaylistById);
router.put('/:id', updatePlaylist);
router.delete('/:id', deletePlaylist);
router.post('/:id/tracks', addTrackToPlaylist);
router.delete('/:id/tracks/:trackId', removeTrackFromPlaylist);

export default router;
