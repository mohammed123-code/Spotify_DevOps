import React, { useEffect, useRef, useState } from "react";
import { useLibrary } from "../context/LibraryContext";

const AddToPlaylist = ({ songId }) => {
  const { playlists, addSongToPlaylist, createPlaylist, isSongInPlaylist } = useLibrary();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [added, setAdded] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const add = (playlistId) => {
    addSongToPlaylist(playlistId, songId);
    const pl = playlists.find((p) => p.id === playlistId);
    setAdded(pl?.name || "playlist");
    setTimeout(() => setAdded(""), 1200);
    setOpen(false);
  };

  const makeNew = (e) => {
    e.preventDefault();
    const pl = createPlaylist(name);
    addSongToPlaylist(pl.id, songId);
    setName("");
    setAdded(pl.name);
    setTimeout(() => setAdded(""), 1200);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="w-8 h-8 rounded-full border border-[#535353] text-[#b3b3b3] text-lg leading-none hover:border-white hover:text-white"
        title="Add to playlist"
      >
        {added ? "✓" : "+"}
      </button>
      {open && (
        <div
          className="absolute z-50 right-0 mt-2 w-56 bg-[#282828] rounded-md shadow-2xl p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs text-[#b3b3b3] px-2 py-1">Add to playlist</p>
          {playlists.length === 0 && (
            <p className="text-xs text-[#535353] px-2 py-1">No playlists yet — create one below</p>
          )}
          <div className="max-h-40 overflow-y-auto">
            {playlists.map((p) => {
              const inPl = isSongInPlaylist(p.id, songId);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => add(p.id)}
                  className="w-full text-left px-2 py-2 text-sm text-white rounded hover:bg-[#3e3e3e] truncate flex justify-between gap-2"
                >
                  <span className="truncate">{p.name}</span>
                  {inPl && <span className="text-[#1DB954] text-xs shrink-0">Added</span>}
                </button>
              );
            })}
          </div>
          <form onSubmit={makeNew} className="mt-1 pt-2 border-t border-[#3e3e3e] px-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New playlist name"
              className="w-full bg-[#121212] text-white text-xs rounded px-2 py-1.5 outline-none mb-1"
            />
            <button
              type="submit"
              className="w-full text-xs font-bold py-1.5 rounded-full bg-white text-black"
            >
              Create and add
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddToPlaylist;
