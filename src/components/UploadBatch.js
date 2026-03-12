import React, { useState } from "react";
import { predictBatch } from "../api";

export default function UploadBatch({ onBatchPredict }) {
  const [file, setFile] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [batchSummary, setBatchSummary] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file!");

    try {
      const res = await predictBatch(file); 
      const results = res.data.results || [];
      setBatchResults(results);

      // Calculate batch summary
      const summary = results.reduce(
        (acc, item) => {
          if (item.label.toLowerCase() === "fraud") acc.fraud += 1;
          else acc.legitimate += 1;
          return acc;
        },
        { fraud: 0, legitimate: 0 }
      );
      summary.total = results.length;
      setBatchSummary(summary);

      if (onBatchPredict) onBatchPredict();

      alert("Batch prediction completed!");
    } catch (err) {
      console.error("Batch prediction failed:", err);
      alert("Batch prediction failed!");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Batch Transaction Prediction</h3>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>Upload & Predict</button>

      {batchSummary && (
        <div style={{ marginTop: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h4>Batch Summary</h4>
          <p><strong>Total:</strong> {batchSummary.total}</p>
          <p><strong>Fraud:</strong> {batchSummary.fraud}</p>
          <p><strong>Legitimate:</strong> {batchSummary.legitimate}</p>
        </div>
      )}

      {batchResults.length > 0 && (
        <div style={{ marginTop: "15px", maxHeight: "300px", overflowY: "auto" }}>
          <h4>Batch Results</h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "5px" }}>Transaction ID</th>
                <th style={{ border: "1px solid #ccc", padding: "5px" }}>Label</th>
                <th style={{ border: "1px solid #ccc", padding: "5px" }}>Fraud Probability</th>
              </tr>
            </thead>
            <tbody>
              {batchResults.map((item, idx) => (
                <tr key={idx} style={{ backgroundColor: item.fraud_probability >= 0.8 ? "#ffe6e6" : "transparent" }}>
                  <td style={{ border: "1px solid #ccc", padding: "5px" }}>{item.transaction_id || idx + 1}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px" }}>{item.label}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px" }}>
                    {(item.fraud_probability * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}