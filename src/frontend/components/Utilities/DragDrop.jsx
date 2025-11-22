import React, { useState } from "react";
import "../../styles/DragDrop.css";
import { FileUploader } from "react-drag-drop-files";
import ComboSuggestions from "../ComboSuggestions";
const fileTypes = ["JPG", "PNG", "GIF"];

function DragDrop() {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };

  return (
    <div>
      <div className="upload-container px-8 sm:px-0">
        <div className="upload-box -mt-40 sm:-mt-12 w-[900px]">
          <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
        </div>
      </div>
      {file && <ComboSuggestions imageFile={file} />}
    </div>
  );
}

export default DragDrop;
