import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, fetchCurrentUser } from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const validateForm = () => {
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const res = await loginUser(username, password);
      localStorage.setItem("access_token", res.data.access_token);

      const userRes = await fetchCurrentUser();
      setCurrentUser(userRes.data.username);

      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
      console.error(err);
    } finally {
      setLoading(false);
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
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: error.includes("Username") ? "1px solid red" : "1px solid #ccc"
            }}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
              style={{
                padding: "10px",
                borderRadius: "6px",
                width: "100%",
                border: error.includes("Password") ? "1px solid red" : "1px solid #ccc"
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              borderRadius: "6px",
              backgroundColor: loading ? "#6c757d" : "#007bff",
              color: "white",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            )}
            {loading ? "Logging in..." : "Login"}
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