import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);

  // Fetch playlists dynamically in the sidebar
  const fetchPlaylists = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/api/playlists');
      setPlaylists(res.data);
    } catch (error) {
      console.error('Failed to load playlists in sidebar:', error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [isAuthenticated, location.pathname]); // Re-fetch on navigation or login state change

  const handleCreateQuickPlaylist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const name = `My Playlist #${playlists.length + 1}`;
      const res = await api.post('/api/playlists', {
        name,
        description: 'A custom playlist created for you.'
      });
      // Redirect directly to the new playlist details page
      navigate(`/playlist/${res.data.id}`);
    } catch (error) {
      console.error('Failed to create quick playlist:', error);
    }
  };

  return (
    <div className="w-[25%] h-full p-2 flex flex-col gap-2 text-white hidden lg:flex bg-black">
      {/* Top Navigation Panel */}
      <div className="bg-[#121212] h-[20%] rounded flex flex-col justify-around p-4">
        <div 
          onClick={() => navigate(isAuthenticated ? '/home' : '/')} 
          className={`flex items-center gap-4 cursor-pointer hover:text-white transition duration-200 ${
            location.pathname === '/home' || location.pathname === '/' ? 'text-white' : 'text-neutral-400'
          }`}
        >
          <img className="w-6" src={assets.home_icon} alt="Home" />
          <p className="font-bold">Home</p>
        </div>
        <div 
          onClick={() => navigate(isAuthenticated ? '/search' : '/login')} 
          className={`flex items-center gap-4 cursor-pointer hover:text-white transition duration-200 ${
            location.pathname === '/search' ? 'text-white' : 'text-neutral-400'
          }`}
        >
          <img className="w-6" src={assets.search_icon} alt="Search" />
          <p className="font-bold">Search</p>
        </div>
        {isAuthenticated && (
          <div 
            onClick={() => navigate('/favorites')} 
            className={`flex items-center gap-4 cursor-pointer hover:text-white transition duration-200 ${
              location.pathname === '/favorites' ? 'text-white' : 'text-neutral-400'
            }`}
          >
            <img className="w-6 opacity-80" src={assets.like_icon} alt="Liked Songs" />
            <p className="font-bold">Liked Songs</p>
          </div>
        )}
      </div>

      {/* Library and Playlists Panel */}
      <div className="bg-[#121212] h-[80%] rounded flex flex-col overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-neutral-900">
          <div 
            onClick={() => navigate('/playlists')}
            className="flex items-center gap-3 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <img className="w-6" src={assets.stack_icon} alt="Library" />
            <p className="font-semibold text-sm">Your Library</p>
          </div>
          <button 
            onClick={handleCreateQuickPlaylist}
            className="hover:bg-neutral-800 p-1.5 rounded-full transition"
            title="Create Playlist"
          >
            <img className="w-4" src={assets.plus_icon} alt="Add" />
          </button>
        </div>

        {/* Scrollable List area */}
        <div className="flex-grow overflow-y-auto p-2">
          {!isAuthenticated ? (
            <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col gap-2 pl-4">
              <h1 className="text-sm">Create your first Playlist</h1>
              <p className="font-light text-xs text-neutral-400">It's easy, we will help you</p>
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-1.5 bg-white text-xs text-black rounded-full font-bold self-start mt-2 hover:scale-105 transition"
              >
                Log In
              </button>
            </div>
          ) : playlists.length === 0 ? (
            <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col gap-2 pl-4">
              <h1 className="text-sm">Create your first Playlist</h1>
              <p className="font-light text-xs text-neutral-400">Add tracks to customize your beats</p>
              <button 
                onClick={handleCreateQuickPlaylist}
                className="px-4 py-1.5 bg-white text-xs text-black rounded-full font-bold self-start mt-2 hover:scale-105 transition"
              >
                Create playlist
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {playlists.map((playlist) => (
                <div 
                  key={playlist.id} 
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition hover:bg-[#ffffff0d] ${
                    location.pathname === `/playlist/${playlist.id}` ? 'bg-[#ffffff1a]' : ''
                  }`}
                >
                  <img 
                    className="w-10 h-10 rounded object-cover shadow" 
                    src={playlist.cover_image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100'} 
                    alt={playlist.name} 
                  />
                  <div className="truncate">
                    <p className="text-sm font-semibold truncate text-white">{playlist.name}</p>
                    <p className="text-xs text-neutral-400 truncate">Playlist &bull; {playlist.description ? 'Custom' : 'Empty'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;