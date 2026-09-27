import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRoleKey } from "../utils/rbac";

export default function AccessDenied({ userRole, resourceName = "this resource" }) {
  const navigate = useNavigate();
  const roleKey = getRoleKey(userRole);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "440px",
        padding: "40px 20px",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "rgba(239, 68, 68, 0.12)",
          border: "1px solid rgba(239, 68, 68, 0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f87171",
          marginBottom: "20px",
        }}
      >
        <ShieldAlert size={32} />
      </div>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#ffffff",
          margin: "0 0 10px 0",
          letterSpacing: "-0.4px",
        }}
      >
        Access Denied
      </h2>

      <p
        style={{
          fontSize: "14px",
          color: "rgba(255, 255, 255, 0.65)",
          maxWidth: "460px",
          lineHeight: "1.6",
          margin: "0 0 24px 0",
        }}
      >
        You do not have permission to access {resourceName}.
      </p>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          fontSize: "12px",
          color: "rgba(255, 255, 255, 0.5)",
          marginBottom: "28px",
        }}
      >
        <span>Active Operational Role:</span>
        <strong style={{ color: "#3ecfcf" }}>{userRole || "User"}</strong>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/dashboard/${roleKey}/home`)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 22px",
          background: "#3ecfcf",
          color: "#05080a",
          border: "none",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "0 4px 14px rgba(62, 207, 207, 0.25)",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#5eead4")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#3ecfcf")}
      >
        <ArrowLeft size={15} /> Return to Dashboard
      </button>
    </div>
  );
}
