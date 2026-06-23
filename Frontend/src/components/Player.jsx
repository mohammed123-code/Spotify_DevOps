import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const Player = () => {
  const { 
    seekBar, 
    seekBg, 
    play, 
    pause, 
    playStatus, 
    track, 
    time, 
    before, 
    after, 
    seekBgClick,
    volume,
    isShuffle,
    isRepeat,
    setIsShuffle,
    setIsRepeat,
    handleVolumeChange
  } = useContext(PlayerContext);

  // Helper to format digits
  const formatTime = (timeObj) => {
    if (!timeObj) return "0:00";
    const min = timeObj.minute !== undefined ? timeObj.minute : 0;
    const sec = timeObj.second !== undefined ? timeObj.second : 0;
    return `${min}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="h-[10%] bg-[#121212] border-t border-neutral-900 flex justify-between items-center text-white px-4">
      {/* Current Song Details */}
      <div className="hidden lg:flex items-center gap-4 min-w-[200px]">
        <img 
          className="w-12 h-12 object-cover rounded shadow" 
          src={track?.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100'} 
          alt="" 
        />
        <div className="max-w-[150px]">
          <p className="font-semibold text-sm truncate">{track?.name || 'No song selected'}</p>
          <p className="text-xs text-neutral-400 truncate">{track?.artist || track?.desc || 'Unknown'}</p>
        </div>
      </div>

      {/* Media Playback Controls */}
      <div className="flex flex-col items-center gap-1 m-auto flex-grow max-w-[600px]">
        <div className="flex gap-6 items-center">
          {/* Shuffle Toggle */}
          <button 
            onClick={() => setIsShuffle(!isShuffle)}
            className={`transition ${isShuffle ? 'text-[#1DB954] scale-110' : 'text-neutral-400 hover:text-white'}`}
            title="Shuffle"
          >
            <img className="w-4 h-4 invert-[0.6] sepia-0" style={isShuffle ? { filter: 'invert(52%) sepia(87%) saturate(518%) hue-rotate(87deg) brightness(97%) contrast(89%)' } : {}} src={assets.shuffle_icon} alt="" />
          </button>
          
          <button onClick={before} className="text-neutral-400 hover:text-white transition">
            <img className="w-4" src={assets.prev_icon} alt="Prev" />
          </button>
          
          {playStatus ? (
            <button 
              onClick={pause} 
              className="bg-white text-black p-2 rounded-full hover:scale-105 transition"
            >
              <img className="w-4 h-4 invert" src={assets.pause_icon} alt="Pause" />
            </button>
          ) : (
            <button 
              onClick={play} 
              className="bg-white text-black p-2 rounded-full hover:scale-105 transition"
            >
              <img className="w-4 h-4 invert" src={assets.play_icon} alt="Play" />
            </button>
          )}

          <button onClick={after} className="text-neutral-400 hover:text-white transition">
            <img className="w-4" src={assets.next_icon} alt="Next" />
          </button>

          {/* Repeat Toggle */}
          <button 
            onClick={() => setIsRepeat(!isRepeat)}
            className={`transition ${isRepeat ? 'text-[#1DB954] scale-110' : 'text-neutral-400 hover:text-white'}`}
            title="Repeat"
          >
            <img className="w-4 h-4 invert-[0.6] sepia-0" style={isRepeat ? { filter: 'invert(52%) sepia(87%) saturate(518%) hue-rotate(87deg) brightness(97%) contrast(89%)' } : {}} src={assets.loop_icon} alt="" />
          </button>
        </div>

        {/* Progress seek bar */}
        <div className="flex items-center gap-3 w-full justify-center">
          <p className="text-xs text-neutral-400 w-10 text-right">{formatTime(time.currentTime)}</p>
          <div
            ref={seekBg} 
            onClick={seekBgClick}
            className="w-[60vw] max-w-[500px] bg-neutral-700 h-1 rounded-full cursor-pointer hover:h-1.5 transition-all relative group"
          >
            <div
              ref={seekBar}
              className="h-full border-none w-0 bg-[#1DB954] rounded-full absolute left-0 top-0"
            />
          </div>
          <p className="text-xs text-neutral-400 w-10 text-left">{formatTime(time.totalTime)}</p>
        </div>
      </div>

      {/* Side utility controls (Volume, queue) */}
      <div className="hidden lg:flex items-center gap-3 opacity-80 min-w-[200px] justify-end">
        <img className="w-4 cursor-pointer hover:opacity-100" src={assets.plays_icon} alt="Plays" />
        <img className="w-4 cursor-pointer hover:opacity-100" src={assets.mic_icon} alt="Lyrics" />
        <img className="w-4 cursor-pointer hover:opacity-100" src={assets.queue_icon} alt="Queue" />
        <img className="w-4 cursor-pointer hover:opacity-100" src={assets.speaker_icon} alt="Speaker" />
        
        {/* Volume Slider */}
        <div className="flex items-center gap-2 group">
          <img className="w-4 cursor-pointer" src={assets.volume_icon} alt="Volume" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => handleVolumeChange(e.target.value)}
            className="w-20 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#1DB954]" 
          />
        </div>
        
        <img className="w-4 cursor-pointer hover:opacity-100" src={assets.mini_player_icon} alt="Mini Player" />
        <img className="w-4 cursor-pointer hover:opacity-100" src={assets.zoom_icon} alt="Fullscreen" />
      </div>
    </div>
  );
};

export default Player;
