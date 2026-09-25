import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { useLibrary } from "../context/LibraryContext";
import AddToPlaylist from "./AddToPlaylist";

const SongItems = (props) => {
  const { playWithId } = useContext(PlayerContext);
  const { toggleLike, isLiked } = useLibrary();
  const liked = isLiked(props.id);

  return (
    <div className="group min-w-[180px] max-w-[200px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] relative">
      <div className="relative" onClick={() => playWithId(props.id)}>
        <img className="rounded w-full min-w-[155px] max-h-[189px] object-cover" src={props.image} alt="" />
        <div
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => playWithId(props.id)}
            className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg"
            title="Play"
          >
            ▶
          </button>
        </div>
      </div>
      <p className="font-bold mt-2 mb-1 truncate">{props.name}</p>
      <p className="text-slate-200 text-sm line-clamp-2">{props.desc}</p>
      <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => toggleLike(props.id)}
          style={{ color: liked ? "#1DB954" : "#b3b3b3" }}
          title={liked ? "Unlike" : "Like"}
        >
          {liked ? "♥" : "♡"}
        </button>
        <AddToPlaylist songId={props.id} />
      </div>
    </div>
  );
};

export default SongItems;
