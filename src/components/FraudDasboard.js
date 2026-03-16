import React, { useState, useEffect } from 'react';
import { predictBatch, getRecent, getStats } from '../api';
import { connectWebSocket } from '../ws';
import FraudChart from './FraudChart';

const FraudDashboard = () => {
  const [file, setFile] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [batchSummary, setBatchSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [stats, setStats] = useState({ fraud: 0, legitimate: 0 });
  const [loading, setLoading] = useState({
    batch: false,
    stats: false,
    recent: false
  });
  const [error, setError] = useState(null);

  // Format time display
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  // Fetch initial data
  useEffect(() => {
    fetchStats();
    fetchRecent();
    
    const ws = connectWebSocket(handleWebSocketMessage);
    return () => ws.close();
  }, []);

  const handleWebSocketMessage = (data) => {
    switch(data.type) {
      case 'new_prediction':
        fetchStats();
        fetchRecent();
        break;
      case 'batch_prediction':
        console.log(`Batch processed: ${data.total_transactions} transactions`);
        break;
      case 'recent_transactions':
        setRecent(data.transactions);
        break;
      default:
        break;
    }
  };

  const fetchStats = async () => {
    setLoading(prev => ({...prev, stats: true}));
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(prev => ({...prev, stats: false}));
    }
  };

  const fetchRecent = async () => {
    setLoading(prev => ({...prev, recent: true}));
    try {
      const res = await getRecent();
      setRecent(res.data);
    } catch (err) {
      setError('Failed to load recent transactions');
    } finally {
      setLoading(prev => ({...prev, recent: false}));
    }
  };

  const handleBatchUpload = async () => {
    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    setLoading(prev => ({...prev, batch: true}));
    setError(null);

    try {
      const res = await predictBatch(file);
      setBatchResults(res.data.results);
      
      const summary = {
        total: res.data.total_transactions,
        fraud: res.data.fraud_count,
        legitimate: res.data.total_transactions - res.data.fraud_count
      };
      setBatchSummary(summary);

      // Refresh stats and recent after batch upload
      await Promise.all([fetchStats(), fetchRecent()]);

    } catch (err) {
      setError(err.response?.data?.detail || 'Batch prediction failed');
    } finally {
      setLoading(prev => ({...prev, batch: false}));
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Fraud Detection Dashboard</h1>
      
      {/* Statistics Overview */}
      <div className="stats-section">
        <h2>Statistics</h2>
        {loading.stats ? (
          <p>Loading statistics...</p>
        ) : (
          <>
            <p>Total Fraud: {stats.fraud}</p>
            <p>Total Legitimate: {stats.legitimate}</p>
            <FraudChart stats={stats} recent={recent} />
          </>
        )}
      </div>

      {/* Batch Prediction */}
      <div className="batch-section">
        <h2>Batch Prediction</h2>
        <div className="upload-area">
          <input 
            type="file" 
            accept=".csv" 
            onChange={(e) => setFile(e.target.files[0])}
            disabled={loading.batch}
          />
          <button 
            onClick={handleBatchUpload}
            disabled={!file || loading.batch}
          >
            {loading.batch ? 'Processing...' : 'Upload & Predict'}
          </button>
        </div>

        {batchSummary && (
          <div className="batch-summary">
            <h3>Batch Summary</h3>
            <p>Total: {batchSummary.total}</p>
            <p>Fraud: {batchSummary.fraud}</p>
            <p>Legitimate: {batchSummary.legitimate}</p>
          </div>
        )}

        {batchResults.length > 0 && (
          <div className="batch-results">
            <h3>Detailed Results</h3>
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Label</th>
                  <th>Probability</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {batchResults.map((item) => (
                  <tr key={item.transaction_id} className={`risk-${item.risk.toLowerCase()}`}>
                    <td>{item.transaction_id}</td>
                    <td>{item.label}</td>
                    <td>{(item.fraud_probability * 100).toFixed(2)}%</td>
                    <td>{item.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="recent-section">
        <h2>Recent Transactions</h2>
        {loading.recent ? (
          <p>Loading recent transactions...</p>
        ) : (
          <ul>
            {recent.map((tx) => (
              <li key={tx.transaction_id}>
                <span className={`label-${tx.label.toLowerCase()}`}>{tx.label}</span>
                <span>{(tx.fraud_probability * 100).toFixed(2)}%</span>
                <span>{formatTime(tx.time)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FraudDashboard;