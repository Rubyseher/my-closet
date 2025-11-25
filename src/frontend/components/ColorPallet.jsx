import { useState } from "react";
import "../styles/comboSuggestions.css";
import ToggleButtons from "./Utilities/ToggleButtons";
import MenWomanToggle from "./Utilities/MenWomanToggle";

export default function ColorPallet({ loading, error, combos, myntraLinks }) {
  const [selectedCategory, setSelectedCategory] = useState("shoes");
  const filteredLinks = myntraLinks.filter((l) => l.category === selectedCategory);
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

  const handleSelectedCategory = (v) => {
    console.log("in handleSelectedCategory ",v);
    setSelectedCategory(v);
  };

  return (
    <>
      <div className="details-card">
        {loading && <p className="status-text">Analyzing colours…</p>}
        {error && <p className="status-text error-text">{error}</p>}
        {combos && (
          <>
            <div className="flex mt-2.5">
              <ToggleButtons selectedCategory={selectedCategory} onChange={(v) => handleSelectedCategory(v)} />
              <MenWomanToggle sx={{ m: 1 }} defaultChecked />
            </div>

            <h3 className="section-title">Neutrals</h3>
            {selectedCategory && (
              <ul className="combos-list">
                {(combos[selectedCategory] || []).map((item) => (
                  <ColorLine key={`${selectedCategory}-${item.hex}`} label={`${selectedCategory}`} name={item.name} hex={item.hex} />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <div className="details-card">
        {/* 🔽 NEW: Myntra section */}
        {myntraLinks.length > 0 && (
          <div className="myntra-section">
            <h3 className="section-title">More Combinations</h3>

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
    </>
  );
}
