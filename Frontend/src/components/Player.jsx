import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { useLibrary } from "../context/LibraryContext";
import AddToPlaylist from "./AddToPlaylist";

const Player = () => {
  const {
    seekBar, seekBg, play, pause,
    playStatus, track, time,
    after, before, seekBgClick, audioRef,
    showNowPlaying, setShowNowPlaying,
  } = useContext(PlayerContext);
  const { toggleLike, isLiked } = useLibrary();

  if (!track) return null;

  const liked = isLiked(track.id);

  return (
    <div className="h-[88px] bg-black flex justify-between items-center text-white px-4 shrink-0">
      <div className="hidden lg:flex items-center gap-4 min-w-[240px] max-w-[30%]">
        <img
          className="w-14 h-14 rounded cursor-pointer object-cover"
          src={track.image}
          alt={track.name}
          onClick={() => setShowNowPlaying((v) => !v)}
          title="Now playing view"
        />
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{track.name}</p>
          <p className="text-gray-400 text-xs truncate">{track.desc}</p>
        </div>
        <button
          type="button"
          onClick={() => toggleLike(track.id)}
          className="text-lg shrink-0"
          style={{ color: liked ? "#1DB954" : "#b3b3b3" }}
        >
          {liked ? "♥" : "♡"}
        </button>
        <AddToPlaylist songId={track.id} />
      </div>

      <div className="flex flex-col items-center gap-1 flex-1">
        <div className="flex gap-5 items-center">
          <img className="w-4 cursor-pointer opacity-70 hover:opacity-100" src={assets.shuffle_icon} alt="" />
          <img onClick={before} className="w-4 cursor-pointer opacity-70 hover:opacity-100" src={assets.prev_icon} alt="" />
          <button
            type="button"
            onClick={playStatus ? pause : play}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105"
          >
            <img className="w-3.5 invert" src={playStatus ? assets.pause_icon : assets.play_icon} alt="" />
          </button>
          <img onClick={after} className="w-4 cursor-pointer opacity-70 hover:opacity-100" src={assets.next_icon} alt="" />
          <img className="w-4 cursor-pointer opacity-70 hover:opacity-100" src={assets.loop_icon} alt="" />
        </div>

        <div className="flex items-center gap-3 w-full max-w-[560px]">
          <p className="text-[11px] text-gray-400 w-10 text-right">
            {time.currentTime.minute}:{time.currentTime.second}
          </p>
          <div
            ref={seekBg}
            onClick={seekBgClick}
            className="flex-1 bg-[#4d4d4d] rounded-full cursor-pointer h-1 group"
          >
            <div ref={seekBar} className="h-1 border-none w-0 bg-white group-hover:bg-green-500 rounded-full" />
          </div>
          <p className="text-[11px] text-gray-400 w-10">
            {time.totalTime.minute}:{time.totalTime.second}
          </p>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3 opacity-80 min-w-[180px] justify-end">
        <img
          className="w-4 cursor-pointer hover:opacity-100"
          src={assets.plays_icon}
          alt="now playing"
          title="Now playing view"
          onClick={() => setShowNowPlaying((v) => !v)}
          style={{ opacity: showNowPlaying ? 1 : 0.6, filter: showNowPlaying ? "none" : undefined }}
        />
        <img className="w-4" src={assets.mic_icon} alt="" />
        <img className="w-4" src={assets.queue_icon} alt="" />
        <img className="w-4" src={assets.speaker_icon} alt="" />
        <img className="w-4" src={assets.volume_icon} alt="" />
        <div className="w-20 bg-[#4d4d4d] h-1 rounded overflow-hidden">
          <div className="w-2/3 h-full bg-white rounded" />
        </div>
        <img className="w-4" src={assets.mini_player_icon} alt="" />
        <img className="w-4" src={assets.zoom_icon} alt="" />
      </div>

      <audio ref={audioRef} src={track.file} preload="auto" />
    </div>
  );
};

export default Player;
