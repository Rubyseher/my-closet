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
        console.log("PALETTE:", palette);


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

        const hexes = Object.values(palette)
            .map(swatchToHex)
            .filter(Boolean);


        const dominant = hexes[0] || "#808080";

        const combos = combosFrom(dominant);
        const myntra = buildMyntraLinks(dominant, "women");

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

function combosFrom(hex) {
    const base = tinycolor(hex);
    return {
        complementary: base.complement().toHexString(),
        triad: base.triad().map((c) => c.toHexString()).slice(1),
        analogous: base.analogous().map((c) => c.toHexString()).slice(1, 4),
        monochrome: base.monochromatic().map((c) => c.toHexString()).slice(1, 4),
    };
}

function buildMyntraLinks(hex, gender = "women") {
  // Try to get a CSS color name from the hex
  let colorName = tinycolor(hex).toName(); // e.g. "beige", "tan"
  if (!colorName || colorName === "transparent") {
    colorName = "beige"; // safe default
  }

  const who = gender === "men" ? "men" : "women";
  const base = "https://www.myntra.com/search?q=";

  return [
    {
      category: "tops",
      url: `${base}${encodeURIComponent(`${colorName} ${who} top`)}`,
    },
    {
      category: "bottoms",
      url: `${base}${encodeURIComponent(`${colorName} ${who} jeans`)}`,
    },
    {
      category: "shoes",
      url: `${base}${encodeURIComponent(`${colorName} ${who} shoes`)}`,
    },
  ];
}

// --- start server ---
app.listen(4000, () => console.log("API on http://localhost:4000"));