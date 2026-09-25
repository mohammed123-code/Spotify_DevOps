import React, { useContext, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import AddToPlaylist from "./AddToPlaylist";

const DisplayPlaylist = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { playWithId, songsData } = useContext(PlayerContext);
  const {
    playlists,
    getPlaylistSongs,
    playlistCover,
    removeSongFromPlaylist,
    deletePlaylist,
    addSongToPlaylist,
  } = useLibrary();
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const playlist = playlists.find((p) => p.id === id);
  const songs = getPlaylistSongs(playlist);
  const cover = playlistCover(playlist);

  const available = useMemo(() => {
    const notIn = songsData.filter((s) => !playlist?.songIds?.includes(s.id));
    const q = query.trim().toLowerCase();
    if (!q) return notIn;
    return notIn.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.album?.toLowerCase().includes(q) ||
        s.desc?.toLowerCase().includes(q)
    );
  }, [songsData, playlist, query]);

  if (!playlist) {
    return <p className="text-[#b3b3b3] mt-10">Playlist not found.</p>;
  }

  return (
    <div>
      <div className="mt-6 flex gap-6 flex-col md:flex-row md:items-end">
        {cover ? (
          <img className="w-48 h-48 rounded shadow-2xl object-cover" src={cover} alt={playlist.name} />
        ) : (
          <div className="w-48 h-48 rounded shadow-2xl bg-[#282828] flex items-center justify-center text-5xl text-[#b3b3b3]">
            ♫
          </div>
        )}
        <div>
          <p className="text-sm text-white font-semibold">Playlist</p>
          <h2 className="text-4xl md:text-6xl font-black mb-4">{playlist.name}</h2>
          <p className="text-sm text-[#b3b3b3]">
            <b className="text-white">{user?.name || "You"}</b> · {songs.length} songs
          </p>
          <button
            type="button"
            onClick={() => {
              deletePlaylist(playlist.id);
              nav("/");
            }}
            className="mt-3 text-xs text-[#b3b3b3] hover:text-white underline"
          >
            Delete playlist
          </button>
        </div>
      </div>

      {songs.length > 0 && (
        <button
          type="button"
          onClick={() => playWithId(songs[0].id)}
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

      {songs.length === 0 ? (
        <p className="text-[#b3b3b3] text-sm pl-2 mt-6">
          This playlist is empty. Search below to add songs, or use + on any track.
        </p>
      ) : (
        songs.map((item, index) => (
          <div
            key={item.id}
            onClick={() => playWithId(item.id)}
            className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff1a] cursor-pointer rounded"
          >
            <p className="text-white truncate">
              <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
              <img className="inline w-10 h-10 mr-4 rounded object-cover" src={item.image} alt="" />
              {item.name}
            </p>
            <p className="text-[14px] truncate">{item.album}</p>
            <p className="text-[14px] hidden md:block">Recently added</p>
            <div className="flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              <AddToPlaylist songId={item.id} />
              <button
                type="button"
                className="text-xs text-[#b3b3b3] hover:text-white"
                onClick={() => removeSongFromPlaylist(playlist.id, item.id)}
              >
                Remove
              </button>
              <span className="text-[14px] w-10 text-center">{item.duration}</span>
            </div>
          </div>
        ))
      )}

      <div className="mt-10 mb-16">
        <h3 className="text-xl font-bold mb-2">Add songs</h3>
        <p className="text-[#b3b3b3] text-sm mb-4">Search your library and add tracks to this playlist.</p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs by name or album"
          className="w-full max-w-md bg-[#242424] text-white rounded-full px-4 py-2.5 outline-none mb-4"
        />
        {available.length === 0 ? (
          <p className="text-[#535353] text-sm">
            {query ? "No matching songs left to add." : "Every song in your library is already in this playlist."}
          </p>
        ) : (
          available.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-[#ffffff1a]"
            >
              <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{item.name}</p>
                <p className="text-[#b3b3b3] text-xs truncate">{item.album}</p>
              </div>
              <button
                type="button"
                onClick={() => addSongToPlaylist(playlist.id, item.id)}
                className="text-xs font-bold px-3 py-1 rounded-full border border-[#535353] hover:border-white"
              >
                Add
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DisplayPlaylist;
