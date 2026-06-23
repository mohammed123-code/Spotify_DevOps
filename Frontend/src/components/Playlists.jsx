import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import api from '../api';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const fetchPlaylists = async () => {
    try {
      const res = await api.get('/api/playlists');
      setPlaylists(res.data);
    } catch (error) {
      console.error('Failed to fetch user playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setErrorMsg('');
    try {
      const res = await api.post('/api/playlists', {
        name: newPlaylistName,
        description: newPlaylistDesc
      });
      setPlaylists([res.data, ...playlists]);
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setShowCreateForm(false);
    } catch (error) {
      setErrorMsg(error.response?.data?.error || 'Failed to create playlist.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-between items-center my-6">
        <h1 className="text-3xl font-bold">Your Playlists</h1>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-white text-black hover:bg-neutral-200 font-bold px-5 py-2.5 rounded-full text-sm transition"
        >
          {showCreateForm ? 'Cancel' : 'Create Playlist'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreatePlaylist} className="bg-[#181818] p-6 rounded-lg max-w-md mb-6 border border-neutral-800">
          <h3 className="text-lg font-bold mb-4">Create Playlist</h3>
          {errorMsg && <div className="text-red-500 text-xs mb-3">{errorMsg}</div>}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-neutral-400 font-bold mb-1">NAME</label>
              <input 
                type="text" 
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="My Awesome Playlist"
                className="w-full bg-[#242424] border border-neutral-700 focus:border-white focus:outline-none rounded px-3 py-2 text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 font-bold mb-1">DESCRIPTION (OPTIONAL)</label>
              <textarea 
                value={newPlaylistDesc}
                onChange={(e) => setNewPlaylistDesc(e.target.value)}
                placeholder="Describe your playlist..."
                className="w-full bg-[#242424] border border-neutral-700 focus:border-white focus:outline-none rounded px-3 py-2 text-white text-sm h-20 resize-none"
              />
            </div>
            <button 
              type="submit" 
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-2 px-4 rounded-full text-sm transition"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-neutral-400 py-10">Loading playlists...</div>
      ) : playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
          <p className="text-lg">No playlists yet.</p>
          <p className="text-xs mt-1">Create your first playlist and start adding songs!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-10">
          {playlists.map((playlist) => (
            <div 
              key={playlist.id} 
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              className="bg-[#181818] p-4 rounded-lg flex flex-col gap-3 hover:bg-[#282828] transition cursor-pointer group"
            >
              <img 
                className="w-full aspect-square rounded object-cover shadow-lg" 
                src={playlist.cover_image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300'} 
                alt={playlist.name} 
              />
              <div>
                <p className="font-semibold text-sm truncate">{playlist.name}</p>
                <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{playlist.description || 'No description provided.'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Playlists;
