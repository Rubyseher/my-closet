import express from "express";
import cors from "cors";
import multer from "multer";
import sharp from "sharp";
import tinycolor from "tinycolor2";
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

    const palette = await Vibrant.from(thumbBuf).getPalette();

    const hexes = Object.values(palette)
      .map(swatchToHex)
      .filter(Boolean);

    // ---- NEW DOMINANT LOGIC ----
    const mainSwatch =
      palette.Vibrant ||
      palette.Muted ||
      palette.DarkVibrant ||
      palette.LightVibrant ||
      Object.values(palette)[0];

    const dominant = swatchToHex(mainSwatch) || "#808080";

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
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed to analyze image" });
  }
});


// 4) JSON parsing AFTER file uploads
app.use(express.json());

// --- helper functions ---
function swatchToHex(s) {
  if (!s) return null;

  // Handle newer Vibrant: swatches have .rgb array
  if (Array.isArray(s.rgb)) {
    const [r, g, b] = s.rgb;
    return tinycolor({ r, g, b }).toHexString();
  }

  // Older Vibrant versions
  if (typeof s.getHex === "function") {
    return s.getHex();
  }

  // If value is already a hex string
  if (typeof s.hex === "string") {
    return tinycolor(s.hex).toHexString();
  }

  // If there is _rgb (some builds)
  if (Array.isArray(s._rgb)) {
    const [r, g, b] = s._rgb;
    return tinycolor({ r, g, b }).toHexString();
  }

  // Last fallback
  return tinycolor(s).toHexString();
}


function fashionCombosFrom(hex, gender = "women") {
  const base = tinycolor(hex);
  const isDark = base.isDark();

  // Classic neutral bottoms – safe for both men & women
  const DARK_BOTTOMS = [
    "#111827", // near-black
    "#1f2937", // dark navy/charcoal
    "#374151", // slate
    "#1e3a8a", // navy
  ];

  const LIGHT_BOTTOMS = [
    "#e5e7eb", // light grey
    "#d1d5db", // mid grey
    "#f5f5f4", // off-white
    "#d1b892", // beige / chino
    "#c4a484", // khaki
  ];

  // Simple rule:
  // - if top is dark → suggest lighter/medium bottoms
  // - if top is light → suggest darker bottoms
  const bottoms = isDark ? LIGHT_BOTTOMS : DARK_BOTTOMS;

  // Shoe neutrals – basic sneaker & leather colours
  const shoes = [
    "#000000", // black
    "#4b5563", // dark grey
    "#f9fafb", // white / off-white
    "#e5e7eb", // light grey / sneaker
    "#b45309", // tan leather
    "#78350f", // dark brown leather
  ];

  // One accent colour: complementary but toned down
  const accent = base
    .complement()
    .desaturate(40)
    .darken(10)
    .toHexString();

  return {
    bottoms,
    shoes,
    accents: [accent],
  };
}


function makeMyntraUrl(colorName, who, itemType) {
  // slug part: beige-women-top
  const slug = `${colorName}-${who}-${itemType}`
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-"); // spaces → -

  // query part: beige%20women%20top
  const rawQuery = encodeURIComponent(`${colorName} ${who} ${itemType}`);

  return `https://www.myntra.com/${slug}?rawQuery=${rawQuery}`;
}


function buildMyntraLinks(hex, gender = "women") {
  // Try to get a CSS color name from the hex
  let colorName = tinycolor(hex).toName(); // e.g. "beige"
  if (!colorName || colorName === "transparent") {
    colorName = "beige"; // safe default
  }

  const who = gender === "men" ? "men" : "women";

  return [
    {
      category: "tops",
      url: makeMyntraUrl(colorName, who, "top"),
    },
    {
      category: "bottoms",
      url: makeMyntraUrl(colorName, who, "jeans"), // or "pants"
    },
    {
      category: "shoes",
      url: makeMyntraUrl(colorName, who, "shoes"),
    },
  ];
}


// --- start server ---
app.listen(4000, () => console.log("API on http://localhost:4000"));