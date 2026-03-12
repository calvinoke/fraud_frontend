import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, Cell } from "recharts";

const HighRiskChart = ({ recent, batchResults }) => {
  const allTransactions = [...(recent || []), ...(batchResults || [])];

  const fraudCount = allTransactions.filter((t) => t.label.toLowerCase() === "fraud").length;
  const legitCount = allTransactions.filter((t) => t.label.toLowerCase() === "legitimate").length;

  const fraudRatio = fraudCount / (fraudCount + legitCount || 1); // avoid divide by 0

  const data = [
    {
      name: "Transactions",
      Fraud: fraudCount,
      Legitimate: legitCount,
    },
  ];

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>High-Risk Transactions Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Fraud">
            {data.map((entry, index) => (
              <Cell
                key={`cell-fraud-${index}`}
                fill={fraudRatio > 0.5 ? "#ff1a1a" : fraudRatio > 0.3 ? "#ff6666" : "#ff4d4f"}
              />
            ))}
          </Bar>
          <Bar dataKey="Legitimate" fill="#4caf50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HighRiskChart;