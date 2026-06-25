import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';
import spotifyRoutes from './src/routes/spotifyRoutes.js';
import playlistRoutes from './src/routes/playlistRoutes.js';
import favoritesRoutes from './src/routes/favoritesRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import pool from './src/config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowAllOrigins = frontendUrl === '*';

const allowedOrigins = allowAllOrigins ? [] : [
  frontendUrl,
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins if FRONTEND_URL is "*", otherwise check whitelist
    if (allowAllOrigins || !origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json());

// Logging Middleware for debugging API calls
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/user', userRoutes);

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ 
      status: 'OK', 
      message: 'Spotify Clone API is running smoothly.',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check database error:', error.message);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Spotify Clone API has issues.',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Basic status check route
app.get('/status', (req, res) => {
  res.json({ status: 'OK', message: 'Spotify Clone API is running smoothly.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ServerError]', err);
  res.status(500).json({ error: 'An internal server error occurred.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] Spotify Clone Backend running on http://localhost:${PORT}`);
});
