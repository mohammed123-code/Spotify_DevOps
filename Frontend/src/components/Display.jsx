import React, { useContext, useEffect, useRef } from "react";
import DisplayHome from "./DisplayHome";
import { Route, Routes, useLocation } from "react-router-dom";
import DisplayAlbum from "./DisplayAlbum";
import DisplayLiked from "./DisplayLiked";
import DisplayPlaylist from "./DisplayPlaylist";
import { PlayerContext } from "../context/PlayerContext";

function Display() {
  const displayref = useRef();
  const loc = useLocation();
  const { albumsData } = useContext(PlayerContext);

  useEffect(() => {
    if (!displayref.current) return;
    const albumMatch = loc.pathname.match(/\/album\/([^/]+)/);
    if (albumMatch) {
      const album = albumsData.find((a) => String(a.id) === String(albumMatch[1]));
      displayref.current.style.background = `linear-gradient(${album?.bgColor || "#1e1e1e"},#121212)`;
    } else if (loc.pathname === "/liked") {
      displayref.current.style.background = "linear-gradient(#5038a0,#121212)";
    } else if (loc.pathname.startsWith("/playlist/")) {
      displayref.current.style.background = "linear-gradient(#283106,#121212)";
    } else {
      displayref.current.style.background = "#121212";
    }
  }, [loc.pathname, albumsData]);

  return (
    <div
      ref={displayref}
      className="flex-1 m-2 ml-2 px-6 pt-4 rounded-lg bg-[#121212] text-white overflow-auto min-w-0"
    >
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route path="/liked" element={<DisplayLiked />} />
        <Route path="/playlist/:id" element={<DisplayPlaylist />} />
      </Routes>
    </div>
  );
}

export default Display;
