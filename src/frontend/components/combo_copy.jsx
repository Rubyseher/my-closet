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

  const filteredLinks = selectedCategory == "all" ? myntraLinks : myntraLinks()
  return (
    <div>
      <h2>What goes well with</h2>
      {imageUrl && <img src={imageUrl} alt="uploadedimg" width="200" />}

      {loading && <p>Loading suggestions.</p>}
      {error && <p>{error}</p>}

      {dominant && (
        <div>
          <code>{dominant}</code>
        </div>
      )}

      {palette?.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          {palette.map((hex, i) => (
            <div key={i} title={hex} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  background: hex,
                  border: "1px solid #ddd",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <h3>Suggested combinations</h3>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
