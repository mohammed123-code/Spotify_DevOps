import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-black text-white flex flex-col justify-between p-6">
      {/* Navbar */}
      <div className="flex justify-between items-center max-w-6xl w-full mx-auto py-4">
        <div className="flex items-center gap-2">
          <img className="w-10" src={assets.spotify_logo} alt="Spotify Logo" />
          <span className="font-bold text-2xl tracking-tight">Spotify Clone</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/login')} 
            className="text-white hover:text-green-500 font-semibold px-4 py-2 transition"
          >
            Log In
          </button>
          <button 
            onClick={() => navigate('/register')} 
            className="bg-white text-black hover:bg-neutral-200 font-bold px-6 py-2 rounded-full transition"
          >
            Sign Up Free
          </button>
        </div>
      </div>

      {/* Hero section */}
      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto flex-grow gap-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none">
          Listening is <br />
          <span className="text-[#1DB954]">everything.</span>
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl max-w-lg mt-2">
          Millions of songs and podcasts. No credit card needed. Start listening now!
        </p>
        <button 
          onClick={() => navigate('/register')} 
          className="bg-[#1DB954] text-white hover:bg-[#1ed760] hover:scale-105 font-bold px-8 py-4 rounded-full mt-4 transition duration-300 text-lg shadow-lg"
        >
          GET SPOTIFY FREE
        </button>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-neutral-800 text-xs text-neutral-500">
        <p>&copy; 2026 Spotify Clone. Built with React, Node.js, and MySQL.</p>
      </div>
    </div>
  );
};

export default Landing;
