import React, { useState } from "react";
import { predictSingle } from "../api";

export default function PredictionForm({ onPredict }) {
  const [features, setFeatures] = useState(Array(30).fill(0));

  const handleChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = parseFloat(value);
    setFeatures(newFeatures);
  };

  const handleSubmit = async () => {
    try {
      const res = await predictSingle(features);
      onPredict(res.data); // Send result to Dashboard
    } catch (err) {
      console.error("Prediction failed:", err);
      alert("Prediction failed");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Single Transaction Prediction</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "5px" }}>
        {features.map((f, idx) => (
          <input
            key={idx}
            type="number"
            placeholder={`Feature ${idx + 1}`}
            value={features[idx]}
            onChange={(e) => handleChange(idx, e.target.value)}
          />
        ))}
      </div>
      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>Predict</button>
    </div>
  );
}