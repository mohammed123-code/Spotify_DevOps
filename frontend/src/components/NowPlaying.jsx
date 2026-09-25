import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { useLibrary } from "../context/LibraryContext";
import AddToPlaylist from "./AddToPlaylist";

const lyricLines = (track) => {
  const name = track?.name || "this song";
  return [
    `Hmm nanaanaa`,
    `Naa, naa, nanananaa`,
    name,
  ];
};

const NowPlaying = () => {
  const { track, playStatus, play, pause, setShowNowPlaying } = useContext(PlayerContext);
  const { toggleLike, isLiked } = useLibrary();

  if (!track) {
    return (
      <aside className="hidden xl:flex w-[340px] shrink-0 m-2 ml-0 rounded-lg bg-[#121212] text-[#b3b3b3] items-center justify-center text-sm px-6 text-center">
        Play a song to see it here.
      </aside>
    );
  }

  const liked = isLiked(track.id);

  return (
    <aside className="flex w-[320px] shrink-0 m-2 ml-0 rounded-lg bg-[#121212] text-white flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <p className="font-bold text-sm truncate pr-2">{track.album || "Now playing"}</p>
        <button
          type="button"
          onClick={() => setShowNowPlaying(false)}
          className="w-8 h-8 rounded-full hover:bg-[#2a2a2a] text-[#b3b3b3] text-lg leading-none"
          title="Close"
        >
          ×
        </button>
      </div>

      <div className="px-4 pb-4 overflow-y-auto flex-1">
        <img
          src={track.image}
          alt={track.name}
          className="w-full aspect-square object-cover rounded-md shadow-2xl"
        />

        <div className="flex items-start justify-between gap-3 mt-4">
          <div className="min-w-0">
            <h3 className="text-2xl font-bold truncate">{track.name}</h3>
            <p className="text-[#b3b3b3] text-sm mt-1 truncate">{track.desc}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <button
              type="button"
              onClick={() => toggleLike(track.id)}
              className="text-xl"
              style={{ color: liked ? "#1DB954" : "#b3b3b3" }}
              title={liked ? "Unlike" : "Like"}
            >
              {liked ? "♥" : "♡"}
            </button>
            <AddToPlaylist songId={track.id} />
          </div>
        </div>

        <div
          className="mt-5 rounded-lg p-4"
          style={{ background: "linear-gradient(180deg, #1f6b3a 0%, #163d28 100%)" }}
        >
          <p className="font-bold text-sm mb-3">Lyrics preview</p>
          {lyricLines(track).map((line, i) => (
            <p
              key={i}
              className="text-[22px] font-bold leading-tight mb-1"
              style={{ color: i === 0 ? "#fff" : "rgba(255,255,255,0.55)" }}
            >
              {line}
            </p>
          ))}
        </div>

        <button
          type="button"
          onClick={playStatus ? pause : play}
          className="mt-4 w-full py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-[1.02] transition"
        >
          {playStatus ? "Pause" : "Play"}
        </button>
      </div>
    </aside>
  );
};

export default NowPlaying;
