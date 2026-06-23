import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import api from '../api';
import { PlayerContext } from '../context/PlayerContext';
import { assets } from '../assets/assets';

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrackFromQueue } = useContext(PlayerContext);

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Search state for adding songs
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const fetchPlaylist = async () => {
    try {
      const res = await api.get(`/api/playlists/${id}`);
      setPlaylist(res.data);
    } catch (error) {
      console.error('Failed to load playlist:', error);
      setErrorMsg(error.response?.data?.error || 'Playlist not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const handleDeletePlaylist = async () => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;

    try {
      await api.delete(`/api/playlists/${id}`);
      navigate('/playlists');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete playlist.');
    }
  };

  const handlePlaySong = (trackIndex) => {
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) return;

    const formattedQueue = playlist.tracks.map(item => ({
      id: item.spotify_track_id,
      name: item.track_name,
      artist: item.artist_name,
      file: item.preview_url,
      image: item.cover_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100',
      duration: Math.floor(item.duration_ms / 1000)
    }));

    playTrackFromQueue(formattedQueue, trackIndex);
  };

  const handleRemoveTrack = async (spotifyTrackId) => {
    try {
      await api.delete(`/api/playlists/${id}/tracks/${spotifyTrackId}`);
      // Refresh playlist tracks locally
      setPlaylist(prev => ({
        ...prev,
        tracks: prev.tracks.filter(t => t.spotify_track_id !== spotifyTrackId)
      }));
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to remove track.');
    }
  };

  const handleSearchSongs = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await api.get(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}&type=track`);
      setSearchResults(res.data.tracks?.items || []);
    } catch (error) {
      console.error('Failed to search songs:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAddTrack = async (spotifyTrack) => {
    try {
      await api.post(`/api/playlists/${id}/tracks`, {
        spotify_track_id: spotifyTrack.id,
        track_name: spotifyTrack.name,
        artist_name: spotifyTrack.artists.map(a => a.name).join(', '),
        album_name: spotifyTrack.album?.name,
        cover_url: spotifyTrack.album?.images?.[0]?.url,
        preview_url: spotifyTrack.preview_url,
        duration_ms: spotifyTrack.duration_ms
      });

      // Refetch playlist to show new track
      fetchPlaylist();
      // Clear query
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add track.');
    }
  };

  if (loading) return <div className="text-neutral-400 py-10">Loading playlist details...</div>;
  if (errorMsg) return <div className="text-red-500 py-10">{errorMsg}</div>;

  return (
    <>
      <Navbar />

      {playlist && (
        <div className="flex flex-col gap-6 pb-12">
          {/* Header Card */}
          <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
            <img 
              className="w-48 h-48 rounded object-cover shadow-2xl" 
              src={playlist.cover_image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300'} 
              alt={playlist.name} 
            />
            <div className="flex flex-col flex-grow">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">PLAYLIST</p>
              <h2 className="text-4xl font-extrabold mb-3 md:text-6xl text-white">
                {playlist.name}
              </h2>
              <p className="text-neutral-400 text-sm mb-4">{playlist.description || 'No description'}</p>
              <div className="flex items-center gap-4 text-xs font-bold">
                <button 
                  onClick={handleDeletePlaylist}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition"
                >
                  Delete Playlist
                </button>
                <span className="text-neutral-500">{playlist.tracks?.length || 0} songs</span>
              </div>
            </div>
          </div>

          {/* Track List */}
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

            {playlist.tracks?.length === 0 ? (
              <div className="text-neutral-500 py-10 text-center text-sm">
                This playlist is empty. Search and add tracks below!
              </div>
            ) : (
              <div className="flex flex-col mt-2">
                {playlist.tracks.map((track, index) => (
                  <div 
                    key={track.id} 
                    className="grid grid-cols-12 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer rounded transition group"
                  >
                    <div onClick={() => handlePlaySong(index)} className="col-span-1 text-sm text-neutral-400">{index + 1}</div>
                    
                    <div onClick={() => handlePlaySong(index)} className="col-span-5 flex items-center gap-3">
                      <img 
                        className="w-10 h-10 rounded object-cover" 
                        src={track.cover_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100'} 
                        alt={track.track_name} 
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
                        onClick={() => handleRemoveTrack(track.spotify_track_id)}
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

          <hr className="border-neutral-800 my-4" />

          {/* Add Songs Section */}
          <div className="bg-[#121212] p-6 rounded-lg border border-neutral-900">
            <h3 className="text-xl font-bold mb-2">Let's add some songs to your playlist</h3>
            <form onSubmit={handleSearchSongs} className="flex gap-2 max-w-md my-4">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for tracks..."
                className="w-full bg-[#242424] border border-neutral-700 focus:border-white focus:outline-none rounded px-3 py-2 text-white text-sm"
              />
              <button 
                type="submit" 
                className="bg-white text-black hover:bg-neutral-200 font-bold px-4 py-2 rounded text-sm transition"
              >
                Search
              </button>
            </form>

            {searching && <div className="text-neutral-400 text-xs">Searching tracks...</div>}

            {searchResults.length > 0 && (
              <div className="flex flex-col bg-[#181818] rounded-lg p-2 max-h-80 overflow-y-auto mt-2">
                {searchResults.map((track) => (
                  <div key={track.id} className="flex items-center justify-between p-2 rounded hover:bg-[#ffffff0d] transition">
                    <div className="flex items-center gap-3">
                      <img 
                        className="w-9 h-9 rounded object-cover" 
                        src={track.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100'} 
                        alt="" 
                      />
                      <div>
                        <p className="font-semibold text-white text-sm">{track.name}</p>
                        <p className="text-xs text-neutral-400">{track.artists.map(a => a.name).join(', ')}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddTrack(track)}
                      className="border border-neutral-600 hover:border-white text-white hover:scale-105 rounded-full px-4 py-1 text-xs font-semibold transition"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistDetail;
