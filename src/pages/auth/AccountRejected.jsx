import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

function AccountRejected() {
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="role-selection-wrapper" style={{ maxWidth: "620px" }}>
        <div className="role-selection-header" style={{ marginBottom: "26px" }}>
          <h1>Access Request Rejected</h1>
          <p>
            Your request for access to the AI-ACDS system was not approved by an administrator.
          </p>
        </div>

        <div className="auth-card login-terminal-card" style={{ textAlign: "center" }}>
          {userProfile?.rejectionReason && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                borderRadius: "10px",
                padding: "16px 20px",
                textAlign: "left",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#f87171",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "6px",
                }}
              >
                Reason for Rejection
              </div>
              <div
                style={{
                  fontSize: "13.5px",
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: "1.5",
                }}
              >
                {userProfile.rejectionReason}
              </div>
            </div>
          )}

          <button
            type="button"
            className="register-submit-btn"
            style={{
              background: "#ef4444",
              color: "#ffffff",
              boxShadow: "0 4px 14px rgba(239, 68, 68, 0.3)",
            }}
            onClick={handleLogout}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountRejected;