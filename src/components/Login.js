import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, fetchCurrentUser } from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchCurrentUser()
        .then(res => setCurrentUser(res.data.username))
        .catch(() => localStorage.removeItem("access_token"));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(username, password);
      localStorage.setItem("access_token", res.data.access_token);

      const userRes = await fetchCurrentUser();
      setCurrentUser(userRes.data.username);

      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
      console.error(err);
    }
  };

  if (currentUser) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial, sans-serif" }}>
        <h2>Welcome, {currentUser}!</h2>
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#0a2540",
          color: "white",
          padding: "20px",
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          letterSpacing: "1px"
        }}
      >
        AI Fraud Detection System
      </div>

      {/* LOGIN CONTAINER */}
      <div
        style={{
          background: "white",
          padding: "35px",
          marginTop: "80px",
          borderRadius: "10px",
          width: "380px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Login</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />

          <button
            type="submit"
            style={{
              padding: "12px",
              borderRadius: "6px",
              backgroundColor: "#007bff",
              color: "white",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer"
            }}
          >
            Login
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        <p style={{ marginTop: "18px" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;