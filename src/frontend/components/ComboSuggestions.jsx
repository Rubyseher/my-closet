import { useEffect, useState } from "react";
import "../styles/comboSuggestions.css";
import DominantColor from "./DominantColor";
import ColorPallet from "./ColorPallet";

export default function ComboSuggestions({ imageFile }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [dominant, setDominant] = useState(null);
  const [palette, setPalette] = useState([]);
  const [combos, setCombos] = useState(null);
  const [myntraLinks, setMyntraLinks] = useState([]);

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
        console.log("combo is ", data.combos || null);

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

  return (
    <div className="combo-container">
      <h2 className="combo-title">What goes well with</h2>

      <div className="combo-layout">
        {/* LEFT SIDE: image + palette */}
        <DominantColor imageUrl={imageUrl} dominant={dominant} palette={palette} />

        {/* RIGHT SIDE: combos + Myntra */}
        <ColorPallet loading={loading} error={error} suggestions={suggestions} combos={combos} myntraLinks={myntraLinks}/>
      
      </div>
    </div>
  );
}
