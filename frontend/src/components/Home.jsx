import React, { useContext } from "react";
import Sidebar from "./Sidebar";
import Player from "./Player";
import Display from "./Display";
import Navbar from "./Navbar";
import NowPlaying from "./NowPlaying";
import { PlayerContext } from "../context/PlayerContext";

const Home = () => {
  const { showNowPlaying } = useContext(PlayerContext);

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <Display />
        {showNowPlaying && <NowPlaying />}
      </div>
      <Player />
    </div>
  );
};

export default Home;
