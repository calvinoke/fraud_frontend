import React from "react";

const StatsCards = ({ stats }) => {

  const total = stats.fraud + stats.legitimate;
  const fraudRate = total ? ((stats.fraud / total) * 100).toFixed(2) : 0;

  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>

      <div style={{ border: "1px solid #ddd", padding: "20px" }}>
        <h3>Total Transactions</h3>
        <p>{total}</p>
      </div>

      <div style={{ border: "1px solid #ddd", padding: "20px" }}>
        <h3>Fraud Transactions</h3>
        <p>{stats.fraud}</p>
      </div>

      <div style={{ border: "1px solid #ddd", padding: "20px" }}>
        <h3>Fraud Rate</h3>
        <p>{fraudRate}%</p>
      </div>

    </div>
  );
};

export default StatsCards;