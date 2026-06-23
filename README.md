# Full-Stack Spotify Clone

A production-ready, full-stack Spotify clone application built with a modern frontend interface and a scalable Express backend, integrated with MySQL database storage and the Spotify API.

## Project Structure

```text
spotify-devops-project/
├── Frontend/      # React + Vite + Tailwind CSS User Interface
├── backend/       # Node.js + Express.js API Server
└── database/      # MySQL Schema and Seed SQL files
```

---

## Tech Stack

### Frontend
- **Framework**: React.js (via Vite)
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS & Vanilla CSS
- **API Client**: Axios (configured with automated JWT token refreshing interceptors)
- **State Management**: React Context API (AuthContext and PlayerContext)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database Driver**: MySQL2 (with connection pooling)
- **Security**: JWT (Access + Refresh tokens), bcrypt password hashing, express-rate-limit (brute force protection)
- **Email Delivery**: Resend SDK (with local logging fallback for dev sandbox environment)
- **External Integration**: Spotify API Proxy (utilizing Client Credentials Grant Flow)

### Database
- **Engine**: MySQL (v8.0+)
- **Tables**: `users`, `otps`, `playlists`, `playlist_tracks`, `favorites`, `refresh_tokens`

---

## Local Setup Instructions

Follow these step-by-step instructions to get the application running locally:

### 1. MySQL Database Setup

1. Open your terminal and connect to your MySQL instance:
   ```bash
   mysql -u root -p
   ```
2. Run the schema script to create the database and tables:
   ```bash
   source database/schema.sql;
   ```
3. Run the seed script to import test data:
   ```bash
   source database/seed.sql;
   ```

*Alternatively, import `database/schema.sql` and `database/seed.sql` inside your graphic database editor like MySQL Workbench or phpMyAdmin.*

---

### 2. Backend Installation and Run

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables in a `.env` file (copied from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   *Make sure database credentials and Spotify keys are filled.*
4. Start the development server (runs on port 5000 by default):
   ```bash
   npm run dev
   ```

---

### 3. Frontend Installation and Run

1. Navigate to the `Frontend` folder:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port number backend listens on | `5000` |
| `DB_HOST` | MySQL server host | `localhost` |
| `DB_PORT` | MySQL connection port | `3306` |
| `DB_NAME` | MySQL database name | `spotify_clone` |
| `DB_USER` | MySQL database user | `root` |
| `DB_PASSWORD` | MySQL database password | `qwert9003594227Q!` |
| `JWT_SECRET` | Secret key for JWT Access Tokens | *Random String* |
| `JWT_REFRESH_SECRET` | Secret key for JWT Refresh Tokens | *Random String* |
| `JWT_EXPIRES_IN` | Life of access tokens | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Life of refresh tokens | `7d` |
| `SPOTIFY_CLIENT_ID` | Spotify App Client ID | *Your Client ID* |
| `SPOTIFY_CLIENT_SECRET` | Spotify App Client Secret | *Your Client Secret* |
| `RESEND_API_KEY` | Resend API Key for sending emails | `re_placeholder` |
| `FROM_EMAIL` | Sender email address for OTP | `onboarding@resend.dev` |
| `FRONTEND_URL` | CORS allowed frontend URL | `http://localhost:5173` |

### Frontend Configuration (`Frontend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Root URL of backend API | `http://localhost:5000` |

---

## Core API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Sign in and get access & refresh tokens
- `POST /logout` - Invalidate session refresh tokens
- `POST /refresh-token` - Request new access token using a refresh token
- `POST /forgot-password` - Email a 6-digit OTP code to reset password
- `POST /verify-otp` - Verify code and save new password

### Spotify Proxy (`/api/spotify`)
- `GET /search?q=&type=` - Search songs, artists, and albums
- `GET /featured-playlists` - Fetch featured playlists
- `GET /new-releases` - Fetch new releases
- `GET /track/:id` - Fetch track details by ID
- `GET /artist/:id` - Fetch artist profile and top tracks
- `GET /album/:id` - Fetch album tracks and info
- `GET /recommendations` - Get track recommendations based on seed track IDs

### Custom Playlists (`/api/playlists`)
- `GET /` - List all user playlists
- `POST /` - Create a new playlist
- `GET /:id` - Get playlist track details
- `PUT /:id` - Update playlist metadata
- `DELETE /:id` - Delete playlist
- `POST /:id/tracks` - Add song to playlist
- `DELETE /:id/tracks/:trackId` - Remove song from playlist

### Liked Songs (`/api/favorites`)
- `GET /` - List all favorited songs
- `POST /` - Like a track
- `DELETE /:trackId` - Unlike a track

### User Profile (`/api/user`)
- `GET /profile` - Retrieve user profile details
- `PUT /profile` - Update username and avatar
- `PUT /change-password` - Change account password

---

> [!NOTE]
> **Dockerization and Kubernetes deployment coming in the next phase!**
