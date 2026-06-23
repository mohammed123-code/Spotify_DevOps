import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import Search from "./Search";
import Playlists from "./Playlists";
import PlaylistDetail from "./PlaylistDetail";
import Favorites from "./Favorites";
import Profile from "./Profile";
import { albumsData } from "../assets/assets";

function Display() {
  const displayref = useRef();
  const loc = useLocation();
  
  const isAlbum = loc.pathname.includes("album");
  const albumID = isAlbum ? loc.pathname.split("/").pop() : "";
  
  // Safe bgColor lookup preventing NaN crashes on Spotify album IDs
  const hasLocalAlbum = isAlbum && !isNaN(Number(albumID)) && albumsData[Number(albumID)];
  const bgclr = hasLocalAlbum ? albumsData[Number(albumID)].bgColor : "#121212";

  useEffect(() => {
    if (isAlbum && hasLocalAlbum) {
      displayref.current.style.background = `linear-gradient(${bgclr}, #121212)`;
    } else {
      displayref.current.style.background = "#121212";
    }
  }, [loc.pathname, isAlbum, bgclr, hasLocalAlbum]);

  return (
    <div
      ref={displayref}
      className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0"
    >
      <Routes>
        <Route path="/home" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route path="/search" element={<Search />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default Display;
