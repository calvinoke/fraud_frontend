import React, { useState } from "react";

// ✅ Import the single transaction API
import { predictSingle } from "../api";

const TransactionForm = ({ onPrediction }) => {
  const [features, setFeatures] = useState(Array(30).fill(""));

  const handleChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericFeatures = features.map(Number);

    try {
      await predictSingle(numericFeatures);

      // Callback to update stats and charts
      onPrediction();
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Error submitting transaction");
    }
  };

  return (
    <div>
      <h2>Transaction Input</h2>
      <form onSubmit={handleSubmit}>
        {features.map((value, index) => (
          <div key={index}>
            <label>Feature {index + 1}</label>
            <input
              type="number"
              step="any"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              required
            />
          </div>
        ))}

        <button type="submit">Predict Fraud</button>
      </form>
    </div>
  );
};

export default TransactionForm;