import { useState } from "react";
import {
  ArrowLeft,
  ShieldAlert,
  Activity,
  Cpu,
  Terminal,
  FileCheck2,
  Lock,
  Unlock,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Layers,
  Share2,
  Download,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export default function IncidentInvestigationView({
  alert,
  onBack,
  onUpdateStatus,
}) {
  const [currentAlert, setCurrentAlert] = useState(alert);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [reportGenerated, setReportGenerated] = useState(false);

  if (!currentAlert) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#ffffff" }}>
        <h3>No incident selected for investigation</h3>
        <button
          type="button"
          onClick={onBack}
          style={{
            marginTop: "16px",
            padding: "10px 18px",
            background: "#3ecfcf",
            color: "#05080a",
            border: "none",
            borderRadius: "8px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Return to Alerts
        </button>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    setStatusUpdating(true);
    setTimeout(() => {
      const updated = { ...currentAlert, detectionStatus: newStatus };
      setCurrentAlert(updated);
      if (onUpdateStatus) {
        onUpdateStatus(currentAlert.id, newStatus);
      }
      setStatusUpdating(false);
      setActionMessage(`Alert status updated to "${newStatus}"`);
      setTimeout(() => setActionMessage(""), 4000);
    }, 400);
  };

  const handleTriggerQuarantine = () => {
    setActionMessage("Automated VLAN quarantine confirmed and enforced by AI engine.");
    setTimeout(() => setActionMessage(""), 5000);
  };

  const handleGenerateReport = () => {
    setReportGenerated(true);
    setActionMessage("HIPAA-compliant clinical cybersecurity incident dossier compiled.");
    setTimeout(() => setActionMessage(""), 5000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", textAlign: "left" }}>
      {/* Top Navigation & Status Notification */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            color: "#3ecfcf",
            fontSize: "13.5px",
            fontWeight: 600,
            cursor: "pointer",
            padding: 0,
          }}
        >
          <ArrowLeft size={16} /> Back to Security Alerts Queue
        </button>

        {actionMessage && (
          <div
            style={{
              background: "rgba(62, 207, 207, 0.12)",
              border: "1px solid rgba(62, 207, 207, 0.35)",
              color: "#3ecfcf",
              fontSize: "12.5px",
              padding: "6px 14px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <CheckCircle2 size={14} /> {actionMessage}
          </div>
        )}
      </div>

      {/* Main Incident Overview Header Card */}
      <div
        style={{
          background: "#0a0f14",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "24px 28px",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* Top Metadata Row: ID, Severity, Status, Risk, and Timestamp */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* Badges on the left */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "13px",
                fontWeight: 700,
                color: "#3ecfcf",
                background: "rgba(62, 207, 207, 0.1)",
                border: "1px solid rgba(62, 207, 207, 0.25)",
                padding: "4px 10px",
                borderRadius: "6px",
              }}
            >
              {currentAlert.id}
            </span>

            <span
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "11.5px",
                fontWeight: 700,
                textTransform: "uppercase",
                background:
                  currentAlert.severity === "Critical"
                    ? "rgba(239, 68, 68, 0.14)"
                    : currentAlert.severity === "High"
                    ? "rgba(249, 115, 22, 0.14)"
                    : "rgba(234, 179, 8, 0.14)",
                color:
                  currentAlert.severity === "Critical"
                    ? "#f87171"
                    : currentAlert.severity === "High"
                    ? "#fb923c"
                    : "#facc15",
                border:
                  currentAlert.severity === "Critical"
                    ? "1px solid rgba(239, 68, 68, 0.35)"
                    : "1px solid rgba(249, 115, 22, 0.35)",
              }}
            >
              {currentAlert.severity}
            </span>

            <span
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "11.5px",
                fontWeight: 600,
                background: "rgba(56, 189, 248, 0.14)",
                color: "#38bdf8",
                border: "1px solid rgba(56, 189, 248, 0.35)",
              }}
            >
              {currentAlert.detectionStatus}
            </span>

            <span
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "11.5px",
                fontWeight: 700,
                background: "rgba(255, 255, 255, 0.05)",
                color: currentAlert.riskScore >= 90 ? "#f87171" : "#fb923c",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              Risk: {currentAlert.riskScore}/100
            </span>
          </div>

          {/* Timestamp on the right */}
          <div
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.45)",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Clock size={13} /> {currentAlert.timestamp}
          </div>
        </div>

        {/* Threat Title & Description - Left Aligned */}
        <div style={{ textAlign: "left" }}>
          <h1
            style={{
              margin: "0 0 6px 0",
              fontSize: "22px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.3px",
              textAlign: "left",
            }}
          >
            {currentAlert.threatType}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "13.5px",
              lineHeight: "1.6",
              color: "rgba(255, 255, 255, 0.65)",
              textAlign: "left",
              maxWidth: "960px",
            }}
          >
            {currentAlert.description}
          </p>
        </div>
      </div>

      {/* 2-Column Grid: Target Asset Metadata + AI Causal Analysis */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Left Column: Affected Hospital Asset */}
        <div
          style={{
            background: "#0a0f14",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#3ecfcf",
              marginBottom: "14px",
            }}
          >
            Target Clinical Asset Telemetry
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "13px" }}>
                Asset Identifier
              </span>
              <strong style={{ color: "#ffffff", fontSize: "13px" }}>
                {currentAlert.asset}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "13px" }}>
                IP & Subnet
              </span>
              <span
                style={{
                  color: "#3ecfcf",
                  fontFamily: "monospace",
                  fontSize: "13px",
                }}
              >
                {currentAlert.assetIp}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "13px" }}>
                Device Classification
              </span>
              <span style={{ color: "#ffffff", fontSize: "13px" }}>
                {currentAlert.assetType}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "13px" }}>
                Hospital Ward / Dept
              </span>
              <span style={{ color: "#ffffff", fontSize: "13px" }}>
                {currentAlert.department}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "13px" }}>
                Vulnerability Reference
              </span>
              <span
                style={{
                  color: "#f87171",
                  fontFamily: "monospace",
                  fontSize: "12.5px",
                }}
              >
                {currentAlert.cve}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "13px" }}>
                MITRE ATT&CK TTP
              </span>
              <span
                style={{
                  color: "#facc15",
                  fontFamily: "monospace",
                  fontSize: "12.5px",
                }}
              >
                {currentAlert.mitreTechnique}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Explainable AI (XAI) Analysis */}
        <div
          style={{
            background: "#0a0f14",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#3ecfcf",
                }}
              >
                Explainable AI (XAI) Root Cause Verdict
              </span>
              <span
                style={{
                  fontSize: "11.5px",
                  fontWeight: 700,
                  color: "#4ade80",
                  background: "rgba(34, 197, 94, 0.12)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                {currentAlert.confidence} Confidence
              </span>
            </div>

            <p
              style={{
                fontSize: "13.5px",
                lineHeight: "1.6",
                color: "rgba(255, 255, 255, 0.8)",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "8px",
                padding: "14px 16px",
                margin: "0 0 16px 0",
              }}
            >
              "{currentAlert.xaiExplanation}"
            </p>
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.45)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Cpu size={14} color="#3ecfcf" />
            Analyzed by AI Ensemble Neural IDS &amp; IoMT Behavioral Model
          </div>
        </div>
      </div>


      {/* Operator Action Bar: Status updates & Incident Response Controls */}
      <div
        style={{
          background: "#0a0f14",
          border: "1px solid rgba(62, 207, 207, 0.15)",
          borderRadius: "14px",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "18px",
        }}
      >
        {/* Status transition buttons */}
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "rgba(255, 255, 255, 0.45)",
              marginBottom: "8px",
            }}
          >
            Update Detection Status
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Detected", "Investigating", "Contained", "Resolved", "Escalated"].map(
              (status) => {
                const isSelected = currentAlert.detectionStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    disabled={statusUpdating}
                    onClick={() => handleStatusChange(status)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: isSelected
                        ? "1px solid #3ecfcf"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      background: isSelected
                        ? "#3ecfcf"
                        : "rgba(255, 255, 255, 0.04)",
                      color: isSelected ? "#05080a" : "rgba(255, 255, 255, 0.7)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {status}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleTriggerQuarantine}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "8px",
              color: "#f87171",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Lock size={14} /> Re-verify Isolation
          </button>

          <button
            type="button"
            onClick={handleGenerateReport}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              background: "#3ecfcf",
              border: "none",
              borderRadius: "8px",
              color: "#05080a",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(62, 207, 207, 0.25)",
            }}
          >
            <FileCheck2 size={15} /> Export Incident Report
          </button>
        </div>
      </div>
    </div>
  );
}
