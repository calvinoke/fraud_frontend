import React, { useEffect, useState } from "react";
import FraudChart from "../components/FraudChart";

// ✅ Import the API functions
import { getStats, getRecent } from "../api";
import { connectWebSocket } from "../ws";

const FraudDashboard = () => {
  const [stats, setStats] = useState({ fraud: 0, legitimate: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetchData();

    const ws = connectWebSocket((data) => {
      if (data.type === "new_prediction") fetchData();
    });

    return () => ws.close();
  }, []);

  const fetchData = async () => {
    const s = await getStats();
    const r = await getRecent();
    setStats(s.data);
    setRecent(r.data);
  };

  return (
    <div>
      <h2>Fraud Detection Analytics</h2>

      {/* Stats */}
      <p>Fraud: {stats.fraud} | Legitimate: {stats.legitimate}</p>

      {/* Charts */}
      <FraudChart stats={stats} recent={recent} />

      {/* Recent Transactions */}
      <h3>Recent Transactions</h3>
      <ul>
        {recent.map((r) => (
          <li key={r.id}>
            {r.label} – {(r.probability * 100).toFixed(2)}% – {r.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FraudDashboard;