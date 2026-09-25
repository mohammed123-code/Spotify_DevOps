const cloudinary = require("cloudinary").v2;
const Album = require("../models/Album");
const Song = require("../models/Song");

// Add a new album (image uploaded to Cloudinary)
const addAlbum = async (req, res) => {
  try {
    const { name, desc, bgColor } = req.body;
    const imageFile = req.file;

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const album = await Album.create({
      name,
      desc,
      bgColor,
      image: imageUpload.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "Album created successfully",
      album,
    });
  } catch (error) {
    console.error("Add album error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all albums
const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ success: true, albums });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single album by ID with its songs
const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    // Fetch all songs belonging to this album by name
    const songs = await Song.findAll({
      where: { album: album.name },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({ success: true, album, songs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add an existing song to this album
const addSongToAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    const { songId } = req.body;
    const song = await Song.findByPk(songId);
    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }

    await song.update({ album: album.name });
    res.status(200).json({
      success: true,
      message: `Added to ${album.name}`,
      song,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove a song from this album (sets album to None)
const removeSongFromAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    const song = await Song.findByPk(req.params.songId);
    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }

    if (song.album !== album.name) {
      return res.status(400).json({ success: false, message: "Song is not in this album" });
    }

    await song.update({ album: "None" });
    res.status(200).json({ success: true, message: "Song removed from album", song });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an album
const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    // Reset album reference on all related songs
    await Song.update({ album: "None" }, { where: { album: album.name } });

    await album.destroy();

    res.status(200).json({ success: true, message: "Album deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addAlbum,
  getAllAlbums,
  getAlbumById,
  addSongToAlbum,
  removeSongFromAlbum,
  deleteAlbum,
};
