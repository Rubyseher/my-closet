import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ToggleButtons() {
  const [alignment, setAlignment] = React.useState("bottoms");

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
      sx={{
        borderRadius: "99px",
        backgroundColor: "#f3f4f6",
        padding: "4px",
        // remove the default group borders
        "& .MuiToggleButtonGroup-grouped": {
          margin: 0,
          border: "none",
          borderRadius: "999px !important",
        },
        "& .MuiToggleButton-root": {
          textTransform: "uppercase",
          fontWeight: 600,
          fontSize: "0.75rem",
          padding: "6px 18px",
          color: "#6b7280",
          border: "none",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
          },
          "&.Mui-selected": {
            backgroundColor: "#000000",
            color: "#ffffff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
          },
        },
      }}
      // style={{marginTop:'10px', borderRadius:'30px'}}
    >
      <ToggleButton value="tops" aria-label="tops">
        Tops
      </ToggleButton>
      <ToggleButton value="bottoms" aria-label="bottoms">
        Bottoms
      </ToggleButton>
      <ToggleButton value="shoes" aria-label="shoes">
        Shoes
      </ToggleButton>
      <ToggleButton value="accents" aria-label="accents">
        Accents
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
