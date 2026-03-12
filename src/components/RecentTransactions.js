import React from "react";

const RecentTransactions = ({ transactions }) => {

  return (
    <div>

      <h3>Recent Transactions</h3>

      <table border="1">

        <thead>
          <tr>
            <th>ID</th>
            <th>Label</th>
            <th>Probability</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.label}</td>
              <td>{(tx.probability * 100).toFixed(2)}%</td>
              <td>{tx.time}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default RecentTransactions;