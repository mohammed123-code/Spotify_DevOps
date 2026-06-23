import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold py-2">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <img 
            onClick={() => navigate(-1)} 
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer hover:scale-105 transition" 
            src={assets.arrow_left} 
            alt="Back" 
          />
          <img 
            onClick={() => navigate(1)} 
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer hover:scale-105 transition" 
            src={assets.arrow_right} 
            alt="Forward" 
          />
        </div>

        {/* Action Buttons & Profile */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button 
                onClick={handleLogout}
                className="bg-black hover:bg-neutral-800 text-white border border-neutral-700 text-[14px] px-4 py-1.5 rounded-full cursor-pointer hover:scale-105 transition"
              >
                Log Out
              </button>
              <div 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 cursor-pointer group"
                title="Profile"
              >
                {user?.profile_image ? (
                  <img 
                    className="w-7 h-7 rounded-full object-cover border border-neutral-700 group-hover:scale-105 transition" 
                    src={user.profile_image} 
                    alt="Profile" 
                  />
                ) : (
                  <div className="bg-green-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold group-hover:scale-105 transition uppercase">
                    {user?.username ? user.username.charAt(0) : 'U'}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/register" 
                className="text-neutral-400 hover:text-white text-[14px] px-4 py-1.5 transition"
              >
                Sign Up
              </Link>
              <Link 
                to="/login" 
                className="bg-white text-black text-[14px] px-6 py-2 rounded-full cursor-pointer hover:scale-105 transition"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Category Pills (only visible when logged in on main views) */}
      {isAuthenticated && (
        <div className="flex items-center gap-2 mt-4">
          <p 
            onClick={() => navigate('/home')} 
            className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer hover:scale-105 transition text-sm"
          >
            All
          </p>
          <p 
            onClick={() => navigate('/playlists')} 
            className="bg-[#242424] text-white px-4 py-1 rounded-2xl cursor-pointer hover:scale-105 hover:bg-neutral-800 transition text-sm"
          >
            Playlists
          </p>
          <p 
            onClick={() => navigate('/favorites')} 
            className="bg-[#242424] text-white px-4 py-1 rounded-2xl cursor-pointer hover:scale-105 hover:bg-neutral-800 transition text-sm"
          >
            Favorites
          </p>
        </div>
      )}
    </>
  );
};

export default Navbar;