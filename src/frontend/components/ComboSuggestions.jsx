import { useEffect, useState } from "react";
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

  if (!imageFile) return null;

  const filteredLinks = selectedCategory == "all" ? myntraLinks : myntraLinks.filter((l) => l.category === selectedCategory);

  const Colorlines = (label, hex) => {
    if (!hex) return null;
    return (
      <li className="combo-line">
        <span className="combo-label">{label}:</span>
        <span className="combo-chip" style={{ backgroundColor: hex }}></span>
        <span className="combo-hex">{hex}</span>
      </li>
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
          {
            combos && <>
            
            </>
          }
        </div>
      </div>
    </div>
  );
}
