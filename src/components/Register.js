import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(username, password);
      setMessage(res.data.message);
      setError("");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Registration failed. Username may already exist.");
      setMessage("");
      console.error(err);
    }
  };

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

      {/* REGISTER CARD */}
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
        <h2 style={{ marginBottom: "20px" }}>Register</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
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
              backgroundColor: "#28a745",
              color: "white",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer"
            }}
          >
            Register
          </button>
        </form>

        {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        <p style={{ marginTop: "18px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;