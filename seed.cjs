/**
 * Seeder Script — uploads all default songs & albums from src/assets to the backend
 * Run from project root: node seed.js
 */

const axios  = require("axios");
const fs     = require("fs");
const path   = require("path");
const FormData = require("form-data");

const BASE_URL   = "http://localhost:4000";
const ASSETS_DIR = path.join(__dirname, "frontend", "src", "assets");
const SONGS_DIR  = path.join(ASSETS_DIR, "songs");
const IMG_DIR    = path.join(ASSETS_DIR, "img");
const THUMB_DIR  = path.join(IMG_DIR, "song-thumb");

// ── Albums ─────────────────────────────────────────────────────────────────
const albums = [
  { name: "Munpani Kaadhal",   image: "munpani-kaadhal.jpg",   desc: "Your weekly update of the most played tracks",      bgColor: "#D10000" },
  { name: "10s Romance Tamil", image: "10s-romance-tamil.jpg",  desc: "Best Love Songs of 2010s from kollywood",          bgColor: "#bcc45e" },
  { name: "A.R. Rahman",       image: "arr-mix.jpg",            desc: "Hits of A.R. Rahman that will kill you",           bgColor: "#029ed6" },
  { name: "Kollywood Chill",   image: "kolly-chill-out.jpg",    desc: "Cool tracks from Kollywood music industry",        bgColor: "#44337a" },
  { name: "Purely Kadhal",     image: "purely-kaadhal.jpg",     desc: "All the mushy feels from top romantic hits",       bgColor: "#D10000" },
  { name: "Romantic Anirudh",  image: "romantic-anirudh.jpg",   desc: "Enjoy the Romantic side of Ani",                  bgColor: "#744210" },
  { name: "Hip Hop Tamizha",   image: "hip-hop-radio.jpg",      desc: "Love and more love from Aadhi",                   bgColor: "#F7567C" },
  { name: "Yuvan Hits",        image: "yuvan.jpg",              desc: "Soulful tracks from Yuvan Shankar Raja",           bgColor: "#4E3822" },
];

// ── Songs ───────────────────────────────────────────────────────────────────
const songs = [
  { name: "Otha Solala",      audio: "Otha-Sollaala.mp3",       image: "aadukalam.webp",      desc: "Happy tunes from Dhanush na!!",                        album: "Munpani Kaadhal"   },
  { name: "Kanave Kanave",    audio: "Kanave Kanave.mp3",        image: "david.png",           desc: "Dive into anirudh sad zone",                           album: "Romantic Anirudh"  },
  { name: "Naan Pizhaipeno",  audio: "Naan-Pizhaippeno.mp3",    image: "enpt.jpeg",           desc: "Crazy Love from Dhanush",                              album: "10s Romance Tamil"  },
  { name: "Aaruyire",         audio: "Aaruyire.mp3",             image: "guru.png",            desc: "Mesmerizing hits A.R.R > anything",                    album: "A.R. Rahman"       },
  { name: "Anbe En Anbe",     audio: "Anbe-En-Anbe.mp3",        image: "dhaam_dhoom.png",     desc: "Put a smile on your face with these happy tunes",      album: "Purely Kadhal"     },
  { name: "Poi Vazhva",       audio: "Poi-Vazhva.mp3",           image: "manithan.png",        desc: "Dont ever feel down listen this",                      album: "Kollywood Chill"   },
  { name: "Sirukki Vaasam",   audio: "Sirukki-Vaasam.mp3",      image: "kodi.png",            desc: "Put a smile on your face with these happy tunes",      album: "Hip Hop Tamizha"   },
  { name: "Bodhai Kaname",    audio: "Bodhai-Kaname.mp3",        image: "oh-manapennae.png",   desc: "Put a smile on your face with these happy tunes",      album: "Yuvan Hits"        },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function uploadAlbum(album) {
  const form = new FormData();
  form.append("name",    album.name);
  form.append("desc",    album.desc);
  form.append("bgColor", album.bgColor);
  form.append("image",   fs.createReadStream(path.join(IMG_DIR, album.image)));

  const res = await axios.post(`${BASE_URL}/api/albums`, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
  return res.data.album;
}

async function uploadSong(song) {
  const form = new FormData();
  form.append("name",  song.name);
  form.append("desc",  song.desc);
  form.append("album", song.album);
  form.append("audio", fs.createReadStream(path.join(SONGS_DIR, song.audio)));
  form.append("image", fs.createReadStream(path.join(THUMB_DIR, song.image)));

  const res = await axios.post(`${BASE_URL}/api/songs`, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 120000, // 2 min per song (Cloudinary upload time)
  });
  return res.data.song;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Starting seeder...\n");

  // Upload Albums
  console.log("📀 Uploading albums to Cloudinary + MySQL...");
  for (const album of albums) {
    try {
      const result = await uploadAlbum(album);
      console.log(`  ✅ Album: ${result.name}`);
      await sleep(500); // small delay between uploads
    } catch (err) {
      console.error(`  ❌ Album failed [${album.name}]: ${err.response?.data?.message || err.message}`);
    }
  }

  console.log("\n🎵 Uploading songs to Cloudinary + MySQL...");
  for (const song of songs) {
    try {
      const result = await uploadSong(song);
      console.log(`  ✅ Song: ${result.name} (${result.duration}) → album: ${result.album}`);
      await sleep(500);
    } catch (err) {
      console.error(`  ❌ Song failed [${song.name}]: ${err.response?.data?.message || err.message}`);
    }
  }

  console.log("\n🎉 Seeding complete! Open http://localhost:5175 to see all songs.");
}

seed();
