// TransactionForm.jsx
import React, { useState } from "react";
import { predictSingle } from "../api";

// Import feature names from your pipeline
const featureNames = [
  "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10",
  "V11", "V12", "V13", "V14", "V15", "V16", "V17", "V18", "V19", "V20",
  "V21", "V22", "V23", "V24", "V25", "V26", "V27", "V28", "Amount", "Time"
];

const TransactionForm = ({ onPrediction }) => {
  const [features, setFeatures] = useState(Array(30).fill(0));

  const handleChange = (index, value) => {
    const updated = [...features];
    updated[index] = parseFloat(value) || 0;
    setFeatures(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all features are numbers
    if (features.some(isNaN)) {
      alert("Please enter valid numbers for all features");
      return;
    }

    try {
      const response = await predictSingle(features);
      onPrediction(response.data);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Error submitting transaction");
    }
  };

  return (
    <div className="transaction-form">
      <h2>Transaction Input</h2>
      <form onSubmit={handleSubmit}>
        <div className="feature-grid">
          {features.map((value, index) => (
            <div className="feature-input" key={index}>
              <label>{featureNames[index]}</label>
              <input
                type="number"
                step="any"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                required
              />
            </div>
          ))}
        </div>
        <button type="submit">Predict Fraud</button>
      </form>
    </div>
  );
};

export default TransactionForm;