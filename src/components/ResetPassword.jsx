
// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/api/auth/reset-password/${token}`, { password });
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Reset failed. Link may be invalid or expired.");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="reset-header">Reset Password</h2>
      <form onSubmit={handleReset} className="reset-form">
        <input
          type="password"
          placeholder="Enter your new password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="reset-btn">Reset Password</button>
      </form>
      {message && <p style={{ color: "#fff" }}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
