import tinycolor from "tinycolor2";

function pickDominantSwatch(palette) {
  const swatches = Object.values(palette).filter(Boolean);
  if (!swatches.length) return null;

  return swatches.reduce((best, s) => {
    if (!best) return s;
    return s.population > best.population ? s : best;
  }, null);
}

function fetchColorSchemes(cleanHex) {
  let COLOR_API_MODES = ["monochrome", "monochrome-dark", "monochrome-light", "analogic", "complement", "analogic-complement", "triad", "quad"]
  COLOR_API_MODES.forEach((item, index) => {
    const schemeRes = await fetch(`https://www.thecolorapi.com/scheme?hex=${cleanHex}&mode=${item}&count=5`);
    const schemeData = await schemeRes.json();
    
  })
}

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

function simpleColorName(hex) {
  const c = tinycolor(hex).toHsl();
  if (!c) return "neutral";

  // Very low saturation = grey scale
  if (c.s < 0.2) {
    if (c.l < 0.25) return "black";
    if (c.l > 0.75) return "white";
    return "grey";
  }

  const h = c.h; // 0–360

  let base;
  if (h < 15 || h >= 345) base = "red";
  else if (h < 45) base = "orange";
  else if (h < 70) base = "yellow";
  else if (h < 160) base = "green";
  else if (h < 200) base = "teal";
  else if (h < 250) base = "blue";
  else if (h < 290) base = "purple";
  else if (h < 330) base = "pink";
  else base = "brown";

  // add light/dark prefix
  if (c.l < 0.3) return `dark ${base}`;
  if (c.l > 0.7) return `light ${base}`;
  return base;
}


function fashionCombosFrom(hex, gender = "women") {
  const base = tinycolor(hex);
  const hsl = base.toHsl();
  const isDark = base.isDark();
  const isPastel = hsl.l > 0.65 && hsl.s > 0.2; // light & a bit colorful

  // Neutrals for bottoms
  const DARK_NEUTRALS = [
    "#111827", // near black
    "#1f2937", // charcoal
    "#0f172a", // deep navy
  ];

  const MID_NEUTRALS = [
    "#4b5563", // slate
    "#6b7280", // grey
    "#1d4ed8", // cobalt / denim-ish blue
  ];

  const LIGHT_NEUTRALS = [
    "#f9fafb", // almost white
    "#e5e7eb", // light grey
    "#f5f5f4", // warm off-white
    "#d1b892", // beige
  ];
  // --- TOPS LOGIC ---
  const TOP_NEUTRALS = [
    "#ffffff",   // white
    "#f5f5f4",   // off-white
    "#e5e7eb",   // light grey
    "#111827",   // black
  ];

  const harmoniousTop = base
    .clone()
    .lighten(20)
    .desaturate(20)
    .toHexString();

  const contrastTop = base
    .clone()
    .complement()
    .desaturate(20)
    .lighten(5)
    .toHexString();

  const mutedEarthTop = tinycolor.mix(base, "#c4a484", 40).toHexString(); // beige/sand mix

  const tops = [
    ...TOP_NEUTRALS.map((h) => ({ hex: h, name: simpleColorName(h) })),
    { hex: harmoniousTop, name: simpleColorName(harmoniousTop) },
    { hex: contrastTop, name: simpleColorName(contrastTop) },
    { hex: mutedEarthTop, name: simpleColorName(mutedEarthTop) },
  ];

  // --- BOTTOMS LOGIC ---
  let bottomHexes;

  if (isDark) {
    // Dark top → suggest light & mid bottoms, with one dark option
    bottomHexes = [
      LIGHT_NEUTRALS[0], // near white
      LIGHT_NEUTRALS[2], // off white
      MID_NEUTRALS[0],   // slate
      MID_NEUTRALS[1],   // grey
      DARK_NEUTRALS[2],  // navy
    ];
  } else if (isPastel) {
    // Soft/pastel top (like your pink example)
    bottomHexes = [
      DARK_NEUTRALS[2],  // navy
      MID_NEUTRALS[0],   // slate
      LIGHT_NEUTRALS[1], // light grey
      LIGHT_NEUTRALS[3], // beige
      LIGHT_NEUTRALS[0], // clean light
    ];
  } else {
    // Mid-tone top → balanced mix
    bottomHexes = [
      DARK_NEUTRALS[1],  // charcoal
      MID_NEUTRALS[0],   // slate
      MID_NEUTRALS[2],   // denim blue
      LIGHT_NEUTRALS[1], // light grey
      LIGHT_NEUTRALS[2], // off white
    ];
  }

  // One color bottom based on top: darker & desaturated
  const toneOnToneBottom = base
    .clone()
    .darken(25)
    .desaturate(35)
    .toHexString();
  bottomHexes.push(toneOnToneBottom);

  const bottoms = bottomHexes.map((h) => ({
    hex: h,
    name: simpleColorName(h),
  }));

  // --- SHOES LOGIC ---
  // Neutral shoes that work with most outfits
  const SHOE_NEUTRALS = [
    "#111827", // black
    "#4b5563", // charcoal
    "#f5f5f4", // off white / cream (softer than pure white)
    "#e5e7eb", // light grey
    "#d1b892", // beige / tan
    "#92400e", // rich brown
  ];

  // One shoe that softly echoes the top colour (for people who like matching)
  const shoeMatchTop = base
    .clone()
    .desaturate(40)
    .darken(5)
    .toHexString();

  const shoeHexes = [...SHOE_NEUTRALS, shoeMatchTop];

  const shoes = shoeHexes.map((h) => ({
    hex: h,
    name: simpleColorName(h),
  }));


  return {
    tops, // you can fill this later if needed
    bottoms,
    shoes,
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
  const who = gender === "men" ? "men" : "women";

  const colorName = simpleColorName(hex); // e.g. "dark green", "black", "beige"

  return [
    {
      category: "tops",
      url: makeMyntraUrl(colorName, who, "top"),
    },
    {
      category: "bottoms",
      url: makeMyntraUrl(colorName, who, "jeans"),
    },
    {
      category: "shoes",
      url: makeMyntraUrl(colorName, who, "shoes"),
    },
  ];
}
export { pickDominantSwatch, swatchToHex, fashionCombosFrom, buildMyntraLinks, fetchColorSchemes };
