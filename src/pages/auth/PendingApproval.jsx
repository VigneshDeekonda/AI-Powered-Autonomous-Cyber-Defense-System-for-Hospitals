import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

function PendingApproval() {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();

  useEffect(() => {
    if (!userProfile) return;

    if (userProfile.accountType === "admin") {
      navigate("/admin", { replace: true });
      return;
    }

    if (userProfile.approvalStatus === "approved") {
      navigate("/dashboard", { replace: true });
      return;
    }

    if (userProfile.approvalStatus === "rejected") {
      navigate("/account-rejected", { replace: true });
    }
  }, [userProfile, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="role-selection-wrapper" style={{ maxWidth: "620px" }}>
        <div className="role-selection-header" style={{ marginBottom: "26px" }}>
          <h1>Identity Verification Pending</h1>
          <p>
            Your AI-ACDS registration has been submitted and is currently waiting for verification by an administrator.
          </p>
        </div>

        <div className="auth-card login-terminal-card" style={{ textAlign: "center" }}>
          {userProfile?.fullName && (
            <div
              style={{
                background: "rgba(10, 16, 22, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
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
                  color: "rgba(255, 255, 255, 0.45)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "6px",
                }}
              >
                Registered User
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "4px",
                }}
              >
                {userProfile.fullName}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                {currentUser?.email}
              </div>
            </div>
          )}

          <p
            style={{
              fontSize: "13.5px",
              color: "rgba(255, 255, 255, 0.55)",
              lineHeight: "1.6",
              margin: "0 0 24px 0",
            }}
          >
            This page will update automatically once your account has been reviewed.
          </p>

          <button
            type="button"
            className="register-submit-btn"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default PendingApproval;