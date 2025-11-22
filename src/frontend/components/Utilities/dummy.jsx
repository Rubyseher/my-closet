import { useEffect, useState } from "react";
import "../styles/comboSuggestions.css";
// import shirt from '../../assets/shirt.png'

export default function ComboSuggestions({ imageFile }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [dominant, setDominant] = useState(null);
  const [palette, setPalette] = useState([]);
  const [combos, setCombos] = useState(null);
  const [myntraLinks, setMyntraLinks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchColor, setSearchColor] = useState(null);

  // 1) Preview effect
  useEffect(() => {
    if (!imageFile) return;
    const newUrl = URL.createObjectURL(imageFile);
    setImageUrl(newUrl);
    // cleanup function runs when imageFile changes or component unmounts
    return () => {
      URL.revokeObjectURL(newUrl);
    };
  }, [imageFile]);

  useEffect(() => {
    if (!imageFile) return;

    async function send() {
      setLoading(true);
      setError(null);
      setSuggestions([]);
      setDominant(null);
      setPalette([]);
      setCombos(null);
      setMyntraLinks([]);

      try {
        const formData = new FormData();
        formData.append("image", imageFile, imageFile.name);
        // quick debug: confirm the key/value
        for (const [k, v] of formData.entries()) {
          console.log("FD:", k, v instanceof File ? v.name : v);
        }
        console.log("sending:", imageFile?.name, imageFile?.type, imageFile?.size);

        const res = await fetch("http://localhost:4000/api/suggest/image", {
          method: "POST",
          body: formData, // do NOT set Content-Type
        });

        const data = await res.json().catch(() => ({}));
        console.log("API data:", data);
        if (!res.ok) throw new Error(data.error || `Http.${res.status}`);

        setDominant(data.dominantColor);
        setPalette(Array.isArray(data.palette) ? data.palette : []);
        setCombos(data.combos || null);
        setMyntraLinks(Array.isArray(data.myntra) ? data.myntra : []);
      } catch (e) {
        setError(e.message || "Couldn’t get suggestions.");
      } finally {
        setLoading(false);
      }
    }

    send();
  }, [imageFile]);

  useEffect(() => {
  if (combos && combos.bottoms && combos.bottoms.length > 0) {
    setSearchColor(combos.bottoms[0].name); // e.g. "dark blue"
  }
}, [combos]);


  if (!imageFile) return null;

  const filteredLinks = selectedCategory == "all" ? myntraLinks : myntraLinks.filter((l) => l.category === selectedCategory);

  function uniqueByName(list = []) {
    const map = new Map();
    for (const item of list) {
      if (!map.has(item.name)) {
        map.set(item.name, item);
      }
    }
    return Array.from(map.values());
  }
  const uniqueBottoms = uniqueByName(combos.bottoms);
  const uniqueShoes = uniqueByName(combos.shoes);
  const uniqueAccents = uniqueByName(combos.accents);

  const ColorLine = ({ label, hex, text }) => {
    if (!hex) return null;
    return (
      <li className="combo-line">
        <span className="combo-label">{label}:</span>
        <span className="combo-chip" style={{ backgroundColor: hex }}></span>
        <span className="combo-hex">{text || hex}</span>
      </li>
    );
  };

  const CategoryPill = ({ label, value, selected, onClick }) => {
    return (
      <button type="button" className={"category-pill" + (selected ? "category-pill--active" : "")} onClick={() => onClick(value)}>
        {label}
      </button>
    );
  };

  return (
    <div className="combo-container">
      <h2 className="combo-title">What goes well with</h2>

      <div className="combo-layout">
        {/* LEFT SIDE: image + palette */}
        <div className="preview-card">
          {imageUrl && <img src={imageUrl} alt="Uploaded clothing" className="preview-image" />}

          {dominant && (
            <div className="dominant-row">
              <span className="dominant-label">Dominant colour</span>
              <div className="color-chip-big" style={{ backgroundColor: dominant }} />
              <span className="hex-text">{dominant}</span>
            </div>
          )}
          {palette.length > 0 && (
            <div className="palette-row">
              {palette.map((hex) => (
                <div key={hex} className="palette-chip-wrapper">
                  <div className="color-chip" style={{ backgroundColor: hex }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: combos + Myntra */}
        <div className="details-card">
          {loading && <p className="status-text">Analyzing colours…</p>}
          {error && <p className="status-text error-text">{error}</p>}
          {combos && (
            <>
              <h3 className="section-title">Suggested combinations</h3>
              <ul className="combos-list">
                {uniqueBottoms.map((item) => (
                  <ColorLine
                    key={`bottom-${item.name}`}
                    label="Bottoms"
                    hex={item.hex}
                    text={item.name}
                    // we'll add onClick in the next step
                  />
                ))}

                {uniqueShoes.map((item) => (
                  <ColorLine key={`shoe-${item.name}`} label="Shoes" hex={item.hex} text={item.name} />
                ))}

                {uniqueAccents.map((item) => (
                  <ColorLine key={`accent-${item.name}`} label="Accent" hex={item.hex} text={item.name} />
                ))}
              </ul>
            </>
          )}

          {/* 🔽 NEW: Myntra section */}
          {myntraLinks.length > 0 && (
            <div className="myntra-section">
              <h3 className="section-title">Shop matching pieces</h3>

              <div className="pill-row">
                <CategoryPill label="All" value="all" selected={selectedCategory === "all"} onClick={setSelectedCategory} />
                <CategoryPill label="Tops" value="tops" selected={selectedCategory === "tops"} onClick={setSelectedCategory} />
                <CategoryPill label="Bottoms" value="bottoms" selected={selectedCategory === "bottoms"} onClick={setSelectedCategory} />
                <CategoryPill label="Dresses" value="dresses" selected={selectedCategory === "dresses"} onClick={setSelectedCategory} />
              </div>

              <div className="myntra-list">
                {filteredLinks.map((item) => (
                  <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className="myntra-card">
                    <p className="myntra-title">{item.title}</p>
                    {item.category && <span className="myntra-category-tag">{item.category}</span>}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
