import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import { albumsData, songsData } from "../assets/assets";
import AlbumItems from "./AlbumItems";
import SongItems from "./SongItems";
import api from "../api";
import { PlayerContext } from "../context/PlayerContext";

const DisplayHome = () => {
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrackFromQueue } = useContext(PlayerContext);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [playlistsRes, releasesRes] = await Promise.all([
          api.get('/api/spotify/featured-playlists').catch(() => null),
          api.get('/api/spotify/new-releases').catch(() => null)
        ]);

        if (playlistsRes && playlistsRes.data?.playlists?.items) {
          setFeaturedPlaylists(playlistsRes.data.playlists.items);
        } else {
          setFeaturedPlaylists(albumsData); // Fallback to mock
        }

        if (releasesRes && releasesRes.data?.albums?.items) {
          setNewReleases(releasesRes.data.albums.items);
        } else {
          setNewReleases(songsData); // Fallback to mock
        }
      } catch (error) {
        console.warn("Spotify API fetch failed, using local mock fallbacks:", error);
        setFeaturedPlaylists(albumsData);
        setNewReleases(songsData);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handlePlaySong = (track, trackList) => {
    // If it's mock track (doesn't have preview_url and album metadata formatted the same way)
    if (track.file) {
      // Local mock song
      const formattedQueue = trackList.map(item => ({
        id: String(item.id),
        name: item.name,
        artist: "Local Artist",
        file: item.file,
        image: item.image,
        duration: 30
      }));
      const index = trackList.findIndex(item => item.id === track.id);
      playTrackFromQueue(formattedQueue, index !== -1 ? index : 0);
    } else {
      // Spotify track
      const formattedQueue = trackList.map(item => ({
        id: item.id,
        name: item.name,
        artist: item.artists?.map(a => a.name).join(', ') || 'Unknown',
        file: item.preview_url,
        image: item.images?.[0]?.url || item.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100',
        duration: Math.floor(item.duration_ms / 1000) || 30
      }));
      const index = trackList.findIndex(item => item.id === track.id);
      playTrackFromQueue(formattedQueue, index !== -1 ? index : 0);
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Featured Playlists Section */}
      <div className="mb-8">
        <h1 className="my-5 font-bold text-2xl">Featured Playlists</h1>
        <div className="flex overflow-auto gap-4 pb-2 scrollbar-hide">
          {featuredPlaylists.map((item, index) => {
            const id = item.id !== undefined ? item.id : index;
            const name = item.name;
            const desc = item.description || item.desc || "Spotify playlist";
            const image = item.images?.[0]?.url || item.image;
            
            return (
              <AlbumItems
                key={id}
                name={name}
                desc={desc}
                id={id}
                image={image}
              />
            );
          })}
        </div>
      </div>

      {/* New Releases Section */}
      <div className="mb-8">
        <h1 className="my-5 font-bold text-2xl">New Releases & Hot Tracks</h1>
        <div className="flex overflow-auto gap-4 pb-2 scrollbar-hide">
          {newReleases.map((item, index) => {
            const id = item.id !== undefined ? item.id : index;
            const name = item.name;
            const desc = item.artists?.map(a => a.name).join(', ') || item.desc || "Trending release";
            const image = item.images?.[0]?.url || item.album?.images?.[0]?.url || item.image;

            return (
              <div 
                key={id} 
                onClick={() => {
                  if (item.file) {
                    handlePlaySong(item, newReleases);
                  } else {
                    // Navigate to album details page for Spotify albums
                    window.location.href = `/album/${id}`;
                  }
                }}
                className="min-w-[180px] p-4 px-3 rounded-lg hover:bg-[#ffffff26] cursor-pointer transition flex flex-col gap-2 bg-[#181818]"
              >
                <img className="w-full aspect-square object-cover rounded shadow-md" src={image} alt={name} />
                <p className="font-bold text-sm truncate text-white">{name}</p>
                <p className="text-xs text-neutral-400 truncate">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DisplayHome;
