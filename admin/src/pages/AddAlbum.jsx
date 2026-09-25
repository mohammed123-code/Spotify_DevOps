import React, { useState } from "react";
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

const AddAlbum = () => {
  const [name, setName]           = useState("");
  const [desc, setDesc]           = useState("");
  const [bgColor, setBgColor]     = useState("#1DB954");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [message, setMessage]     = useState({ text: "", type: "" });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setMessage({ text: "Please select a cover image!", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("bgColor", bgColor);
      formData.append("image", imageFile);
      await api.post("/api/albums", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage({ text: "Album created successfully!", type: "success" });
      setName(""); setDesc(""); setBgColor("#1DB954");
      setImageFile(null); setImagePreview(null);
      e.target.reset();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "560px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: 0 }}>Add New Album</h1>
        <p style={{ color: "#b3b3b3", fontSize: "14px", marginTop: "6px" }}>Create a playlist or album for your songs</p>
      </div>

      {message.text && (
        <div style={{
          padding: "14px 16px", borderRadius: "8px", marginBottom: "20px",
          fontSize: "14px", fontWeight: "500",
          background: message.type === "success" ? "#1a3a1a" : "#3a1a1a",
          color: message.type === "success" ? "#1DB954" : "#ff6b6b",
          border: `1px solid ${message.type === "success" ? "#1DB954" : "#ff6b6b"}`,
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Cover Upload with live color preview */}
        <div>
          <label style={labelStyle}>Album Cover</label>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            <div
              onClick={() => document.getElementById("cover-input").click()}
              style={{
                width: "120px", height: "120px",
                background: imagePreview ? "transparent" : bgColor + "22",
                borderRadius: "8px",
                border: `2px dashed ${bgColor}55`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", overflow: "hidden", flexShrink: 0,
                boxShadow: imagePreview ? `0 8px 24px ${bgColor}44` : "none",
                transition: "all 0.3s",
              }}
            >
              {imagePreview
                ? <img src={imagePreview} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ textAlign: "center", color: bgColor }}>
                    <div style={{ fontSize: "32px" }}>💿</div>
                    <div style={{ fontSize: "10px", marginTop: "4px" }}>Upload cover</div>
                  </div>
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Cover Image</div>
              <div style={{ color: "#b3b3b3", fontSize: "13px", marginBottom: "12px" }}>Recommended: 500×500px<br />JPG, PNG, WEBP supported</div>
              {/* Color Picker */}
              <div>
                <div style={{ color: "#b3b3b3", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>Background Color</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                    style={{ width: "40px", height: "36px", border: "none", background: "none", cursor: "pointer", padding: 0 }}
                  />
                  <span style={{
                    background: "#2a2a2a", border: "1px solid #3a3a3a",
                    borderRadius: "6px", padding: "6px 12px",
                    color: "#fff", fontSize: "13px", fontFamily: "monospace"
                  }}>{bgColor}</span>
                  <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: bgColor, flexShrink: 0 }} />
                </div>
              </div>
            </div>
          </div>
          <input id="cover-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
        </div>

        {/* Album Name */}
        <div>
          <label style={labelStyle}>Album Name</label>
          <input
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Romantic Anirudh" required style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#1DB954"}
            onBlur={e => e.target.style.borderColor = "#3a3a3a"}
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="What's this album about?" required rows={3}
            style={{ ...inputStyle, resize: "none" }}
            onFocus={e => e.target.style.borderColor = "#1DB954"}
            onBlur={e => e.target.style.borderColor = "#3a3a3a"}
          />
        </div>

        <button
          type="submit" disabled={loading}
          style={{
            width: "100%", padding: "14px",
            background: loading ? "#555" : "#1DB954",
            color: loading ? "#aaa" : "#000",
            border: "none", borderRadius: "50px",
            fontSize: "15px", fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s", marginTop: "4px",
          }}
          onMouseEnter={e => { if (!loading) e.target.style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}
        >
          {loading ? "Creating Album..." : "Create Album"}
        </button>
      </form>
    </div>
  );
};

export default AddAlbum;
