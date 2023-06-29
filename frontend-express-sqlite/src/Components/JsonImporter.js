import React, { useRef } from 'react';

function JsonImporter(props) {
  const inputRef = useRef(null);

  const handleFileSelect = () => {
    inputRef.current.click();
  };

  const handleFileLoad = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const jsonData = JSON.parse(reader.result);
      props.onImport(jsonData);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        id="file-input"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleFileLoad}
      />
      <button className="Importar-btn" onClick={handleFileSelect}>Importar</button>
    </div>
  );
}

export default JsonImporter;
