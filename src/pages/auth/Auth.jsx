import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./Auth.css";

export default function Auth({ initialMode = "login", onBack, onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode);

  return (
    <div className="auth-container">
      <div className="auth-grid-overlay"></div>

      <div className="auth-card">
        {onBack && (
          <button
            type="button"
            className="auth-back-btn"
            onClick={onBack}
          >
            ← Back to Overview
          </button>
        )}

        <div className="auth-header">
          <div className="auth-badge-row">
            <span className="auth-system-badge">
              <span className="auth-status-dot"></span>
              AI-ACDS // SEC-GATEWAY
            </span>
            <span className="auth-enc-badge">TLS 1.3 / ENCRYPTED</span>
          </div>

          <h2 className="auth-title">
            {mode === "login" ? "Operator Authentication" : "Clearance Request"}
          </h2>
          <p className="auth-desc">
            {mode === "login"
              ? "Verify identity to access the autonomous defence control plane."
              : "Register your operator profile to request telemetry clearance."}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Terminal Login
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            New Clearance
          </button>
        </div>

        {mode === "login" ? (
          <Login
            onSwitchMode={(newMode) => setMode(newMode)}
            onSuccess={onAuthSuccess}
          />
        ) : (
          <Register
            onSwitchMode={(newMode) => setMode(newMode)}
            onSuccess={onAuthSuccess}
          />
        )}

        <div className="cyber-compliance-badge">
          <span>ZERO-TRUST</span>
          <span>•</span>
          <span>AI DEFENCE V2.4</span>
          <span>•</span>
          <span>AES-256</span>
        </div>
      </div>
    </div>
  );
}
