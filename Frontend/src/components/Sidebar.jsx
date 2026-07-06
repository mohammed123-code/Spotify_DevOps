import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useContext(AuthContext);

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


    </div>
  );
};

export default Sidebar;