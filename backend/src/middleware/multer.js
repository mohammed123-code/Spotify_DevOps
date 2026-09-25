const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedAudio = [
    "audio/mpeg",       // .mp3
    "audio/mp3",
    "audio/wav",
    "audio/wave",
    "audio/x-wav",
    "audio/ogg",
    "audio/flac",
    "audio/x-flac",
    "audio/aac",
    "audio/x-m4a",
    "audio/mp4",
    "video/mpeg",       // .mpeg files (audio content)
    "video/mp4",        // .mp4 with audio
    "application/octet-stream", // some browsers send this for audio
  ];

  const allowedImage = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ];

  if (
    allowedAudio.includes(file.mimetype) ||
    allowedImage.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    // Also allow by file extension as fallback
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = [
      ".mp3", ".wav", ".ogg", ".flac", ".aac", ".m4a",
      ".mpeg", ".mpg", ".mp4",
      ".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"
    ];
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype} (${ext})`), false);
    }
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max (increased for MPEG files)
});

module.exports = upload;
