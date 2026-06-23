import express from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoritesController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all favorites routes
router.use(authMiddleware);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:trackId', removeFavorite);

export default router;
