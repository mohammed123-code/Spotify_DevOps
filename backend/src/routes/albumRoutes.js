const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  addAlbum,
  getAllAlbums,
  getAlbumById,
  addSongToAlbum,
  removeSongFromAlbum,
  deleteAlbum,
} = require("../controllers/albumController");

// GET /api/albums - Get all albums
router.get("/", getAllAlbums);

// GET /api/albums/:id - Get single album with its songs
router.get("/:id", getAlbumById);

// POST /api/albums - Create a new album (with image)
router.post("/", upload.single("image"), addAlbum);

// POST /api/albums/:id/songs - Assign an existing song to this album
router.post("/:id/songs", addSongToAlbum);

// DELETE /api/albums/:id/songs/:songId - Unassign a song from this album
router.delete("/:id/songs/:songId", removeSongFromAlbum);

// DELETE /api/albums/:id - Delete an album
router.delete("/:id", deleteAlbum);

module.exports = router;
