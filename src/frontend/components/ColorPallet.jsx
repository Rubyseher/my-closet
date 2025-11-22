import { useState } from "react";
import "../styles/comboSuggestions.css";
import ToggleButtons from "./Utilities/ToggleButtons";
import MenWomanToggle from "./Utilities/MenWomanToggle";

export default function ColorPallet({ loading, error, combos, myntraLinks }) {
  const [selectedCategory, setSelectedCategory] = useState("tops");
  const filteredLinks = selectedCategory == "all" ? myntraLinks : myntraLinks.filter((l) => l.category === selectedCategory);
  const ColorLine = ({ label, name, hex }) => {
    if (!name) return null;
    return (
      <li className="combo-line">
        <span className="combo-label">{label}:</span>
        <span className="combo-chip" style={{ backgroundColor: hex }}></span>
        <span className="combo-hex">{name}</span>
      </li>
    );
  };

  return (
    <div className="details-card">
      {loading && <p className="status-text">Analyzing colours…</p>}
      {error && <p className="status-text error-text">{error}</p>}
      {combos && (
        <>
          <div className="flex mt-2.5">
            <ToggleButtons />
            <MenWomanToggle sx={{ m: 1 }} defaultChecked />
          </div>

          <h3 className="section-title">Suggested combinations</h3>
          <ul className="combos-list">
            {(combos.bottoms || []).map((item) => (
              <ColorLine key={`bottom-${item.hex}`} label="Bottoms" name={item.name} hex={item.hex} />
            ))}

            {(combos.shoes || []).map((item) => (
              <ColorLine key={`shoe-${item.hex}`} label="Shoes" name={item.name} hex={item.hex} />
            ))}

            {(combos.accents || []).map((item) => (
              <ColorLine key={`accent-${item.hex}`} label="Accent" name={item.name} hex={item.hex} />
            ))}
          </ul>
        </>
      )}

      {/* 🔽 NEW: Myntra section */}
      {myntraLinks.length > 0 && (
        <div className="myntra-section">
          <h3 className="section-title">Shop matching pieces</h3>

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
  );
}
