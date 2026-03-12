import React from "react";

const PredictionResult = ({ result }) => {
  if (!result) return null;

  const isHighRisk = result.fraud_probability >= 0.8;

  return (
    <div
      style={{
        marginTop: "15px",
        padding: "10px",
        border: `2px solid ${isHighRisk ? "red" : "#ccc"}`,
        borderRadius: "8px",
        backgroundColor: isHighRisk ? "#ffe6e6" : "#f9f9f9",
      }}
    >
      <h3>Prediction Result</h3>
      <p><strong>Label:</strong> {result.label}</p>
      <p>
        <strong>Fraud Probability:</strong> {(result.fraud_probability * 100).toFixed(2)}%
      </p>
      {isHighRisk && <p style={{ color: "red", fontWeight: "bold" }}>⚠ High-Risk Transaction!</p>}
    </div>
  );
};

export default PredictionResult;