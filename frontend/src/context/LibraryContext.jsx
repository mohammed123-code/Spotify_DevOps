import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PlayerContext } from "./PlayerContext";
import { useAuth } from "./AuthContext";

export const LibraryContext = createContext();

const storageKey = (email) => `spotify_library_${email || "guest"}`;

const emptyLibrary = () => ({
  likedIds: [],
  playlists: [],
});

const LibraryContextProvider = ({ children }) => {
  const { user } = useAuth();
  const { songsData } = useContext(PlayerContext);
  const [likedIds, setLikedIds] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(user?.email));
      if (!raw) {
        setLikedIds([]);
        setPlaylists([]);
        return;
      }
      const parsed = JSON.parse(raw);
      setLikedIds(Array.isArray(parsed.likedIds) ? parsed.likedIds : []);
      setPlaylists(Array.isArray(parsed.playlists) ? parsed.playlists : []);
    } catch {
      setLikedIds([]);
      setPlaylists([]);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email) return;
    localStorage.setItem(
      storageKey(user.email),
      JSON.stringify({ likedIds, playlists })
    );
  }, [likedIds, playlists, user?.email]);

  const isLiked = (id) => likedIds.includes(id);

  const toggleLike = (id) => {
    if (id == null) return;
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]
    );
  };

  const likedSongs = useMemo(
    () => likedIds.map((id) => songsData.find((s) => s.id === id)).filter(Boolean),
    [likedIds, songsData]
  );

  const createPlaylist = (name) => {
    const trimmed = (name || "").trim() || `My Playlist #${playlists.length + 1}`;
    const playlist = {
      id: `pl_${Date.now()}`,
      name: trimmed,
      songIds: [],
      createdAt: new Date().toISOString(),
    };
    setPlaylists((prev) => [playlist, ...prev]);
    return playlist;
  };

  const renamePlaylist = (id, name) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return;
    setPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p))
    );
  };

  const deletePlaylist = (id) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  };

  const addSongToPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId || p.songIds.includes(songId)) return p;
        return { ...p, songIds: [...p.songIds, songId] };
      })
    );
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, songIds: p.songIds.filter((id) => id !== songId) }
          : p
      )
    );
  };

  const isSongInPlaylist = (playlistId, songId) => {
    const pl = playlists.find((p) => p.id === playlistId);
    return Boolean(pl?.songIds?.includes(songId));
  };

  const getPlaylistSongs = (playlist) =>
    (playlist?.songIds || [])
      .map((id) => songsData.find((s) => s.id === id))
      .filter(Boolean);

  const playlistCover = (playlist) => {
    const first = getPlaylistSongs(playlist)[0];
    return first?.image || null;
  };

  return (
    <LibraryContext.Provider
      value={{
        likedIds,
        likedSongs,
        isLiked,
        toggleLike,
        playlists,
        createPlaylist,
        renamePlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        isSongInPlaylist,
        getPlaylistSongs,
        playlistCover,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);

export default LibraryContextProvider;
