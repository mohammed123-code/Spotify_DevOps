import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import AddToPlaylist from "./AddToPlaylist";

const DisplayLiked = () => {
  const { playWithId } = useContext(PlayerContext);
  const { likedSongs, toggleLike } = useLibrary();
  const { user } = useAuth();

  return (
    <div>
      <div className="mt-6 flex gap-6 flex-col md:flex-row md:items-end">
        <div
          className="w-48 h-48 rounded shadow-2xl flex items-center justify-center text-7xl shrink-0"
          style={{ background: "linear-gradient(135deg, #450af5, #c4b5fd)" }}
        >
          ♥
        </div>
        <div>
          <p className="text-sm text-white font-semibold">Playlist</p>
          <h2 className="text-5xl md:text-7xl font-black mb-4">Liked Songs</h2>
          <p className="text-sm text-[#b3b3b3]">
            <b className="text-white">{user?.name || "You"}</b> · {likedSongs.length} songs
          </p>
        </div>
      </div>

      {likedSongs.length > 0 && (
        <button
          type="button"
          onClick={() => playWithId(likedSongs[0].id)}
          className="mt-8 w-14 h-14 rounded-full bg-[#1DB954] flex items-center justify-center hover:scale-105"
        >
          <img src={assets.play_icon} className="w-5 invert" alt="play" />
        </button>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 mt-8 mb-4 pl-2 text-[#a7a7a7] text-sm">
        <p><b className="mr-4">#</b>Title</p>
        <p>Album</p>
        <p className="hidden md:block">Date added</p>
        <img className="m-auto w-4" src={assets.clock_icon} alt="" />
      </div>
      <hr className="border-[#2a2a2a] mb-2" />

      {likedSongs.length === 0 ? (
        <p className="text-[#b3b3b3] text-sm pl-2 mt-6">
          Songs you like will appear here. Tap the heart on a track to save it.
        </p>
      ) : (
        likedSongs.map((item, index) => (
          <div
            key={item.id}
            onClick={() => playWithId(item.id)}
            className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff1a] cursor-pointer rounded group"
          >
            <p className="text-white truncate">
              <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
              <img className="inline w-10 h-10 mr-4 rounded object-cover" src={item.image} alt="" />
              {item.name}
            </p>
            <p className="text-[14px] truncate">{item.album}</p>
            <p className="text-[14px] hidden md:block">Recently added</p>
            <div className="flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="text-[#1DB954]" onClick={() => toggleLike(item.id)}>♥</button>
              <AddToPlaylist songId={item.id} />
              <span className="text-[14px] w-10 text-center">{item.duration}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DisplayLiked;
