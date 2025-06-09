
// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";

import "../css/ForgotPassword.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/auth/forgot-password", { email });
      setMessage("If that email exists, a reset link has been sent.");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="forgot-header">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="forgot-form">
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="forgot-btn">Send Reset Link</button>
      </form>
      {message && <p style={{ color: "#fff" }}>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
