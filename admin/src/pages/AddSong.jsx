import React, { useEffect, useState } from "react";
import api from "../utils/api";

const inputStyle = {
  width: "100%",
  background: "#2a2a2a",
  border: "1px solid #3a3a3a",
  borderRadius: "6px",
  padding: "12px 14px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
};

const labelStyle = {
  color: "#b3b3b3",
  fontSize: "13px",
  fontWeight: "600",
  marginBottom: "8px",
  display: "block",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const AddSong = () => {
  const [name, setName]           = useState("");
  const [desc, setDesc]           = useState("");
  const [album, setAlbum]         = useState("");
  const [albums, setAlbums]       = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [message, setMessage]     = useState({ text: "", type: "" });

  useEffect(() => {
    api.get("/api/albums")
      .then((res) => setAlbums(res.data.albums || []))
      .catch(() => setAlbums([]));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile || !imageFile) {
      setMessage({ text: "Please select both audio and image files!", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("album", album || "None");
      formData.append("audio", audioFile);
      formData.append("image", imageFile);
      await api.post("/api/songs", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage({ text: "Song added successfully!", type: "success" });
      setName(""); setDesc(""); setAlbum("");
      setAudioFile(null); setImageFile(null); setImagePreview(null);
      e.target.reset();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "560px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: 0 }}>Add New Song</h1>
        <p style={{ color: "#b3b3b3", fontSize: "14px", marginTop: "6px" }}>Upload a track to your Spotify Clone library</p>
      </div>

      {/* Alert */}
      {message.text && (
        <div style={{
          padding: "14px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "14px",
          fontWeight: "500",
          background: message.type === "success" ? "#1a3a1a" : "#3a1a1a",
          color: message.type === "success" ? "#1DB954" : "#ff6b6b",
          border: `1px solid ${message.type === "success" ? "#1DB954" : "#ff6b6b"}`,
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Thumbnail Upload */}
        <div>
          <label style={labelStyle}>Song Thumbnail</label>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              onClick={() => document.getElementById("img-input").click()}
              style={{
                width: "100px", height: "100px",
                background: "#2a2a2a",
                borderRadius: "8px",
                border: "2px dashed #3a3a3a",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                flexShrink: 0,
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#1DB954"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#3a3a3a"}
            >
              {imagePreview
                ? <img src={imagePreview} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ textAlign: "center", color: "#555" }}>
                    <div style={{ fontSize: "28px" }}>🖼️</div>
                    <div style={{ fontSize: "10px", marginTop: "4px" }}>Click to upload</div>
                  </div>
              }
            </div>
            <div style={{ color: "#b3b3b3", fontSize: "13px", lineHeight: "1.6" }}>
              <div style={{ color: "#fff", marginBottom: "4px", fontWeight: "600" }}>Upload thumbnail</div>
              Supported: JPG, PNG, WEBP<br />Recommended: 500×500px
            </div>
          </div>
          <input id="img-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
        </div>

        {/* Song Name */}
        <div>
          <label style={labelStyle}>Song Name</label>
          <input
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Aaruyire" required style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#1DB954"}
            onBlur={e => e.target.style.borderColor = "#3a3a3a"}
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="Brief description of the song" required rows={3}
            style={{ ...inputStyle, resize: "none" }}
            onFocus={e => e.target.style.borderColor = "#1DB954"}
            onBlur={e => e.target.style.borderColor = "#3a3a3a"}
          />
        </div>

        {/* Album */}
        <div>
          <label style={labelStyle}>Album <span style={{ color: "#555", textTransform: "none", fontSize: "12px" }}>(optional)</span></label>
          <select
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={(e) => (e.target.style.borderColor = "#1DB954")}
            onBlur={(e) => (e.target.style.borderColor = "#3a3a3a")}
          >
            <option value="">None — not in an album</option>
            {albums.map((a) => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>
          {albums.length === 0 && (
            <p style={{ color: "#555", fontSize: "12px", marginTop: "6px" }}>
              Create an album first if you want to add this song to one.
            </p>
          )}
        </div>

        {/* Audio Upload */}
        <div>
          <label style={labelStyle}>Audio File</label>
          <label style={{
            display: "flex", alignItems: "center", gap: "12px",
            background: "#2a2a2a", border: "1px dashed #3a3a3a",
            borderRadius: "6px", padding: "14px", cursor: "pointer",
            transition: "border-color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#1DB954"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#3a3a3a"}
          >
            <span style={{ fontSize: "24px" }}>🎵</span>
            <div>
              <div style={{ color: audioFile ? "#1DB954" : "#fff", fontSize: "14px", fontWeight: "500" }}>
                {audioFile ? audioFile.name : "Click to select MP3 / WAV / MPEG file"}
              </div>
              <div style={{ color: "#555", fontSize: "12px" }}>Supported: .mp3 .wav .mpeg .ogg .flac — Max: 100MB</div>
            </div>
            <input type="file" accept="audio/*,video/mpeg,video/mp4,.mpeg,.mpg,.mp3,.wav,.ogg,.flac,.aac,.m4a" onChange={e => setAudioFile(e.target.files[0])} style={{ display: "none" }} />
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit" disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#555" : "#1DB954",
            color: loading ? "#aaa" : "#000",
            border: "none", borderRadius: "50px",
            fontSize: "15px", fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            marginTop: "4px",
          }}
          onMouseEnter={e => { if (!loading) e.target.style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}
        >
          {loading ? "Uploading to Cloudinary..." : "Add Song"}
        </button>
      </form>
    </div>
  );
};

export default AddSong;
