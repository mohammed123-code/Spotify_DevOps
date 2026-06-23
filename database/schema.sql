CREATE DATABASE IF NOT EXISTS `spotify_clone`;
USE `spotify_clone`;

-- Drop tables if they exist to start fresh (in dependency order)
DROP TABLE IF EXISTS `refresh_tokens`;
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `playlist_tracks`;
DROP TABLE IF EXISTS `playlists`;
DROP TABLE IF EXISTS `otps`;
DROP TABLE IF EXISTS `users`;

-- Users table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `profile_image` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OTPs table
CREATE TABLE `otps` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `otp_hash` VARCHAR(255) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `attempts` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Playlists table
CREATE TABLE `playlists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `cover_image` VARCHAR(255) DEFAULT NULL,
  `is_public` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Playlist Tracks table
CREATE TABLE `playlist_tracks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `playlist_id` INT NOT NULL,
  `spotify_track_id` VARCHAR(255) NOT NULL,
  `track_name` VARCHAR(255) NOT NULL,
  `artist_name` VARCHAR(255) NOT NULL,
  `album_name` VARCHAR(255) DEFAULT NULL,
  `cover_url` VARCHAR(255) DEFAULT NULL,
  `preview_url` VARCHAR(255) DEFAULT NULL,
  `duration_ms` INT NOT NULL,
  `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_playlist_track` (`playlist_id`, `spotify_track_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Favorites (Liked Songs) table
CREATE TABLE `favorites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `spotify_track_id` VARCHAR(255) NOT NULL,
  `track_name` VARCHAR(255) NOT NULL,
  `artist_name` VARCHAR(255) NOT NULL,
  `album_name` VARCHAR(255) DEFAULT NULL,
  `cover_url` VARCHAR(255) DEFAULT NULL,
  `preview_url` VARCHAR(255) DEFAULT NULL,
  `duration_ms` INT NOT NULL,
  `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_favorite` (`user_id`, `spotify_track_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refresh Tokens table
CREATE TABLE `refresh_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
