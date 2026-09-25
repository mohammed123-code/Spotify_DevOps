import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAuth } from "../context/AuthContext";
import { PlayerContext } from "../context/PlayerContext";

const iconBtn = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "transparent",
  border: "none",
  color: "#b3b3b3",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useContext(PlayerContext);
  const [dropOpen, setDropOpen] = useState(false);
  const isHome = location.pathname === "/" && !searchQuery;

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (location.pathname !== "/") navigate("/");
  };

  const goHome = () => {
    setSearchQuery("");
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header
      className="w-full h-16 bg-black flex items-center px-3 shrink-0 relative z-40"
      style={{ minHeight: 64 }}
    >
      <div className="flex items-center gap-2 w-[220px] shrink-0">
        {/* Spotify Logo */}
        <button type="button" onClick={goHome} title="Spotify Home" className="shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className="w-8 h-8" fill="#1DB954" aria-label="Spotify">
            <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-[#0a0a0a] flex items-center justify-center hover:bg-[#1a1a1a]"
        >
          <img src={assets.arrow_left} className="w-4 brightness-200" alt="back" />
        </button>
        <button
          type="button"
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-[#0a0a0a] flex items-center justify-center hover:bg-[#1a1a1a]"
        >
          <img src={assets.arrow_right} className="w-4 brightness-200" alt="forward" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={goHome}
          title="Home"
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ background: isHome ? "#282828" : "#1f1f1f" }}
        >
          <img src={assets.home_icon} className="w-6 brightness-[10]" alt="Home" />
        </button>

        <div
          className="flex items-center h-12 rounded-full px-4 gap-3"
          style={{
            width: "min(548px, 52vw)",
            background: "#1f1f1f",
            border: "1px solid transparent",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#fff";
            e.currentTarget.style.background = "#2a2a2a";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.background = "#1f1f1f";
          }}
        >
          <img src={assets.search_icon} className="w-5 opacity-70 brightness-[8] shrink-0" alt="" />
          <input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="What do you want to play?"
            className="flex-1 bg-transparent outline-none text-white text-[15px] placeholder:text-[#b3b3b3]"
          />
          <div className="w-px h-6 bg-[#3e3e3e]" />
          <button type="button" title="Browse" className="opacity-70 hover:opacity-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="1.5" fill="#fff" />
              <rect x="13" y="3" width="8" height="8" rx="1.5" fill="#fff" />
              <rect x="3" y="13" width="8" height="8" rx="1.5" fill="#fff" />
              <rect x="13" y="13" width="8" height="8" rx="1.5" fill="#fff" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1 w-[220px] shrink-0">
        <button type="button" style={iconBtn} title="What's New">
          <img src={assets.bell_icon} className="w-5 brightness-[8] opacity-80" alt="notifications" />
        </button>
        <button type="button" style={iconBtn} title="Friend Activity">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#b3b3b3">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        </button>

        <div className="relative ml-1">
          <button
            type="button"
            onClick={() => setDropOpen((o) => !o)}
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-black"
            style={{ background: "#f59e0b" }}
            title={user?.name}
          >
            {initial}
          </button>
          {dropOpen && (
            <div className="absolute top-[calc(100%+10px)] right-0 bg-[#282828] rounded-lg min-w-[200px] shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-[#3e3e3e]">
                <div className="text-white font-bold text-sm">{user?.name}</div>
                <div className="text-[#b3b3b3] text-xs">{user?.email}</div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-white text-sm hover:bg-[#3e3e3e]"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
