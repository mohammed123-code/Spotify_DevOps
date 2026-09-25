import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { useLibrary } from "../context/LibraryContext";
import AddToPlaylist from "./AddToPlaylist";
import axios from "axios";

const DisplayAlbum = () => {
  const { id } = useParams();
  const { playWithId } = useContext(PlayerContext);
  const { toggleLike, isLiked } = useLibrary();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [albumData, setAlbumData] = useState(null);
  const [songs, setSongs]         = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/albums/${id}`);
        setAlbumData(res.data.album);
        setSongs(res.data.songs);
      } catch (err) {
        console.error("Failed to fetch album:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 animate-pulse">Loading album...</div>
      </div>
    );
  }

  if (!albumData) {
    return <div className="text-gray-400 mt-10">Album not found.</div>;
  }

  return (
    <>
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img className="w-48 rounded shadow-lg" src={albumData.image} alt={albumData.name} />
        <div className="flex flex-col">
          <p className="text-sm text-gray-400">Playlist</p>
          <h2 className="text-4xl font-bold mb-4 md:text-6xl">{albumData.name}</h2>
          <h4 className="text-gray-400">{albumData.desc}</h4>
          <p className="mt-2 text-sm">
            <img className="inline-block w-5 mr-1" src={assets.spotify_logo} alt="" />
            <b>Spotify Clone</b> · {songs.length} songs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p><b className="mr-4">#</b>Title</p>
        <p>Album</p>
        <p className="hidden md:block">Date Added</p>
        <img className="m-auto w-4" src={assets.clock_icon} alt="" />
      </div>
      <hr className="border-gray-700 mb-2" />

      {songs.length === 0 ? (
        <p className="text-gray-500 text-sm pl-2 mt-4">No songs in this album yet.</p>
      ) : (
        songs.map((item, index) => (
          <div
            onClick={() => playWithId(item.id)}
            key={item.id}
            className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer rounded"
          >
            <p className="text-white">
              <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
              <img className="inline w-10 mr-5 rounded" src={item.image} alt="" />
              {item.name}
            </p>
            <p className="text-[15px]">{albumData.name}</p>
            <p className="text-[15px]">Recently added</p>
            <div className="flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => toggleLike(item.id)}
                style={{ color: isLiked(item.id) ? "#1DB954" : "#b3b3b3" }}
              >
                {isLiked(item.id) ? "♥" : "♡"}
              </button>
              <AddToPlaylist songId={item.id} />
              <p className="text-[15px] text-center w-10">{item.duration}</p>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default DisplayAlbum;