import React, { useContext, useMemo, useState } from "react";
import AlbumItems from "./AlbumItems";
import SongItems from "./SongItems";
import { PlayerContext } from "../context/PlayerContext";

const chips = ["All", "Music", "Podcasts"];

const DisplayHome = () => {
  const { songsData, albumsData, loading, error, searchQuery } = useContext(PlayerContext);
  const [chip, setChip] = useState("All");

  const q = searchQuery.trim().toLowerCase();

  const albums = useMemo(() => {
    if (!q) return albumsData;
    return albumsData.filter(
      (a) => a.name.toLowerCase().includes(q) || a.desc?.toLowerCase().includes(q)
    );
  }, [albumsData, q]);

  const songs = useMemo(() => {
    if (!q) return songsData;
    return songsData.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.desc?.toLowerCase().includes(q) ||
        s.album?.toLowerCase().includes(q)
    );
  }, [songsData, q]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-lg animate-pulse">Loading music...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-6 sticky top-0 bg-[#121212] py-1 z-10">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChip(c)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              background: chip === c ? "#fff" : "#2a2a2a",
              color: chip === c ? "#000" : "#fff",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {chip === "Podcasts" ? (
        <p className="text-[#b3b3b3] text-sm mt-8">No podcasts yet.</p>
      ) : (
        <>
          {q && (
            <p className="text-[#b3b3b3] text-sm mb-4">
              Results for &quot;{searchQuery}&quot;
            </p>
          )}

          <div className="mb-8">
            <div className="flex items-end justify-between mb-4">
              <h1 className="font-bold text-2xl">{q ? "Albums" : "Featured Albums"}</h1>
              {!q && albums.length > 0 && (
                <span className="text-sm font-bold text-[#b3b3b3] hover:underline cursor-pointer">
                  Show all
                </span>
              )}
            </div>
            {albums.length === 0 ? (
              <p className="text-gray-500 text-sm">No albums found.</p>
            ) : (
              <div className="flex overflow-auto gap-2 pb-2">
                {albums.map((item) => (
                  <AlbumItems
                    key={item.id}
                    name={item.name}
                    desc={item.desc}
                    id={item.id}
                    image={item.image}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-end justify-between mb-4">
              <h1 className="font-bold text-2xl">{q ? "Songs" : "Recently Added"}</h1>
            </div>
            {songs.length === 0 ? (
              <p className="text-gray-500 text-sm">No songs found.</p>
            ) : (
              <div className="flex overflow-auto gap-2 pb-2">
                {songs.map((item) => (
                  <SongItems
                    key={item.id}
                    name={item.name}
                    desc={item.desc}
                    id={item.id}
                    image={item.image}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default DisplayHome;
