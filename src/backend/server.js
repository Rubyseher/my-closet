import express from "express";
import cors from "cors";
import multer from "multer";
import sharp from "sharp";
import {pickDominantSwatch,swatchToHex,fashionCombosFrom,buildMyntraLinks} from './utilities.js'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { Vibrant } = require("node-vibrant/node");

const app = express();

// 1) CORS ONLY
app.use(cors({ origin: "http://localhost:5173" }));
console.log(">>> RUNNING SERVER VERSION: v5 <<<");

// 2) Multer should be defined early
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

// 3) FILE ROUTE FIRST
app.post("/api/suggest/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "image required" });

    const thumbBuf = await sharp(req.file.buffer)
      .rotate()
      .resize({ width: 512, withoutEnlargement: true })
      .toBuffer();


    const hexes = [];

    // ---- NEW DOMINANT LOGIC ----
    const palette = await Vibrant.from(thumbBuf).getPalette();

    const mainSwatch = pickDominantSwatch(palette);
    const dominant = swatchToHex(mainSwatch) || "#808080";

    // CLEAN HEX for API
    const cleanHex = dominant.replace("#", "");

    // HIT TheColorAPI
    const schemeRes = await fetch(`https://www.thecolorapi.com/scheme?hex=${cleanHex}&mode=triad&count=5`);
    const schemeData = await schemeRes.json();

    // EXTRACT hexes only
    const colorApiPalette = schemeData.colors.map(c => c.hex.value);


    // ---- NEW FASHION COMBOS ----
    const combos = fashionCombosFrom(dominant, "women");

    // ---- UPDATED MYNTRA URL ----
    const myntra = buildMyntraLinks(dominant, "women");

    // ---- SEND RESPONSE ----
    res.json({
      dominantColor: dominant,
      palette: hexes,
      combos,
      myntra,
      colorApiPalette
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed to analyze image" });
  }
});


// 4) JSON parsing AFTER file uploads
app.use(express.json());
// --- start server ---
app.listen(4000, () => console.log("API on http://localhost:4000"));