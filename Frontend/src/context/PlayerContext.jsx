import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

export const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  // Convert the local static songsData to the standard player track format
  const initialLocalQueue = songsData.map((item) => ({
    id: String(item.id),
    name: item.name,
    artist: "Local Artist",
    file: item.file,
    image: item.image,
    duration: 30 // Mock or local tracks length
  }));

  // Player state
  const [currentQueue, setCurrentQueue] = useState(initialLocalQueue);
  const [queueIndex, setQueueIndex] = useState(0);
  const [track, setTrack] = useState(initialLocalQueue[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  // Track state synchronization
  useEffect(() => {
    if (currentQueue.length > 0 && queueIndex >= 0 && queueIndex < currentQueue.length) {
      setTrack(currentQueue[queueIndex]);
    }
  }, [currentQueue, queueIndex]);

  // Audio loading logic when track changes
  useEffect(() => {
    if (audioRef.current && track) {
      const wasPlaying = playStatus;
      
      // Load track source
      audioRef.current.src = track.file || "";
      audioRef.current.load();
      audioRef.current.volume = volume;

      if (wasPlaying && track.file) {
        audioRef.current.play().catch(err => {
          console.error("Playback failed:", err.message);
          setPlayStatus(false);
        });
      }
    }
  }, [track]);

  // Sync ontimeupdate & onended handler
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = () => {
        if (!audioRef.current) return;
        const current = audioRef.current.currentTime || 0;
        const duration = audioRef.current.duration || 0;
        
        if (seekBar.current) {
          seekBar.current.style.width = (duration > 0 ? (current / duration) * 100 : 0) + "%";
        }

        setTime({
          currentTime: {
            second: Math.floor(current % 60),
            minute: Math.floor(current / 60),
          },
          totalTime: {
            second: isNaN(duration) ? 0 : Math.floor(duration % 60),
            minute: isNaN(duration) ? 0 : Math.floor(duration / 60),
          },
        });
      };

      // Automatical play of next song
      audioRef.current.onended = () => {
        if (isRepeat) {
          // Play same track again
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.error(e));
        } else {
          after();
        }
      };
    }
  }, [currentQueue, queueIndex, isShuffle, isRepeat]);

  const play = () => {
    if (!track?.file) {
      alert("No audio preview available for this track.");
      return;
    }
    audioRef.current.play().then(() => {
      setPlayStatus(true);
    }).catch(err => {
      console.error("Audio playback error:", err);
    });
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  // Play a specific list of tracks (Queue)
  const playTrackFromQueue = (newQueue, index) => {
    setCurrentQueue(newQueue);
    setQueueIndex(index);
    setPlayStatus(true);
  };

  // Skip backwards
  const before = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * currentQueue.length);
      setQueueIndex(randomIndex);
    } else if (queueIndex > 0) {
      setQueueIndex(prev => prev - 1);
    } else {
      // Loop back to end
      setQueueIndex(currentQueue.length - 1);
    }
    setPlayStatus(true);
  };

  // Skip forwards
  const after = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * currentQueue.length);
      setQueueIndex(randomIndex);
    } else if (queueIndex < currentQueue.length - 1) {
      setQueueIndex(prev => prev + 1);
    } else {
      // Loop back to start
      setQueueIndex(0);
    }
    setPlayStatus(true);
  };

  // Seek audio position
  const seekBgClick = (e) => {
    if (audioRef.current && audioRef.current.duration) {
      const clickX = e.nativeEvent.offsetX;
      const width = seekBg.current.offsetWidth;
      audioRef.current.currentTime = (clickX / width) * audioRef.current.duration;
    }
  };

  // Volume slider controls
  const handleVolumeChange = (volValue) => {
    const parsedVol = Math.max(0, Math.min(1, parseFloat(volValue)));
    setVolume(parsedVol);
    if (audioRef.current) {
      audioRef.current.volume = parsedVol;
    }
  };

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    playStatus,
    time,
    volume,
    isShuffle,
    isRepeat,
    setTrack,
    setPlayStatus,
    setIsShuffle,
    setIsRepeat,
    play,
    pause,
    playTrackFromQueue,
    before,
    after,
    seekBgClick,
    handleVolumeChange,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
