import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg   = useRef();
  const seekBar  = useRef();

  const [songsData, setSongsData]   = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [track, setTrack]           = useState(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [showNowPlaying, setShowNowPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [time, setTime] = useState({
    currentTime: { second: "00", minute: "00" },
    totalTime:   { second: "00", minute: "00" },
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Fetch songs & albums from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        const [songsRes, albumsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/songs`),
          axios.get(`${backendUrl}/api/albums`),
        ]);
        setSongsData(songsRes.data.songs || []);
        setAlbumsData(albumsRes.data.albums || []);
        if (songsRes.data.songs?.length > 0) {
          setTrack(songsRes.data.songs[0]);
        }
      } catch (err) {
        console.error("Failed to fetch data from API:", err.message);
        setError("Could not load music. Make sure the backend is running on port 4000.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Seek bar time update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!audio.duration) return;
      seekBar.current.style.width =
        (audio.currentTime / audio.duration) * 100 + "%";
      setTime({
        currentTime: {
          minute: String(Math.floor(audio.currentTime / 60)).padStart(2, "0"),
          second: String(Math.floor(audio.currentTime % 60)).padStart(2, "0"),
        },
        totalTime: {
          minute: String(Math.floor(audio.duration / 60)).padStart(2, "0"),
          second: String(Math.floor(audio.duration % 60)).padStart(2, "0"),
        },
      });
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [track]);

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = async (id) => {
    const song = songsData.find((s) => s.id === id);
    if (!song) return;
    setTrack(song);
    setShowNowPlaying(true);
    await audioRef.current.play();
    setPlayStatus(true);
  };

  const before = async () => {
    const idx = songsData.findIndex((s) => s.id === track.id);
    if (idx > 0) {
      setTrack(songsData[idx - 1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const after = async () => {
    const idx = songsData.findIndex((s) => s.id === track.id);
    if (idx < songsData.length - 1) {
      setTrack(songsData[idx + 1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const seekBgClick = (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;
  };

  const contextValue = {
    audioRef, seekBg, seekBar,
    track, setTrack,
    playStatus, setPlayStatus,
    time, setTime,
    songsData, albumsData,
    loading, error,
    showNowPlaying, setShowNowPlaying,
    searchQuery, setSearchQuery,
    play, pause, playWithId, before, after, seekBgClick,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
