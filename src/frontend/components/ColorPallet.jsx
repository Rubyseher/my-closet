import { useState } from "react";
import "../styles/comboSuggestions.css";
import ToggleButtons from "./Utilities/ToggleButtons";
import MenWomanToggle from "./Utilities/MenWomanToggle";

export default function ColorPallet({ loading, error, neutrals, myntraLinks, colorApiPalette }) {
  const [selectedCategory, setSelectedCategory] = useState("shoes");
  const [selectedMode, setSelectedMode] = useState("analogic");

  const categoryOptions = [
    { value: "tops", label: "Tops" },
    { value: "bottoms", label: "Bottoms" },
    { value: "shoes", label: "Shoes" },
  ];
  const modeOptions = [
    { value: "analogic", label: "Analog" },
    { value: "monochrome", label: "Monochrome" },
    { value: "quad", label: "Quad" },
    { value: "monochrome-dark", label: "Mono Dark" },
    { value: "monochrome-light", label: "Mono Light" },
    { value: "complement", label: "Complement" },
    { value: "analogic-complement", label: "Analog Complement" },
  ];

  const filteredLinks = myntraLinks.filter((l) => l.category === selectedCategory);
  const ColorLine = ({ name, hex }) => {
    if (!name) return null;
    return (
      <li className="combo-line">
        <span className="combo-chip" style={{ backgroundColor: hex }}></span>
        <span className="combo-hex">{name}</span>
      </li>
    );
  };

  return (
    <>
      <div className="details-card">
        {loading && <p className="status-text">Analyzing colours…</p>}
        {error && <p className="status-text error-text">{error}</p>}
        {neutrals && (
          <>
            <div className="flex mt-2.5">
              <ToggleButtons value={selectedCategory} options={categoryOptions} onChange={(v) => setSelectedCategory(v)} />
              <MenWomanToggle sx={{ m: 1 }} defaultChecked />
            </div>

            <h3 className="section-title">Neutrals</h3>
            {selectedCategory && (
              <ul className="combos-list">
                {(neutrals[selectedCategory] || []).map((item) => (
                  <ColorLine key={`${selectedCategory}-${item.hex}`} name={item.name} hex={item.hex} />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <div className="details-card details-card--full">
        {/* 🔽 NEW: Myntra section */}
        {myntraLinks.length > 0 && (
          <div className="myntra-section ">
            <h3 className="section-title">
              More Combinations
              <ToggleButtons value={selectedMode} options={modeOptions} onChange={(v) => setSelectedMode(v)} />
            </h3>
          </div>
        )}
      </div>
      <div className="details-card details-card--full">
        {/* 🔽 NEW: Myntra section */}
        {myntraLinks.length > 0 && (
          <div className="myntra-section ">
            <h3 className="section-title">links</h3>

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
