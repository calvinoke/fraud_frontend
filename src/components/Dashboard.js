import React, { useEffect, useState, useCallback } from "react";
import StatsCards from "./StatsCards";
import FraudChart from "./FraudChart";
import HighRiskChart from "./HighRiskChart";
import RecentTransactions from "./RecentTransactions";
import PredictionForm from "./PredictionForm";
import PredictionResult from "./PredictionResult";
import UploadBatch from "./UploadBatch";
import { getStats, getRecent, fetchCurrentUser } from "../api";
import { connectWebSocket } from "./ws";

const Dashboard = () => {
  const [stats, setStats] = useState({ fraud: 0, legitimate: 0 });
  const [recent, setRecent] = useState([]);
  const [singlePrediction, setSinglePrediction] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [highRiskTransactions, setHighRiskTransactions] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [tickerItems, setTickerItems] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  // FETCH DASHBOARD DATA
  const fetchData = useCallback(async () => {
    try {
      const userRes = await fetchCurrentUser();
      setCurrentUser(userRes.data.username);

      const statsRes = await getStats();
      const recentRes = await getRecent();

      setStats(statsRes.data);
      setRecent(recentRes.data);

      const allTransactions = [...recentRes.data, ...batchResults];
      const count = allTransactions.filter(
        (t) => t.fraud_probability >= 0.8
      ).length;

      setAlertCount(count);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  }, [batchResults]);

  // INITIAL LOAD + WEBSOCKET
  useEffect(() => {
    fetchData();

    const ws = connectWebSocket((data) => {
      if (data.type === "new_prediction") {
        fetchData();

        if (data.fraud_probability >= 0.8) {
          setHighRiskTransactions((prev) => [data, ...prev]);

          setTickerItems((prev) => [
            {
              id: data.transaction_id || Date.now(),
              probability: data.fraud_probability,
            },
            ...prev,
          ]);

          setAlertCount((prev) => prev + 1);
        }
      }
    });

    return () => ws.close();
  }, [fetchData]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
          Fraud Detection Control Center
        </h1>

        <div>
          <span style={{ marginRight: "20px", fontWeight: "bold" }}>
            {currentUser && `Logged in as: ${currentUser}`}
          </span>

          {alertCount > 0 && (
            <div
              style={{
                display: "inline-block",
                backgroundColor: "red",
                color: "white",
                padding: "12px 18px",
                borderRadius: "50%",
                fontWeight: "bold",
                fontSize: "18px",
                animation: "pulse 1s infinite",
              }}
            >
              {alertCount}
            </div>
          )}
        </div>
      </div>

      {/* ALERT TICKER */}
      {tickerItems.length > 0 && (
        <div
          style={{
            marginTop: "10px",
            backgroundColor: "#ffe6e6",
            color: "#b30000",
            padding: "10px",
            borderRadius: "8px",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              display: "inline-block",
              animation: "tickerScroll 20s linear infinite",
            }}
          >
            {tickerItems.map((item) => (
              <span
                key={item.id}
                style={{ marginRight: "60px", fontWeight: "bold" }}
              >
                ⚠ Transaction {item.id} Fraud Probability:{" "}
                {(item.probability * 100).toFixed(2)}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {/* LEFT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* SINGLE PREDICTION */}
          <div
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <PredictionForm onPredict={setSinglePrediction} />
            <PredictionResult result={singlePrediction} />
          </div>

          {/* BATCH UPLOAD */}
          <div
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <UploadBatch
              onBatchPredict={(results) => {
                setBatchResults(results || []);
                fetchData();
              }}
            />
          </div>

          {/* RECENT TRANSACTIONS */}
          <div
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <RecentTransactions transactions={recent} />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* STATS */}
          <div
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <StatsCards stats={stats} />
          </div>

          {/* HIGH RISK CHART */}
          <div
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <HighRiskChart recent={recent} batchResults={batchResults} />
          </div>

          {/* FRAUD TREND CHART */}
          <div
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <FraudChart stats={stats} recent={recent} />
          </div>
        </div>
      </div>

      {/* HIGH RISK TRANSACTIONS */}
      {highRiskTransactions.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            border: "2px solid red",
            padding: "15px",
            borderRadius: "8px",
            background: "#ffe6e6",
          }}
        >
          <h3 style={{ color: "red" }}>⚠ High-Risk Transactions</h3>

          <ul>
            {highRiskTransactions.map((tx, idx) => (
              <li key={idx} style={{ fontWeight: "bold" }}>
                ID: {tx.transaction_id || idx + 1} – Probability:{" "}
                {(tx.fraud_probability * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ANIMATIONS */}
      <style>
        {`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        @keyframes tickerScroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        `}
      </style>
    </div>
  );
};

export default Dashboard;