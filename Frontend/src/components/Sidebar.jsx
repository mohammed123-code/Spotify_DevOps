import React, { useContext, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/assets";

const MIN_WIDTH = 78;
const MAX_WIDTH = 420;
const DEFAULT_WIDTH = 300;

const Sidebar = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { albumsData } = useContext(PlayerContext);
  const { likedSongs, playlists, createPlaylist, playlistCover } = useLibrary();
  const { user } = useAuth();

  const [width, setWidth] = useState(MIN_WIDTH);
  const [filter, setFilter] = useState("Playlists");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const sidebarRef = useRef();
  const isDragging = useRef(false);

  const isCollapsed = width <= MIN_WIDTH + 16;

  const onMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    const onMouseMove = (ev) => {
      if (!isDragging.current) return;
      const rect = sidebarRef.current.getBoundingClientRect();
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, ev.clientX - rect.left)));
    };
    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const expand = () => setWidth(DEFAULT_WIDTH);
  const collapse = () => setWidth(MIN_WIDTH);

  const q = search.trim().toLowerCase();

  const filteredPlaylists = useMemo(
    () => playlists.filter((p) => p.name.toLowerCase().includes(q)),
    [playlists, q]
  );

  const filteredAlbums = useMemo(
    () => albumsData.filter((a) => a.name.toLowerCase().includes(q)),
    [albumsData, q]
  );

  const artists = useMemo(() => {
    const map = new Map();
    albumsData.forEach((a) => {
      if (!map.has(a.name)) map.set(a.name, a);
    });
    return [...map.values()].filter((a) => a.name.toLowerCase().includes(q));
  }, [albumsData, q]);

  const openCreate = (e) => {
    e?.stopPropagation();
    setShowCreate(true);
    if (isCollapsed) expand();
  };

  const submitCreate = (e) => {
    e.preventDefault();
    const pl = createPlaylist(newName);
    setNewName("");
    setShowCreate(false);
    nav(`/playlist/${pl.id}`);
  };

  const itemClass = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: isCollapsed ? 0 : 12,
    padding: isCollapsed ? "6px 0" : "8px 12px",
    justifyContent: isCollapsed ? "center" : "flex-start",
    cursor: "pointer",
    borderRadius: 6,
    margin: "2px 6px",
    background: active ? "#1a1a1a" : "transparent",
  });

  const likedActive = location.pathname === "/liked";

  return (
    <div
      ref={sidebarRef}
      style={{
        width: `${width}px`,
        minWidth: `${MIN_WIDTH}px`,
        maxWidth: `${MAX_WIDTH}px`,
        height: "100%",
        background: "#121212",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        color: "#fff",
        position: "relative",
        flexShrink: 0,
        userSelect: "none",
        margin: "8px 0 8px 8px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          padding: isCollapsed ? "14px 0 8px" : "14px 12px 8px",
          flexDirection: isCollapsed ? "column" : "row",
          gap: isCollapsed ? 14 : 0,
        }}
      >
        {isCollapsed ? (
          <>
            <button type="button" onClick={expand} title="Expand Your Library">
              <img src={assets.stack_icon} style={{ width: 22, filter: "brightness(10)", opacity: 0.85 }} alt="" />
            </button>
            <button
              type="button"
              onClick={openCreate}
              title="Create playlist"
              style={{
                width: 32, height: 32, borderRadius: "50%", background: "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <img src={assets.plus_icon} style={{ width: 16, filter: "brightness(10)" }} alt="" />
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={collapse} className="flex items-center gap-2.5 hover:text-white text-[#b3b3b3]">
              <img src={assets.stack_icon} style={{ width: 20, filter: "brightness(10)" }} alt="" />
              <span style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>Your Library</span>
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={openCreate}
                title="Create playlist"
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
                className="hover:bg-[#2a2a2a]"
              >
                <img src={assets.plus_icon} style={{ width: 14, filter: "brightness(10)" }} alt="" />
              </button>
              <button
                type="button"
                onClick={() => setWidth((w) => (w > 340 ? DEFAULT_WIDTH : MAX_WIDTH))}
                title="Resize"
                className="w-8 h-8 rounded-full hover:bg-[#2a2a2a] flex items-center justify-center"
              >
                <img src={assets.arrow_icon} style={{ width: 14, filter: "brightness(10)" }} alt="" />
              </button>
            </div>
          </>
        )}
      </div>

      {!isCollapsed && (
        <>
          <div style={{ display: "flex", gap: 8, padding: "4px 12px 10px", flexWrap: "wrap" }}>
            {["Playlists", "Albums", "Artists"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 50,
                  border: "none",
                  background: filter === f ? "#fff" : "#232323",
                  color: filter === f ? "#000" : "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ padding: "0 12px 10px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <img
                src={assets.search_icon}
                alt=""
                style={{
                  width: 14, position: "absolute", left: 10, top: "50%",
                  transform: "translateY(-50%)", filter: "brightness(8)", opacity: 0.7,
                }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder=""
                style={{
                  width: "100%", background: "#1a1a1a", border: "none",
                  borderRadius: 6, padding: "8px 10px 8px 32px",
                  color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            <span style={{ color: "#b3b3b3", fontSize: 13, whiteSpace: "nowrap" }}>Recents</span>
          </div>
        </>
      )}

      {showCreate && !isCollapsed && (
        <form onSubmit={submitCreate} style={{ padding: "0 12px 12px" }}>
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Playlist name"
            style={{
              width: "100%", background: "#282828", border: "1px solid #535353",
              borderRadius: 6, padding: "8px 10px", color: "#fff", fontSize: 13,
              outline: "none", boxSizing: "border-box", marginBottom: 8,
            }}
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 py-1.5 rounded-full bg-white text-black text-xs font-bold">
              Create
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-1.5 rounded-full bg-[#282828] text-xs">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: 12 }}>
        {(filter === "Playlists" || isCollapsed) && (
          <div
            onClick={() => nav("/liked")}
            title="Liked Songs"
            style={itemClass(likedActive)}
            onMouseEnter={(e) => { if (!likedActive) e.currentTarget.style.background = "#1a1a1a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = likedActive ? "#1a1a1a" : "transparent"; }}
          >
            <div
              style={{
                width: 48, height: 48, borderRadius: 4, flexShrink: 0,
                background: "linear-gradient(135deg, #450af5, #c4b5fd)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, color: "#fff",
              }}
            >
              ♥
            </div>
            {!isCollapsed && (
              <div style={{ overflow: "hidden" }}>
                <div className="font-semibold text-sm truncate">Liked Songs</div>
                <div className="text-[#b3b3b3] text-xs truncate">
                  📌 Playlist · {user?.name || "You"} · {likedSongs.length} songs
                </div>
              </div>
            )}
          </div>
        )}

        {(filter === "Playlists" || isCollapsed) &&
          filteredPlaylists.map((pl) => {
            const cover = playlistCover(pl);
            const active = location.pathname === `/playlist/${pl.id}`;
            return (
              <div
                key={pl.id}
                onClick={() => nav(`/playlist/${pl.id}`)}
                title={pl.name}
                style={itemClass(active)}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#1a1a1a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = active ? "#1a1a1a" : "transparent"; }}
              >
                {cover ? (
                  <img src={cover} alt="" style={{ width: 48, height: 48, borderRadius: 4, objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: 48, height: 48, borderRadius: 4, background: "#282828",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#b3b3b3", fontSize: 20, flexShrink: 0,
                  }}>♫</div>
                )}
                {!isCollapsed && (
                  <div style={{ overflow: "hidden" }}>
                    <div className="font-semibold text-sm truncate">{pl.name}</div>
                    <div className="text-[#b3b3b3] text-xs truncate">
                      Playlist · {user?.name || "You"}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        {(filter === "Albums" || (isCollapsed && filter === "Playlists")) &&
          filteredAlbums.map((album) => {
            const active = location.pathname === `/album/${album.id}`;
            return (
              <div
                key={album.id}
                onClick={() => nav(`/album/${album.id}`)}
                title={album.name}
                style={itemClass(active)}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#1a1a1a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = active ? "#1a1a1a" : "transparent"; }}
              >
                <img
                  src={album.image}
                  alt={album.name}
                  style={{ width: 48, height: 48, borderRadius: 4, objectFit: "cover", flexShrink: 0 }}
                />
                {!isCollapsed && (
                  <div style={{ overflow: "hidden" }}>
                    <div className="font-semibold text-sm truncate">{album.name}</div>
                    <div className="text-[#b3b3b3] text-xs truncate">Album · Spotify Clone</div>
                  </div>
                )}
              </div>
            );
          })}

        {!isCollapsed && filter === "Artists" &&
          artists.map((a) => (
            <div
              key={a.id}
              onClick={() => nav(`/album/${a.id}`)}
              style={itemClass(false)}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1a1a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <img src={a.image} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
              <div style={{ overflow: "hidden" }}>
                <div className="font-semibold text-sm truncate">{a.name}</div>
                <div className="text-[#b3b3b3] text-xs">Artist</div>
              </div>
            </div>
          ))}

        {!isCollapsed && filter === "Playlists" && filteredPlaylists.length === 0 && q && (
          <p className="text-[#535353] text-xs text-center px-3 py-4">No playlists match “{search}”</p>
        )}
      </div>

      <div
        onMouseDown={onMouseDown}
        title="Drag to resize"
        style={{
          position: "absolute", top: 0, right: 0, width: 6, height: "100%",
          cursor: "col-resize", zIndex: 10,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#1DB954"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      />
    </div>
  );
};

export default Sidebar;
