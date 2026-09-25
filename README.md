# Spotify Clone — Full-Stack DevOps Project

A full-stack Spotify-inspired music streaming application built with React, Node.js, MySQL, and Cloudinary. The entire stack is containerized with Docker Compose for easy local development and deployment.

---

## Project Structure

```
Spotify_DevOps/
├── frontend/        # React user-facing app (Vite + Tailwind)
├── admin/           # React admin dashboard (Vite + Tailwind)
├── backend/         # Node.js REST API (Express + Sequelize + MySQL)
├── docker-compose.yml
└── .env.example
```

---

## Services

| Service    | Description                        | Local Port |
|------------|------------------------------------|------------|
| `frontend` | User-facing music player app       | `8080`     |
| `admin`    | Admin dashboard (manage songs/albums) | `8081`  |
| `backend`  | REST API (Express + MySQL)         | `4000`     |
| `mysql`    | MySQL 8.0 database                 | `3307`     |

---

## Tech Stack

**Frontend & Admin**
- React 18/19, React Router v7
- Vite, Tailwind CSS
- Axios
- Served via Nginx in production containers

**Backend**
- Node.js, Express
- Sequelize ORM + MySQL 2
- Cloudinary (audio & image uploads)
- JWT authentication, bcryptjs
- Multer (multipart file handling)

**Infrastructure**
- Docker & Docker Compose
- MySQL 8.0 with persistent volume
- Nginx (frontend/admin static serving)

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed
- A [Cloudinary](https://cloudinary.com/) account (free tier works)

### 1. Clone the repository

```bash
git clone <repo-url>
cd Spotify_DevOps
```

### 2. Configure environment variables

Copy the backend example file and fill in your values:

```bash
cp backend/.env.example backend/.env
```

```env
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=spotify_clone

CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

JWT_SECRET=your_jwt_secret_key
PORT=4000
```

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

| URL                         | Service         |
|-----------------------------|-----------------|
| http://localhost:8080        | Frontend app    |
| http://localhost:8081        | Admin dashboard |
| http://localhost:4000        | Backend API     |

---

## Local Development (without Docker)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev            # starts with nodemon
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

### Admin

```bash
cd admin
npm install
npm run dev            # http://localhost:5174
```

---

## API Endpoints

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | `/`                | Health check             |
| GET    | `/api/songs`       | List all songs           |
| POST   | `/api/songs`       | Upload a new song        |
| DELETE | `/api/songs/:id`   | Delete a song            |
| GET    | `/api/albums`      | List all albums          |
| POST   | `/api/albums`      | Create a new album       |
| DELETE | `/api/albums/:id`  | Delete an album          |
| POST   | `/api/auth/register` | Register a user        |
| POST   | `/api/auth/login`  | Login and get JWT token  |

---

## File Uploads

Audio files and cover images are uploaded directly to **Cloudinary**. Multer handles the multipart form data on the backend, streams files to Cloudinary, then stores the resulting URLs in MySQL via Sequelize.

---

## Database

MySQL 8.0 runs in its own container with a named Docker volume (`mysql_data`) so data persists across restarts. Sequelize auto-syncs the models on startup.

---

## License

MIT
