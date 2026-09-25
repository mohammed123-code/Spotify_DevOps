import React, { useEffect, useState } from "react";
import api from "../utils/api";

const ListSongs = () => {
  const [songs, setSongs]     = useState([]);
  const [albums, setAlbums]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const fetchData = async () => {
    try {
      const [songsRes, albumsRes] = await Promise.all([
        api.get("/api/songs"),
        api.get("/api/albums"),
      ]);
      setSongs(songsRes.data.songs || []);
      setAlbums(albumsRes.data.albums || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const assignAlbum = async (songId, albumName) => {
    setSavingId(songId);
    try {
      await api.put(`/api/songs/${songId}`, { album: albumName || "None" });
      setSongs((prev) =>
        prev.map((s) => (s.id === songId ? { ...s, album: albumName || "None" } : s))
      );
    } catch {
      alert("Failed to update album");
    } finally {
      setSavingId(null);
    }
  };

  const deleteSong = async (id) => {
    if (!window.confirm("Delete this song?")) return;
    try {
      await api.delete(`/api/songs/${id}`);
      setSongs((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#b3b3b3", fontSize: "16px" }}>
      Loading songs...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: 0 }}>Songs Library</h1>
          <p style={{ color: "#b3b3b3", fontSize: "14px", marginTop: "6px" }}>{songs.length} tracks — assign each song to an album from the dropdown</p>
        </div>
      </div>

      {songs.length === 0 ? (
        <div style={{
          background: "#181818", borderRadius: "12px",
          padding: "80px", textAlign: "center",
          color: "#555"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎵</div>
          <div style={{ fontSize: "18px", fontWeight: "600", color: "#b3b3b3", marginBottom: "8px" }}>No songs yet</div>
          <div style={{ fontSize: "14px" }}>Add your first song using the Add Song page</div>
        </div>
      ) : (
        <div style={{ background: "#181818", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "40px 50px 1fr 220px 80px 50px",
            gap: "16px", padding: "12px 20px",
            borderBottom: "1px solid #282828",
            color: "#b3b3b3", fontSize: "12px", fontWeight: "600",
            textTransform: "uppercase", letterSpacing: "0.1em"
          }}>
            <span>#</span>
            <span></span>
            <span>Title</span>
            <span>Album</span>
            <span>Duration</span>
            <span></span>
          </div>

          {songs.map((song, i) => (
            <div
              key={song.id}
              style={{
                display: "grid",
                gridTemplateColumns: "40px 50px 1fr 220px 80px 50px",
                gap: "16px", padding: "10px 20px",
                borderBottom: "1px solid #282828",
                alignItems: "center",
                transition: "background 0.15s",
                cursor: "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#282828")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ color: "#b3b3b3", fontSize: "14px" }}>{i + 1}</span>
              <img src={song.image} alt={song.name} style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "4px" }} />
              <div style={{ overflow: "hidden" }}>
                <div style={{ color: "#fff", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.name}</div>
                <div style={{ color: "#b3b3b3", fontSize: "12px", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.desc}</div>
              </div>
              <select
                value={song.album && song.album !== "None" ? song.album : ""}
                disabled={savingId === song.id}
                onChange={(e) => assignAlbum(song.id, e.target.value)}
                style={{
                  background: "#2a2a2a",
                  color: "#fff",
                  border: "1px solid #3a3a3a",
                  borderRadius: "6px",
                  padding: "8px 10px",
                  fontSize: "13px",
                  outline: "none",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <option value="">None</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.name}>{a.name}</option>
                ))}
              </select>
              <span style={{ color: "#b3b3b3", fontSize: "13px" }}>{song.duration}</span>
              <button
                onClick={() => deleteSong(song.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#b3b3b3", fontSize: "16px", padding: "4px 8px",
                  borderRadius: "4px", transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ff4444")}
                onMouseLeave={(e) => (e.target.style.color = "#b3b3b3")}
                title="Delete song"
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListSongs;
