# Spotify Clone — Admin Dashboard

The admin panel for the Spotify Clone project. It lets you manage songs and albums — upload new tracks, create albums, and delete content — all connected to the shared backend API.

---

## Tech Stack

- **React 19** with React Router v7
- **Vite** (build tool)
- **Tailwind CSS v4** (styling)
- **Axios** (API communication)
- **Oxlint** (linting)

---

## Project Structure

```
admin/
├── public/             # Static assets & favicon
├── src/
│   ├── components/
│   │   └── Sidebar.jsx     # Navigation sidebar
│   ├── pages/
│   │   ├── AddSong.jsx     # Upload a new song
│   │   ├── AddAlbum.jsx    # Create a new album
│   │   ├── ListSongs.jsx   # View & delete songs
│   │   └── ListAlbums.jsx  # View & delete albums
│   ├── utils/
│   │   └── api.js          # Axios instance (base URL config)
│   ├── App.jsx
│   └── main.jsx
├── nginx.conf          # Nginx config for Docker production build
├── Dockerfile
└── vite.config.js
```

---

## Local Development

### Prerequisites

- Node.js 18+
- The backend running at `http://localhost:4000`

### Setup

```bash
npm install
npm run dev
```

The app starts at **http://localhost:5174** (or the next available Vite port).

### Environment

The backend URL is injected at build time via a Vite build arg. For local dev, it defaults to `http://localhost:4000`. To override, set `VITE_BACKEND_URL` in a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:4000
```

---

## Running with Docker

The admin container is managed by the root `docker-compose.yml`. To build and run it in isolation:

```bash
docker build --build-arg VITE_BACKEND_URL=http://localhost:4000 -t spotify-admin .
docker run -p 8081:80 spotify-admin
```

Access it at **http://localhost:8081**.

---

## Features

| Page          | Description                                      |
|---------------|--------------------------------------------------|
| Add Song      | Upload an MP3/WAV with cover image and metadata  |
| Add Album     | Create a named album with cover art              |
| List Songs    | Browse all songs, delete individual tracks       |
| List Albums   | Browse all albums, delete with confirmation      |

---

## Scripts

| Command         | Description                      |
|-----------------|----------------------------------|
| `npm run dev`   | Start development server         |
| `npm run build` | Production build to `dist/`      |
| `npm run lint`  | Run Oxlint                       |
| `npm run preview` | Preview production build       |
