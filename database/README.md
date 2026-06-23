# Spotify Clone Database

This folder contains the database schema and seed files for the Spotify Clone application.

## Prerequisites

- MySQL Server (v8.0+ recommended)
- Access credentials (username, password, port)

## Setup Instructions

To initialize the database schema and insert the seed data, you can run the following commands in your MySQL client or command prompt.

### Method 1: Using Command Line (Recommended)

1. Import the schema to create the tables:
   ```bash
   mysql -u root -p < schema.sql
   ```

2. Import the seed data to create the test user and playlists:
   ```bash
   mysql -u root -p < seed.sql
   ```

### Method 2: Raw SQL Execution

Alternatively, copy the contents of `schema.sql` and run it inside your database admin dashboard (like phpMyAdmin or MySQL Workbench), followed by `seed.sql`.

## Table Descriptions

- `users`: Registered users accounts.
- `otps`: One-time password tokens for email password reset.
- `playlists`: User-created custom playlists.
- `playlist_tracks`: Association table linking Spotify tracks to playlists.
- `favorites`: Liked songs for each user.
- `refresh_tokens`: Hashes of JWT refresh tokens to support persistent login sessions.
