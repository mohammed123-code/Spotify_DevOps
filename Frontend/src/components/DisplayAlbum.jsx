import React, { useContext, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import { albumsData, assets, songsData } from '../assets/assets';
import { PlayerContext } from '../context/PlayerContext';
import api from '../api';

const DisplayAlbum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrackFromQueue } = useContext(PlayerContext);
  
  const [albumData, setAlbumData] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedSongIds, setLikedSongIds] = useState(new Set());

  // Check if it's a Spotify album (alphanumeric ID) vs a mock album (single digit ID)
  const isSpotifyAlbum = isNaN(Number(id));

  const fetchAlbumDetails = async () => {
    setLoading(true);
    try {
      if (isSpotifyAlbum) {
        // Fetch from Spotify via proxy
        const res = await api.get(`/api/spotify/album/${id}`);
        const album = res.data;
        
        setAlbumData({
          name: album.name,
          desc: `Album by ${album.artists?.map(a => a.name).join(', ')} &bull; ${album.release_date?.split('-')[0]} &bull; ${album.total_tracks} songs`,
          image: album.images?.[0]?.url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300',
          bgColor: '#242424' // Default background color for Spotify albums
        });

        setTracks(album.tracks?.items || []);
      } else {
        // Load local mock album details
        const mockAlbum = albumsData[Number(id)];
        if (!mockAlbum) {
          throw new Error('Local album not found');
        }
        setAlbumData(mockAlbum);
        setTracks(songsData);
      }
    } catch (error) {
      console.error('Failed to load album details:', error);
      // fallback to mock on error
      const mockAlbum = albumsData[0];
      setAlbumData(mockAlbum);
      setTracks(songsData);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedSongs = async () => {
    try {
      const res = await api.get('/api/favorites');
      const ids = new Set(res.data.map(song => song.spotify_track_id));
      setLikedSongIds(ids);
    } catch (e) {
      console.warn('Failed to load user liked songs state:', e.message);
    }
  };

  useEffect(() => {
    fetchAlbumDetails();
    fetchLikedSongs();
  }, [id]);

  const handlePlaySong = (trackIndex) => {
    if (tracks.length === 0) return;

    if (!isSpotifyAlbum) {
      // playing local mock tracks
      const formattedQueue = tracks.map(item => ({
        id: String(item.id),
        name: item.name,
        artist: "Local Artist",
        file: item.file,
        image: item.image,
        duration: 30
      }));
      playTrackFromQueue(formattedQueue, trackIndex);
    } else {
      // playing Spotify tracks
      const formattedQueue = tracks.map(item => ({
        id: item.id,
        name: item.name,
        artist: item.artists?.map(a => a.name).join(', ') || 'Unknown',
        file: item.preview_url,
        image: albumData.image, // use album cover art
        duration: Math.floor(item.duration_ms / 1000) || 30
      }));
      playTrackFromQueue(formattedQueue, trackIndex);
    }
  };

  const handleLikeSong = async (track, e) => {
    e.stopPropagation(); // prevent playing track when clicking heart
    const trackId = isSpotifyAlbum ? track.id : String(track.id);

    try {
      if (likedSongIds.has(trackId)) {
        // Dislike (Remove from favorites)
        await api.delete(`/api/favorites/${trackId}`);
        setLikedSongIds(prev => {
          const next = new Set(prev);
          next.delete(trackId);
          return next;
        });
      } else {
        // Like (Add to favorites)
        await api.post('/api/favorites', {
          spotify_track_id: trackId,
          track_name: track.name,
          artist_name: isSpotifyAlbum ? track.artists?.map(a => a.name).join(', ') : "Local Artist",
          album_name: albumData.name,
          cover_url: isSpotifyAlbum ? albumData.image : track.image,
          preview_url: isSpotifyAlbum ? track.preview_url : track.file,
          duration_ms: isSpotifyAlbum ? track.duration_ms : 240000 // 4 mins default
        });
        setLikedSongIds(prev => {
          const next = new Set(prev);
          next.add(trackId);
          return next;
        });
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to toggle favorite.');
    }
  };

  if (loading) return <div className="text-neutral-400 py-10">Loading album...</div>;

  return (
    <>
      <Navbar />
      {albumData && (
        <>
          <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
            <img className="w-48 rounded shadow-lg object-cover aspect-square" src={albumData.image} alt={albumData.name} />
            <div className="flex flex-col">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">ALBUM</p>
              <h2 className="text-4xl font-bold mb-4 md:text-6xl text-white">
                {albumData.name}
              </h2>
              <h4 className="text-sm text-neutral-300 mb-2" dangerouslySetInnerHTML={{ __html: albumData.desc }} />
              <p className="mt-2 text-xs text-neutral-400 flex items-center gap-1.5">
                <img className="inline-block w-5" src={assets.spotify_logo} alt="" />
                <b>Spotify Clone</b> &bull; {tracks.length} songs
              </p>
            </div>
          </div>
          
          {/* Table Headers */}
          <div className="grid grid-cols-12 mt-10 mb-4 pl-2 text-[#a7a7a7] border-b border-neutral-800 pb-2 text-sm">
            <div className="col-span-1">#</div>
            <div className="col-span-6 sm:col-span-7">Title</div>
            <div className="col-span-3 sm:col-span-2 hidden md:block">Album</div>
            <div className="col-span-2 flex justify-center">
              <img className="m-auto w-4" src={assets.clock_icon} alt="Duration" />
            </div>
            <div className="col-span-1 text-center">Like</div>
          </div>

          {/* Songs List */}
          <div className="flex flex-col mb-10">
            {tracks.map((item, index) => {
              const trackId = isSpotifyAlbum ? item.id : String(item.id);
              const isLiked = likedSongIds.has(trackId);
              const duration = isSpotifyAlbum
                ? `${Math.floor(item.duration_ms / 60000)}:${String(Math.floor((item.duration_ms % 60000) / 1000)).padStart(2, '0')}`
                : item.duration;

              return (
                <div 
                  onClick={() => handlePlaySong(index)} 
                  key={trackId} 
                  className="grid grid-cols-12 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer rounded transition group"
                >
                  <p className="col-span-1 text-sm text-neutral-400">{index + 1}</p>
                  
                  <div className="col-span-6 sm:col-span-7 flex items-center gap-3">
                    {item.image && (
                      <img className="w-10 h-10 rounded object-cover" src={item.image} alt="" />
                    )}
                    <div className="truncate">
                      <p className="text-white font-semibold truncate group-hover:text-[#1DB954]">{item.name}</p>
                      <p className="text-xs text-neutral-400 truncate">
                        {isSpotifyAlbum ? item.artists?.map(a => a.name).join(', ') : "Local Artist"}
                      </p>
                    </div>
                  </div>

                  <p className="col-span-3 sm:col-span-2 text-[14px] truncate hidden md:block">{albumData.name}</p>
                  
                  <p className="col-span-2 text-[14px] text-center">{duration}</p>
                  
                  <div className="col-span-1 flex justify-center">
                    <button 
                      onClick={(e) => handleLikeSong(item, e)}
                      className={`hover:scale-110 transition ${isLiked ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                      title={isLiked ? "Unlike" : "Like"}
                    >
                      <img 
                        className="w-4 h-4" 
                        src={assets.like_icon} 
                        style={isLiked ? { filter: 'invert(37%) sepia(93%) saturate(1067%) hue-rotate(323deg) brightness(85%) contrast(100%)' } : {}}
                        alt="Like" 
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default DisplayAlbum;