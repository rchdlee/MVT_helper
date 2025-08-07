import React, { useState } from "react";
import Papa from "papaparse";

function CsvReader() {
  const [csvData, setCsvData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true, // Set to false if your CSV doesn't have headers
      skipEmptyLines: true,
      complete: (results) => {
        console.log("Parsed CSV:", results.data);
        setCsvData(results.data);
      },
      error: (err) => {
        console.error("CSV parsing error:", err);
      },
    });
  };

  return (
    <div className="p-4">
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <pre>{JSON.stringify(csvData, null, 2)}</pre>
    </div>
  );
}

export default CsvReader;
