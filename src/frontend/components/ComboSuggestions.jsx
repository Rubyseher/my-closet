import { useEffect, useRef, useState } from "react";
import "../styles/comboSuggestions.css";
import DominantColor from "./DominantColor";
import ColorPallet from "./ColorPallet";
import useClosetHistory from "./Utilities/useClosetHistory";

export default function ComboSuggestions({ imageFile }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [colorApiPalette, setColorApiPalette] = useState({});
  const [dominant, setDominant] = useState(null);
  const [palette, setPalette] = useState([]);
  const [neutrals, setNeutrals] = useState(null);
  const [myntraLinks, setMyntraLinks] = useState([]);
  const { addHistory } = useClosetHistory();
  const previewImage = useRef(null);
  const historyIdRef = useRef(null);

  // 1) Preview effect
  useEffect(() => {
    if (!imageFile) return;
    const newId = (crypto?.randomUUID && crypto.randomUUID()) || `${imageFile.name}-${imageFile.lastModified}`;
    const newUrl = URL.createObjectURL(imageFile);
    historyIdRef.current = newId;
    previewImage.current = newUrl;
    setImageUrl(newUrl);

    // Immediately add to sidebar history with the preview URL
    addHistory({
      id: newId,
      label: imageFile.name || "Upload",
      imageSrc: newUrl,
      dominantColor: null,
      createdAt: new Date().toISOString(),
    });

    // cleanup function runs when imageFile changes or component unmounts
    return () => {
      URL.revokeObjectURL(newUrl);
      previewImage.current = null;
      historyIdRef.current = null;
    };
  }, [imageFile]);

  useEffect(() => {
    if (!imageFile) return;

    async function send() {
      setLoading(true);
      setError(null);
      setColorApiPalette({});
      setDominant(null);
      setPalette([]);
      setNeutrals(null);
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
        setColorApiPalette(data.colorApiPalette || {});
        setPalette(Array.isArray(data.palette) ? data.palette : []);
        setNeutrals(data.combos || null);
        setMyntraLinks(Array.isArray(data.myntra) ? data.myntra : []);

        const id = historyIdRef.current || (crypto?.randomUUID && crypto.randomUUID()) || `${imageFile.name}-${imageFile.lastModified}`;

        addHistory({
          id,
          label: imageFile.name || "Upload",
          imageSrc: previewImage.current,
          dominantColor: data.dominantColor || data.dominant,
          createdAt: new Date().toISOString(),
        });
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
        <ColorPallet loading={loading} error={error} colorApiPalette={colorApiPalette} neutrals={neutrals} myntraLinks={myntraLinks} />
      </div>
    </div>
  );
}
