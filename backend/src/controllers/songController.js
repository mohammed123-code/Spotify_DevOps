const cloudinary = require("cloudinary").v2;
const Song = require("../models/Song");

// Add a new song (audio + image uploaded to Cloudinary)
const addSong = async (req, res) => {
  try {
    const { name, desc, album } = req.body;
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    // Upload audio to Cloudinary (resource_type: "video" handles audio files)
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });

    // Upload thumbnail image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    // Calculate duration from Cloudinary audio metadata
    const minutes = Math.floor(audioUpload.duration / 60);
    const seconds = String(Math.floor(audioUpload.duration % 60)).padStart(2, "0");
    const duration = `${minutes}:${seconds}`;

    const song = await Song.create({
      name,
      desc,
      album: album || "None",
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration,
    });

    res.status(201).json({
      success: true,
      message: "Song added successfully",
      song,
    });
  } catch (error) {
    console.error("Add song error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all songs
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ success: true, songs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single song by ID
const getSongById = async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }
    res.status(200).json({ success: true, song });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update song fields (assign/change album from admin)
const updateSong = async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }

    const { album, name, desc } = req.body;
    const updates = {};
    if (album !== undefined) updates.album = album || "None";
    if (name !== undefined) updates.name = name;
    if (desc !== undefined) updates.desc = desc;

    await song.update(updates);
    res.status(200).json({ success: true, message: "Song updated", song });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a song
const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }
    await song.destroy();
    res.status(200).json({ success: true, message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addSong, getAllSongs, getSongById, updateSong, deleteSong };
