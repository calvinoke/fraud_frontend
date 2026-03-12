import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const FraudChart = ({ recent }) => {
  if (!recent || recent.length === 0) return null;

  // Prepare time series: last 10 transactions
  const data = recent.slice(-10).map((tx, idx) => ({
    name: `T${idx + 1}`,
    fraud_prob: tx.fraud_probability,
  }));

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Fraud Probability Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
          <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
          <Line
            type="monotone"
            dataKey="fraud_prob"
            stroke="#ff4d4f"
            strokeWidth={3}
            dot={(props) => {
              const { cx, cy, payload } = props;
              const color = payload.fraud_prob >= 0.8 ? "#ff1a1a" : payload.fraud_prob >= 0.5 ? "#ff6666" : "#4caf50";
              return <circle cx={cx} cy={cy} r={6} fill={color} stroke="#000" strokeWidth={1} />;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FraudChart;