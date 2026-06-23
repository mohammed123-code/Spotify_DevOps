import React, { useState, useEffect, useContext } from 'react';
import Navbar from './Navbar';
import api from '../api';
import { PlayerContext } from '../context/PlayerContext';
import { assets } from '../assets/assets';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrackFromQueue } = useContext(PlayerContext);

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/api/favorites');
      setFavorites(res.data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handlePlaySong = (trackIndex) => {
    if (favorites.length === 0) return;

    const formattedQueue = favorites.map(item => ({
      id: item.spotify_track_id,
      name: item.track_name,
      artist: item.artist_name,
      file: item.preview_url,
      image: item.cover_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100',
      duration: Math.floor(item.duration_ms / 1000)
    }));

    playTrackFromQueue(formattedQueue, trackIndex);
  };

  const handleRemoveFavorite = async (spotifyTrackId) => {
    try {
      await api.delete(`/api/favorites/${spotifyTrackId}`);
      // Filter out locally
      setFavorites(prev => prev.filter(t => t.spotify_track_id !== spotifyTrackId));
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  };

  if (loading) return <div className="text-neutral-400 py-10">Loading liked songs...</div>;

  return (
    <>
      <Navbar />

      <div className="flex flex-col gap-6 pb-12">
        {/* Header Hero Area */}
        <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end p-6 rounded-lg bg-gradient-to-b from-indigo-900 to-[#121212]">
          <div className="w-48 h-48 rounded bg-gradient-to-br from-indigo-700 to-purple-800 flex items-center justify-center shadow-2xl">
            <img className="w-20 opacity-80" src={assets.like_icon} alt="Heart" />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">PLAYLIST</p>
            <h2 className="text-4xl font-extrabold mb-3 md:text-6xl text-white">Liked Songs</h2>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
              <span className="text-[#1DB954]">Spotify Clone User</span>
              <span>&bull;</span>
              <span>{favorites.length} songs</span>
            </div>
          </div>
        </div>

        {/* Table of Songs */}
        <div className="mt-8">
          <div className="grid grid-cols-12 pl-2 text-[#a7a7a7] border-b border-neutral-800 pb-2 text-sm">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-4">Album</div>
            <div className="col-span-1 flex justify-center">
              <img className="w-4" src={assets.clock_icon} alt="Duration" />
            </div>
            <div className="col-span-1 text-right pr-2">Actions</div>
          </div>

          {favorites.length === 0 ? (
            <div className="text-neutral-500 py-20 text-center text-sm">
              Songs you like will appear here. Go to Search to find tracks!
            </div>
          ) : (
            <div className="flex flex-col mt-2">
              {favorites.map((track, index) => (
                <div 
                  key={track.id} 
                  className="grid grid-cols-12 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer rounded transition group"
                >
                  <div onClick={() => handlePlaySong(index)} className="col-span-1 text-sm text-neutral-400">{index + 1}</div>
                  
                  <div onClick={() => handlePlaySong(index)} className="col-span-5 flex items-center gap-3">
                    <img 
                      className="w-10 h-10 rounded object-cover" 
                      src={track.cover_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100'} 
                      alt="" 
                    />
                    <div className="truncate">
                      <p className="text-white font-semibold truncate group-hover:text-[#1DB954]">{track.track_name}</p>
                      <p className="text-xs text-neutral-400 truncate">{track.artist_name}</p>
                    </div>
                  </div>

                  <div onClick={() => handlePlaySong(index)} className="col-span-4 text-sm truncate">{track.album_name}</div>
                  
                  <div onClick={() => handlePlaySong(index)} className="col-span-1 flex justify-center text-sm">
                    {Math.floor((track.duration_ms || 0) / 60000)}:
                    {String(Math.floor(((track.duration_ms || 0) % 60000) / 1000)).padStart(2, '0')}
                  </div>

                  <div className="col-span-1 text-right pr-2">
                    <button 
                      onClick={() => handleRemoveFavorite(track.spotify_track_id)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Favorites;
