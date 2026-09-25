import React, { useEffect, useState } from "react";
import api from "../utils/api";

const ListAlbums = () => {
  const [albums, setAlbums]   = useState([]);
  const [songs, setSongs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId]   = useState(null);
  const [busy, setBusy]       = useState(false);

  const fetchData = async () => {
    try {
      const [albumsRes, songsRes] = await Promise.all([
        api.get("/api/albums"),
        api.get("/api/songs"),
      ]);
      setAlbums(albumsRes.data.albums || []);
      setSongs(songsRes.data.songs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAlbum = async (id) => {
    if (!window.confirm("Delete this album? Songs will be set to 'None'.")) return;
    try {
      await api.delete(`/api/albums/${id}`);
      setAlbums((prev) => prev.filter((a) => a.id !== id));
      setSongs((prev) =>
        prev.map((s) => {
          const album = albums.find((a) => a.id === id);
          return album && s.album === album.name ? { ...s, album: "None" } : s;
        })
      );
    } catch {
      alert("Failed to delete album");
    }
  };

  const addSong = async (album, songId) => {
    setBusy(true);
    try {
      await api.post(`/api/albums/${album.id}/songs`, { songId });
      setSongs((prev) =>
        prev.map((s) => (s.id === Number(songId) ? { ...s, album: album.name } : s))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add song");
    } finally {
      setBusy(false);
    }
  };

  const removeSong = async (album, songId) => {
    setBusy(true);
    try {
      await api.delete(`/api/albums/${album.id}/songs/${songId}`);
      setSongs((prev) =>
        prev.map((s) => (s.id === songId ? { ...s, album: "None" } : s))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove song");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#b3b3b3", fontSize: "16px" }}>
      Loading albums...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: 0 }}>Albums</h1>
        <p style={{ color: "#b3b3b3", fontSize: "14px", marginTop: "6px" }}>
          {albums.length} albums — open an album to add or remove songs
        </p>
      </div>

      {albums.length === 0 ? (
        <div style={{
          background: "#181818", borderRadius: "12px",
          padding: "80px", textAlign: "center", color: "#555"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💿</div>
          <div style={{ fontSize: "18px", fontWeight: "600", color: "#b3b3b3", marginBottom: "8px" }}>No albums yet</div>
          <div style={{ fontSize: "14px" }}>Create your first album using the Add Album page</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {albums.map((album) => {
            const albumSongs = songs.filter((s) => s.album === album.name);
            const available = songs.filter((s) => s.album !== album.name);
            const isOpen = openId === album.id;
            return (
              <div
                key={album.id}
                style={{ background: "#181818", borderRadius: "12px", overflow: "hidden" }}
              >
                <div style={{ display: "flex", gap: "16px", padding: "16px", alignItems: "center" }}>
                  <img
                    src={album.image}
                    alt={album.name}
                    style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{album.name}</div>
                    <div style={{ color: "#b3b3b3", fontSize: 13, marginTop: 4 }}>{album.desc}</div>
                    <div style={{ color: "#555", fontSize: 12, marginTop: 6 }}>{albumSongs.length} songs</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : album.id)}
                    style={{
                      background: "#1DB954", color: "#000", border: "none",
                      borderRadius: 50, padding: "10px 16px", fontWeight: 700,
                      fontSize: 13, cursor: "pointer",
                    }}
                  >
                    {isOpen ? "Close" : "Manage songs"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAlbum(album.id)}
                    style={{
                      background: "none", border: "1px solid #3a3a3a", color: "#b3b3b3",
                      borderRadius: 50, padding: "10px 14px", cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>

                {isOpen && (
                  <div style={{ padding: "0 16px 20px", borderTop: "1px solid #282828" }}>
                    <p style={{ color: "#fff", fontWeight: 600, margin: "16px 0 8px" }}>Songs in this album</p>
                    {albumSongs.length === 0 ? (
                      <p style={{ color: "#555", fontSize: 13 }}>No songs yet. Add from the list below.</p>
                    ) : (
                      albumSongs.map((s) => (
                        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                          <img src={s.image} alt="" style={{ width: 40, height: 40, borderRadius: 4, objectFit: "cover" }} />
                          <div style={{ flex: 1, color: "#fff", fontSize: 14 }}>{s.name}</div>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => removeSong(album, s.id)}
                            style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer", fontSize: 13 }}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}

                    <p style={{ color: "#fff", fontWeight: 600, margin: "20px 0 8px" }}>Add existing songs</p>
                    {available.length === 0 ? (
                      <p style={{ color: "#555", fontSize: 13 }}>All songs are already in this album.</p>
                    ) : (
                      available.map((s) => (
                        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                          <img src={s.image} alt="" style={{ width: 40, height: 40, borderRadius: 4, objectFit: "cover" }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ color: "#fff", fontSize: 14 }}>{s.name}</div>
                            <div style={{ color: "#555", fontSize: 12 }}>{s.album}</div>
                          </div>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => addSong(album, s.id)}
                            style={{
                              background: "transparent",
                              border: "1px solid #535353",
                              color: "#fff",
                              borderRadius: 50,
                              padding: "6px 14px",
                              cursor: "pointer",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            Add
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListAlbums;
