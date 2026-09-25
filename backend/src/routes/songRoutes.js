const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  addSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
} = require("../controllers/songController");

// GET /api/songs - Get all songs
router.get("/", getAllSongs);

// GET /api/songs/:id - Get a single song
router.get("/:id", getSongById);

// POST /api/songs - Add a new song (with audio + image)
router.post(
  "/",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  addSong
);

// PUT /api/songs/:id - Update song (album assignment, name, desc)
router.put("/:id", updateSong);

// DELETE /api/songs/:id - Delete a song
router.delete("/:id", deleteSong);

module.exports = router;
