import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AddSong from "./pages/AddSong";
import AddAlbum from "./pages/AddAlbum";
import ListSongs from "./pages/ListSongs";
import ListAlbums from "./pages/ListAlbums";

const App = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#121212", fontFamily: "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main style={{ marginLeft: "220px", flex: 1, padding: "40px 48px", overflowY: "auto" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/add-song" replace />} />
          <Route path="/add-song"    element={<AddSong />} />
          <Route path="/add-album"   element={<AddAlbum />} />
          <Route path="/list-songs"  element={<ListSongs />} />
          <Route path="/list-albums" element={<ListAlbums />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
