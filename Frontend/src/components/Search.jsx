import React, { useState, useContext } from 'react';
import Navbar from './Navbar';
import api from '../api';
import { PlayerContext } from '../context/PlayerContext';
import { songsData } from '../assets/assets';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const { playTrackFromQueue } = useContext(PlayerContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setIsFallbackMode(false);
    try {
      const res = await api.get(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (error) {
      console.warn('Spotify search failed, using local mock data fallback:', error);
      setIsFallbackMode(true);
      
      // Filter local songsData based on search query
      const queryLower = query.toLowerCase();
      const filtered = songsData.filter(song => 
        song.name.toLowerCase().includes(queryLower) || 
        song.desc.toLowerCase().includes(queryLower)
      );

      // If no matches found, return all local mock songs as fallback options
      const fallbackSongs = filtered.length > 0 ? filtered : songsData;

      // Transform local songsData to match Spotify track structures
      const formattedTracks = fallbackSongs.map(item => ({
        id: String(item.id),
        name: item.name,
        artists: [{ name: 'Local Artist' }],
        album: {
          name: 'Local Album',
          images: [{ url: item.image }]
        },
        preview_url: item.file,
        duration_ms: 240000 // default 4 mins
      }));

      setResults({
        tracks: {
          items: formattedTracks
        },
        artists: {
          items: [
            {
              id: 'local_artist_1',
              name: 'Local Artist',
              images: [{ url: 'https://api.dicebear.com/7.x/initials/svg?seed=LocalArtist' }],
              genres: ['Traditional Tamil']
            }
          ]
        },
        albums: {
          items: [
            {
              id: 'local_album_1',
              name: 'Local Album',
              artists: [{ name: 'Local Artist' }],
              images: [{ url: fallbackSongs[0]?.image }],
              release_date: '2026'
            }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (track, trackList) => {
    // Format tracks to match PlayerContext expectations
    const formattedQueue = trackList.map(item => ({
      id: item.id,
      name: item.name,
      artist: item.artists?.map(a => a.name).join(', ') || 'Local Artist',
      file: item.preview_url, // plays either Spotify preview URL or local file path
      image: item.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100',
      duration: Math.floor((item.duration_ms || 240000) / 1000)
    }));

    const selectedIndex = trackList.findIndex(item => item.id === track.id);
    playTrackFromQueue(formattedQueue, selectedIndex !== -1 ? selectedIndex : 0);
  };

  return (
    <>
      <Navbar />
      
      {/* Search Input Bar */}
      <div className="my-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full bg-[#242424] border border-neutral-700 hover:border-neutral-500 focus:border-white focus:outline-none rounded-full px-5 py-3 text-white transition placeholder-neutral-400 text-sm"
          />
          <button 
            type="submit" 
            className="bg-[#1DB954] text-black hover:bg-[#1ed760] font-bold px-6 py-3 rounded-full text-sm transition"
          >
            Search
          </button>
        </form>
      </div>

      {loading && <div className="text-neutral-400 py-10">Searching catalog...</div>}

      {results && (
        <div className="flex flex-col gap-8 pb-10">
          
          {/* Songs results */}
          {results.tracks?.items?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Songs</h2>
              <div className="flex flex-col bg-[#181818] rounded-lg p-4">
                {results.tracks.items.map((track, index) => (
                  <div 
                    key={track.id} 
                    onClick={() => handlePlaySong(track, results.tracks.items)}
                    className="flex items-center justify-between p-2 rounded hover:bg-[#ffffff0d] cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-neutral-400 w-4 text-center">{index + 1}</span>
                      <img 
                        className="w-10 h-10 rounded object-cover shadow" 
                        src={track.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100'} 
                        alt={track.name} 
                      />
                      <div>
                        <p className="font-semibold text-white group-hover:text-[#1DB954] transition">{track.name}</p>
                        <p className="text-xs text-neutral-400">{track.artists.map(a => a.name).join(', ')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <span className="text-xs text-neutral-400">
                        {Math.floor((track.duration_ms || 240000) / 60000)}:
                        {String(Math.floor(((track.duration_ms || 240000) % 60000) / 1000)).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Artists results */}
          {results.artists?.items?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Artists</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {results.artists.items.slice(0, 8).map((artist) => (
                  <div key={artist.id} className="min-w-[150px] bg-[#181818] p-4 rounded-lg flex flex-col items-center gap-2 hover:bg-[#282828] transition cursor-pointer">
                    <img 
                      className="w-24 h-24 rounded-full object-cover shadow-lg" 
                      src={artist.images?.[0]?.url || 'https://api.dicebear.com/7.x/initials/svg?seed=' + artist.name} 
                      alt={artist.name} 
                    />
                    <p className="font-semibold text-sm text-center truncate w-full">{artist.name}</p>
                    <p className="text-xs text-neutral-400 capitalize">{artist.genres?.[0] || 'Artist'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Albums results */}
          {results.albums?.items?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Albums</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {results.albums.items.slice(0, 8).map((album) => (
                  <div key={album.id} className="min-w-[150px] max-w-[150px] bg-[#181818] p-4 rounded-lg flex flex-col gap-2 hover:bg-[#282828] transition cursor-pointer">
                    <img 
                      className="w-full aspect-square rounded object-cover shadow-lg" 
                      src={album.images?.[0]?.url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150'} 
                      alt={album.name} 
                    />
                    <p className="font-semibold text-sm truncate w-full">{album.name}</p>
                    <p className="text-xs text-neutral-400 truncate w-full">{album.artists?.[0]?.name} &bull; {album.release_date?.split('-')[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {!results && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-500">
          <p className="text-lg">Find your favorite music.</p>
          <p className="text-xs mt-1">Search for songs, artists, or albums above.</p>
        </div>
      )}
    </>
  );
};

export default Search;
