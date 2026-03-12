import React, { useState } from "react";
import axios from "axios";

// -------------------------
// 1. Base URL & Axios Instance
// -------------------------
const API_BASE = "http://localhost:8000";

// Helper to get token from localStorage
const getToken = () => localStorage.getItem("access_token");

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------
// 2. AUTHENTICATION
// -------------------------

// Updated login to use JSON body instead of URL params
export const loginUser = (username, password) => {
  return axios.post(`${API_BASE}/login`, {
    username,
    password,
  });
};

// Updated register to use JSON body
export const registerUser = (username, password) => {
  return axios.post(`${API_BASE}/register`, {
    username,
    password,
  });
};

// -------------------------
// 3. CURRENT USER
// -------------------------
export const fetchCurrentUser = () => api.get("/me");

// -------------------------
// 4. GET FRAUD STATS
// -------------------------
export const getStats = () => api.get("/stats");

// -------------------------
// 5. GET RECENT TRANSACTIONS
// -------------------------
export const getRecent = () => api.get("/recent");

// -------------------------
// 6. PREDICT SINGLE TRANSACTION
// -------------------------
export const predictSingle = (features) => api.post("/predict", features);

// -------------------------
// 7. PREDICT BATCH TRANSACTIONS (CSV)
// -------------------------
export const predictBatch = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/predict-batch", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// -------------------------
// 8. PREDICT REAL-TIME STREAM (Kafka)
// -------------------------
export const predictStream = (features) => api.post("/predict-stream", features);