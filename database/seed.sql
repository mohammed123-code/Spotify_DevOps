USE `spotify_clone`;

-- Seed test user
-- password_hash is bcrypt hash of 'password123'
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `profile_image`) VALUES
(1, 'testuser', 'test@example.com', '$2b$12$Kj/yAecF7H3p5m/nFvKjNehG.5e6F89nS92Yt4mC4hB1U/VvS6l3a', 'https://api.dicebear.com/7.x/adventurer/svg?seed=testuser');

-- Seed playlists for test user
INSERT INTO `playlists` (`id`, `user_id`, `name`, `description`, `cover_image`, `is_public`) VALUES
(1, 1, 'My Chill Beats', 'Relaxing tunes for coding and focusing.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300', TRUE),
(2, 1, 'Workout Mix', 'High energy songs to get you moving.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300', FALSE);

-- Seed playlist tracks
INSERT INTO `playlist_tracks` (`playlist_id`, `spotify_track_id`, `track_name`, `artist_name`, `album_name`, `cover_url`, `preview_url`, `duration_ms`) VALUES
(1, '4PTG3Z6ehGkBF3zI7YSpG0', 'Never Gonna Give You Up', 'Rick Astley', 'Whenever You Need Somebody', 'https://i.scdn.co/image/ab67616d0000b2735755e164993798e3c9ec7d6f', 'https://p.flash.audio.spotify.com/mp3-preview/3eb16018c2a700240e9dfb153abb0901b447833a?cid=d804831a8c8f4890ba1374a3b9f500fa', 213573),
(1, '7ouMYWpwJ422jRcDASZB7P', 'All Mouth', 'Sudan Archives', 'Athena', 'https://i.scdn.co/image/ab67616d0000b273418c3a9f0290518cf037f5a1', 'https://p.flash.audio.spotify.com/mp3-preview/a990ec8587d46c8ee2a2cb8e5efcd57662c1bd7e?cid=d804831a8c8f4890ba1374a3b9f500fa', 198000),
(2, '2TpxZ7JUBn3uw46aR7qd6V', 'The Nights', 'Avicii', 'The Days / Nights', 'https://i.scdn.co/image/ab67616d0000b2730ae4c4edee6512c84013600c', 'https://p.flash.audio.spotify.com/mp3-preview/9f3a9e223d6a4dbcb62a1c0f5f7db7d389a9f993?cid=d804831a8c8f4890ba1374a3b9f500fa', 176658);

-- Seed user favorites
INSERT INTO `favorites` (`user_id`, `spotify_track_id`, `track_name`, `artist_name`, `album_name`, `cover_url`, `preview_url`, `duration_ms`) VALUES
(1, '4PTG3Z6ehGkBF3zI7YSpG0', 'Never Gonna Give You Up', 'Rick Astley', 'Whenever You Need Somebody', 'https://i.scdn.co/image/ab67616d0000b2735755e164993798e3c9ec7d6f', 'https://p.flash.audio.spotify.com/mp3-preview/3eb16018c2a700240e9dfb153abb0901b447833a?cid=d804831a8c8f4890ba1374a3b9f500fa', 213573);
