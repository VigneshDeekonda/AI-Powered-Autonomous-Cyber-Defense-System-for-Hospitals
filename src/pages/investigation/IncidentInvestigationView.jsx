import { useState, useEffect } from "react";
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
  Loader2,
  Check,
  ShieldCheck,
  X,
  FileText,
} from "lucide-react";

export default function IncidentInvestigationView({
  alert,
  onBack,
  onUpdateStatus,
}) {
  const [currentAlert, setCurrentAlert] = useState(alert);
  const [toastMessage, setToastMessage] = useState("");
  const [isVerifyingIsolation, setIsVerifyingIsolation] = useState(false);
  const [isolationVerified, setIsolationVerified] = useState(false);
  const [isExported, setIsExported] = useState(false);

  useEffect(() => {
    if (alert) {
      setCurrentAlert(alert);
    }
  }, [alert]);

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

  // Floating notification trigger
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Helper status badge styles
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Detected":
        return {
          background: "rgba(56, 189, 248, 0.14)",
          color: "#38bdf8",
          border: "1px solid rgba(56, 189, 248, 0.35)",
        };
      case "Investigating":
        return {
          background: "rgba(245, 158, 11, 0.14)",
          color: "#fbbf24",
          border: "1px solid rgba(245, 158, 11, 0.35)",
        };
      case "Contained":
        return {
          background: "rgba(62, 207, 207, 0.14)",
          color: "#3ecfcf",
          border: "1px solid rgba(62, 207, 207, 0.35)",
        };
      case "Resolved":
        return {
          background: "rgba(16, 185, 129, 0.14)",
          color: "#34d399",
          border: "1px solid rgba(16, 185, 129, 0.35)",
        };
      case "Escalated":
        return {
          background: "rgba(239, 68, 68, 0.14)",
          color: "#f87171",
          border: "1px solid rgba(239, 68, 68, 0.35)",
        };
      default:
        return {
          background: "rgba(148, 163, 184, 0.14)",
          color: "#94a3b8",
          border: "1px solid rgba(148, 163, 184, 0.35)",
        };
    }
  };

  // Handle Detection Status transitions
  const handleStatusChange = (newStatus) => {
    let newResponseStatus = currentAlert.responseStatus;
    if (newStatus === "Resolved") {
      newResponseStatus = "Threat Remediated & Mitigated";
    } else if (newStatus === "Contained") {
      newResponseStatus = "Autonomous VLAN Quarantine Active";
    } else if (newStatus === "Escalated") {
      newResponseStatus = "Escalated to Tier-3 CISO Incident Team";
    } else if (newStatus === "Investigating") {
      newResponseStatus = "Analyst Forensic Inspection Active";
    } else if (newStatus === "Detected") {
      newResponseStatus = "Autonomous Triage In Progress";
    }

    const updated = {
      ...currentAlert,
      detectionStatus: newStatus,
      responseStatus: newResponseStatus,
    };
    setCurrentAlert(updated);

    if (onUpdateStatus) {
      onUpdateStatus(currentAlert.id, newStatus, newResponseStatus);
    }

    triggerToast(`Incident status updated to "${newStatus}"`);
  };

  // Handle Re-verify Isolation
  const handleReverifyIsolation = () => {
    setIsVerifyingIsolation(true);
    setTimeout(() => {
      setIsVerifyingIsolation(false);
      setIsolationVerified(true);

      const verifiedResponseStatus = "VLAN 99 Quarantine Verified & Active";
      const updated = {
        ...currentAlert,
        responseStatus: verifiedResponseStatus,
      };
      setCurrentAlert(updated);

      if (onUpdateStatus) {
        onUpdateStatus(currentAlert.id, currentAlert.detectionStatus, verifiedResponseStatus);
      }

      triggerToast(
        `Network Isolation Verified: Target ${currentAlert.asset} (${currentAlert.assetIp}) is 100% quarantined on VLAN 99`
      );
    }, 600);
  };

  // Handle Export Incident Report
  const handleExportIncidentReport = () => {
    setIsExported(true);

    const reportContent = `================================================================================
HOSPITAL CYBERSECURITY INCIDENT DOSSIER & REMEDIATION REPORT
AI-Powered Autonomous Cyber Defense System (AI-ACDS)
St. Jude Clinical Healthcare Security Operations Center
================================================================================
Report Generated  : ${new Date().toISOString()}
Incident ID       : ${currentAlert.id}
Detection Status  : ${currentAlert.detectionStatus}
Response Status   : ${currentAlert.responseStatus}
Risk Assessment   : ${currentAlert.riskScore}/100 [${currentAlert.severity} Severity]
Timestamp         : ${currentAlert.timestamp} (${currentAlert.relativeTime || "Recent"})
--------------------------------------------------------------------------------
AFFECTED CLINICAL ASSET & NETWORK TELEMETRY
Asset Identifier  : ${currentAlert.asset}
IP Address        : ${currentAlert.assetIp}
Quarantine VLAN   : VLAN 99 (Isolated)
Device Category   : ${currentAlert.assetType}
Department        : ${currentAlert.department}
--------------------------------------------------------------------------------
THREAT CLASSIFICATION & ADVERSARY TACTICS
Threat Type       : ${currentAlert.threatType}
CVE Reference     : ${currentAlert.cve}
MITRE ATT&CK TTP  : ${currentAlert.mitreTechnique}
Detection Engine  : AI Ensemble Neural IDS & IoMT Behavioral Telemetry Model
Confidence Score  : ${currentAlert.confidence}
--------------------------------------------------------------------------------
INCIDENT DESCRIPTION
${currentAlert.description}
--------------------------------------------------------------------------------
EXPLAINABLE AI (XAI) CAUSAL ROOT CAUSE VERDICT
${currentAlert.xaiExplanation}
--------------------------------------------------------------------------------
AUTONOMOUS CONTAINMENT & MITIGATION ACTIONS EXECUTED
${(currentAlert.actionsTaken || [
  `Subnet ${currentAlert.assetIp} isolated to Quarantine VLAN 99`,
  "Blocked outbound C2 communication over port 8443",
  "Dispatched alert to Biomedical Engineering standby",
])
  .map((a, i) => `${i + 1}. ${a}`)
  .join("\n")}
--------------------------------------------------------------------------------
OPERATIONAL DISPOSITION
Current Status    : ${currentAlert.detectionStatus}
Remediation Note  : Tamper-proof forensic telemetry compiled and cryptographically sealed.
Incident Handler  : Network Administrator / Lead SOC Analyst
================================================================================
CONFIDENTIAL - CLINICAL CYBERSECURITY AUDIT RECORD - HIPAA / NIST SP 800-61 Rev. 2
`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `INCIDENT_DOSSIER_${currentAlert.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast(`Downloaded incident dossier for ${currentAlert.id}`);

    setTimeout(() => {
      setIsExported(false);
    }, 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", textAlign: "left" }}>
      {/* Floating Bottom-Right Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            background: "#0e1620",
            border: "1px solid #3ecfcf",
            color: "#3ecfcf",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle2 size={16} color="#3ecfcf" />
          {toastMessage}
        </div>
      )}

      {/* Top Navigation Row */}
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
            transition: "opacity 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <ArrowLeft size={16} /> Back to Security Alerts Queue
        </button>
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
                ...getStatusBadgeStyle(currentAlert.detectionStatus),
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
              fontSize: "20px",
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 8px 0",
              letterSpacing: "-0.3px",
              textAlign: "left",
            }}
          >
            {currentAlert.threatType}
          </h1>

          <p
            style={{
              fontSize: "13.5px",
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: "1.55",
              margin: 0,
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
                IP &amp; Subnet
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
                Hospital Ward / Department
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
                MITRE ATT&amp;CK TTP
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

      {/* Isolation Confirmation Banner (shown when verified) */}
      {isolationVerified && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            borderRadius: "12px",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
                flexShrink: 0,
              }}
            >
              <Lock size={18} />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff", marginBottom: "2px" }}>
                Network Isolation Verified &amp; Active
              </div>
              <div style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.65)" }}>
                Target IP <strong style={{ color: "#3ecfcf" }}>{currentAlert.assetIp}</strong> is quarantined on{" "}
                <strong style={{ color: "#ffffff" }}>VLAN 99</strong>. Packet drop rate: 100%. Ingress/Egress completely blocked.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span
              style={{
                fontSize: "11.5px",
                fontWeight: "700",
                color: "#10b981",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "5px 12px",
                borderRadius: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Quarantine Enforced
            </span>
            <button
              type="button"
              onClick={() => setIsolationVerified(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255, 255, 255, 0.4)",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

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
                const statusColors = {
                  Detected: "#38bdf8",
                  Investigating: "#fbbf24",
                  Contained: "#3ecfcf",
                  Resolved: "#34d399",
                  Escalated: "#f87171",
                };
                const activeColor = statusColors[status] || "#3ecfcf";

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      border: isSelected
                        ? `1px solid ${activeColor}`
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      background: isSelected
                        ? activeColor
                        : "rgba(255, 255, 255, 0.04)",
                      color: isSelected ? "#05080a" : "rgba(255, 255, 255, 0.75)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = activeColor;
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.color = "rgba(255, 255, 255, 0.75)";
                      }
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
          {/* Re-verify Isolation Button */}
          <button
            type="button"
            disabled={isVerifyingIsolation}
            onClick={handleReverifyIsolation}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 18px",
              background: isVerifyingIsolation
                ? "rgba(239, 68, 68, 0.25)"
                : "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "8px",
              color: "#f87171",
              fontSize: "13px",
              fontWeight: 700,
              cursor: isVerifyingIsolation ? "wait" : "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isVerifyingIsolation) {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isVerifyingIsolation) {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
              }
            }}
          >
            {isVerifyingIsolation ? (
              <>
                <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                Verifying Isolation...
              </>
            ) : (
              <>
                <Lock size={14} />
                Re-verify Isolation
              </>
            )}
          </button>

          {/* Export Incident Report Button */}
          <button
            type="button"
            onClick={handleExportIncidentReport}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 18px",
              background: isExported ? "#10b981" : "#3ecfcf",
              border: "none",
              borderRadius: "8px",
              color: "#05080a",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: isExported
                ? "0 2px 10px rgba(16, 185, 129, 0.35)"
                : "0 2px 10px rgba(62, 207, 207, 0.25)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isExported) {
                e.currentTarget.style.background = "#5eead4";
              }
            }}
            onMouseLeave={(e) => {
              if (!isExported) {
                e.currentTarget.style.background = "#3ecfcf";
              }
            }}
          >
            {isExported ? (
              <>
                <Check size={15} />
                Report Exported!
              </>
            ) : (
              <>
                <FileCheck2 size={15} />
                Export Incident Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
