import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Activity,
  Layers,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  X,
  SlidersHorizontal,
  HeartPulse,
} from "lucide-react";
import { ROLES, normalizeRole } from "../../utils/rbac";

// Default comprehensive alerts dataset for Hospital AI-ACDS
export const INITIAL_ALERTS = [
  {
    id: "ALT-2026-8941",
    timestamp: "2026-09-26 18:42:15 UTC",
    relativeTime: "4 mins ago",
    asset: "Infusion Pump ICU-04",
    assetIp: "10.24.118.42",
    assetType: "Medical IoMT Device",
    department: "Intensive Care Unit (ICU)",
    bedsideLocation: "ICU Bed 04 · Building B · Floor 3",
    threatType: "IoMT Firmware Command Injection",
    severity: "Critical",
    riskScore: 96,
    detectionStatus: "Detected",
    responseStatus: "Autonomous Quarantine Initiated",
    mitreTechnique: "T1059.004 / T1489",
    cve: "CVE-2026-38291",
    confidence: "99.4%",
    isMedicalDevice: true,
    clinicalApprovalStatus: "Pending", // "Pending" | "Approved" | "Rejected"
    patientSafetyImpact: "High - Continuous bedside IV infusion delivering titratable inotrope. Uncoordinated shutoff risks acute hemodynamic collapse.",
    clinicalMitigation: "Stepper motor driver locked into fail-safe mechanical baseline; zero bolus override permitted.",
    description:
      "AI behavioral model detected unauthorized remote shell payload attempting to override IV delivery rate beyond physiological safety limits.",
    xaiExplanation:
      "Abnormal byte entropy in packet payload (deviation +382% from ICU baseline). Targeted memory address maps directly to pump stepper motor controller.",
    actionsTaken: [
      "Subnet 10.24.118.42 isolated to Quarantine VLAN 99",
      "Blocked outbound C2 communication over port 8443",
      "Dispatched alert to Biomedical Engineering standby",
    ],
  },
  {
    id: "ALT-2026-8940",
    timestamp: "2026-09-26 18:29:02 UTC",
    relativeTime: "17 mins ago",
    asset: "PACS Imaging Server 01",
    assetIp: "10.24.102.15",
    assetType: "Critical Imaging Server",
    department: "Radiology",
    threatType: "Ransomware Lateral Movement",
    severity: "Critical",
    riskScore: 94,
    detectionStatus: "Investigating",
    responseStatus: "VLAN Isolation Active",
    mitreTechnique: "T1021.002 / T1486",
    cve: "CVE-2026-11840",
    confidence: "98.7%",
    description:
      "Rapid encrypted file rename burst observed across DICOM image archives matching LockBit 3.0 ransomware heuristics.",
    xaiExplanation:
      "Mass file touch frequency exceeded 420 files/sec on SMB share /pacs/dicom/raw. Canary file tripped within 1.2 seconds of detonation.",
    actionsTaken: [
      "Automated SMB session termination across port 445",
      "Network adapter dynamically disconnected via hypervisor API",
      "Active volume snapshot pinned for forensic analysis",
    ],
  },
  {
    id: "ALT-2026-8939",
    timestamp: "2026-09-26 18:11:49 UTC",
    relativeTime: "34 mins ago",
    asset: "EHR Core Database Cluster",
    assetIp: "10.24.96.8",
    assetType: "PHI Database Server",
    department: "Data Center Core",
    threatType: "Unauthorized PHI Exfiltration",
    severity: "High",
    riskScore: 88,
    detectionStatus: "Investigating",
    responseStatus: "Egress Throttled · Token Revoked",
    mitreTechnique: "T1048.003 / T1567",
    cve: "CWE-200",
    confidence: "96.2%",
    description:
      "Outbound TLS tunnel transmitting bulk patient records (HL7/FHIR payloads) to unauthorized external IP in Eastern Europe.",
    xaiExplanation:
      "Volume anomaly: 14,200 records staged outside shift change window without valid clinical authentication session.",
    actionsTaken: [
      "BGP flow spec rule throttled tunnel destination to 0 kbps",
      "Compromised service account credentials revoked in LDAP",
      "HIPAA audit log marked with cryptographic incident hash",
    ],
  },
  {
    id: "ALT-2026-8938",
    timestamp: "2026-09-26 17:52:10 UTC",
    relativeTime: "53 mins ago",
    asset: "ICU Ventilator-3",
    assetIp: "10.24.118.67",
    assetType: "Life-Critical Device",
    department: "Intensive Care Unit (ICU)",
    bedsideLocation: "ICU Bed 03 · Building B · Floor 3",
    threatType: "DDoS Telemetry Flood Attack",
    severity: "High",
    riskScore: 82,
    detectionStatus: "Contained",
    responseStatus: "Rate Limiting Enforced",
    mitreTechnique: "T1498.001",
    cve: "CVE-2025-4921",
    confidence: "95.1%",
    isMedicalDevice: true,
    clinicalApprovalStatus: "Approved",
    patientSafetyImpact: "Life Critical - Invasive respiratory ventilation. Network rate limiting verified safe without impacting patient airway volume.",
    clinicalMitigation: "Local autonomous breathing cycle preserved; network telemetry isolated to VLAN 99.",
    description:
      "SYN flood targeting ventilator central telemetry port 8080 attempting to cause signal dropout at nursing station.",
    xaiExplanation:
      "Traffic spike to 45,000 pps from 3 compromised IoT smart bulbs on building management VLAN.",
    actionsTaken: [
      "Upstream switch applied ACL drop for unauthorized UDP/TCP fragments",
      "Isolated rogue IoT segment from clinical telemetry bridge",
      "Ventilator telemetry stream restored without patient impact",
    ],
  },
  {
    id: "ALT-2026-8937",
    timestamp: "2026-09-26 17:18:33 UTC",
    relativeTime: "1h 27m ago",
    asset: "Workstation ER-02",
    assetIp: "10.24.140.22",
    assetType: "Clinical Workstation",
    department: "Emergency Room",
    threatType: "Credential Stuffing & Privilege Escalation",
    severity: "Medium",
    riskScore: 65,
    detectionStatus: "Escalated",
    responseStatus: "Account Locked · SOC Review",
    mitreTechnique: "T1110.004 / T1003",
    cve: "CWE-307",
    confidence: "91.8%",
    description:
      "Multiple failed Kerberos authentications followed by LSASS memory injection attempt on unattended clinical workstation.",
    xaiExplanation:
      "User session pattern mismatched biometric typing profile. Mimikatz DLL execution blocked by local behavioral agent.",
    actionsTaken: [
      "Workstation session locked immediately",
      "Domain account quarantined pending dual-factor verification",
      "Escalated to Hospital SOC Level 2 on-call analyst",
    ],
  },
  {
    id: "ALT-2026-8936",
    timestamp: "2026-09-26 16:40:12 UTC",
    relativeTime: "2h 05m ago",
    asset: "Pharmacy Dispenser-01",
    assetIp: "10.24.110.5",
    assetType: "Automated Medication Dispenser",
    department: "Central Pharmacy",
    bedsideLocation: "Central Pharmacy · Cleanroom Dispense Station 1",
    threatType: "HL7 Protocol Injection Anomaly",
    severity: "Medium",
    riskScore: 58,
    detectionStatus: "Contained",
    responseStatus: "HL7 Parser Sandboxed",
    mitreTechnique: "T1190 / CWE-20",
    cve: "CVE-2026-22104",
    confidence: "89.4%",
    isMedicalDevice: true,
    clinicalApprovalStatus: "Approved",
    patientSafetyImpact: "Moderate - Automated dispensing cabinet for critical schedule II medications.",
    clinicalMitigation: "Cabinet switched to physical biometric dual-key manual access mode; dispensing logs secured.",
    description:
      "Malformed MSH-9 HL7 segment with excessive buffer allocation attempt sent to Pyxis automated medication cabinet.",
    xaiExplanation:
      "Parser boundary check triggered by oversized custom z-segment with shellcode NOP sled sequence.",
    actionsTaken: [
      "HL7 message rejected at interface engine gateway",
      "Pharmacy dispensing reverted to fallback verification mode",
    ],
  },
  {
    id: "ALT-2026-8935",
    timestamp: "2026-09-26 15:05:05 UTC",
    relativeTime: "3h 40m ago",
    asset: "Guest WiFi AP Gateway-04",
    assetIp: "192.168.200.1",
    assetType: "Public WiFi Gateway",
    department: "Hospital Lobby",
    threatType: "Rogue Access Point ARP Poisoning",
    severity: "Low",
    riskScore: 35,
    detectionStatus: "Resolved",
    responseStatus: "Port Disabled · MAC Blocked",
    mitreTechnique: "T1557.002",
    cve: "CWE-440",
    confidence: "94.0%",
    description:
      "Gratuitous ARP broadcast flood attempting to intercept patient portal web traffic in the main outpatient lobby.",
    xaiExplanation:
      "Dynamic ARP Inspection (DAI) detected conflicting IP-to-MAC bindings on switch port Fa0/14.",
    actionsTaken: [
      "Port Fa0/14 shutdown automatically via SNMP trap",
      "Attacking MAC address added to global hospital blacklist",
    ],
  },
  {
    id: "ALT-2026-8934",
    timestamp: "2026-09-26 13:58:19 UTC",
    relativeTime: "4h 47m ago",
    asset: "Lab Diagnostics Analyzer-02",
    assetIp: "10.24.115.19",
    assetType: "Laboratory Analyzer",
    department: "Pathology Lab",
    threatType: "Unpatched SMBv1 Protocol Negotiation",
    severity: "Low",
    riskScore: 24,
    detectionStatus: "Resolved",
    responseStatus: "Isolated to Lab Subnet",
    mitreTechnique: "T1210",
    cve: "CVE-2017-0144",
    confidence: "88.2%",
    description:
      "Legacy SMBv1 dialect negotiation attempt detected during automated routine asset discovery scan.",
    xaiExplanation:
      "Legacy analyzer firmware requires SMBv1 compatibility mode; isolated via dedicated micro-segmentation rule.",
    actionsTaken: [
      "Micro-segmentation firewall rule verified active",
      "Asset scheduled for firmware patching window",
    ],
  },
];

export default function AlertsView({ onInvestigateAlert, alerts: propAlerts, userRole }) {
  const normRole = normalizeRole(userRole);
  const isClinicalAdmin = normRole === ROLES.CLINICAL_IT_ADMIN;

  const [alerts, setAlerts] = useState(propAlerts || INITIAL_ALERTS);

  useEffect(() => {
    if (propAlerts) {
      setAlerts(propAlerts);
    }
  }, [propAlerts]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedThreatType, setSelectedThreatType] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  // Derive unique threat types and departments for filters
  const threatTypes = useMemo(() => {
    const types = new Set(alerts.map((a) => a.threatType));
    return ["All", ...Array.from(types)];
  }, [alerts]);

  const departments = useMemo(() => {
    const depts = new Set(alerts.map((a) => a.department));
    return ["All", ...Array.from(depts)];
  }, [alerts]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesQuery =
          alert.id.toLowerCase().includes(q) ||
          alert.asset.toLowerCase().includes(q) ||
          alert.assetIp.toLowerCase().includes(q) ||
          alert.threatType.toLowerCase().includes(q) ||
          alert.cve.toLowerCase().includes(q) ||
          alert.department.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Severity filter
      if (selectedSeverity !== "All" && alert.severity !== selectedSeverity) {
        return false;
      }

      // Detection Status filter
      if (selectedStatus !== "All" && alert.detectionStatus !== selectedStatus) {
        return false;
      }

      // Threat Type filter
      if (
        selectedThreatType !== "All" &&
        alert.threatType !== selectedThreatType
      ) {
        return false;
      }

      // Department filter
      if (
        selectedDepartment !== "All" &&
        alert.department !== selectedDepartment
      ) {
        return false;
      }

      return true;
    });
  }, [
    alerts,
    searchTerm,
    selectedSeverity,
    selectedStatus,
    selectedThreatType,
    selectedDepartment,
  ]);

  // Counts for KPI pills
  const stats = useMemo(() => {
    return {
      total: alerts.length,
      critical: alerts.filter((a) => a.severity === "Critical").length,
      high: alerts.filter((a) => a.severity === "High").length,
      investigating: alerts.filter((a) => a.detectionStatus === "Investigating")
        .length,
      contained: alerts.filter((a) => a.detectionStatus === "Contained").length,
    };
  }, [alerts]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSeverity("All");
    setSelectedStatus("All");
    setSelectedThreatType("All");
    setSelectedDepartment("All");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedSeverity !== "All" ||
    selectedStatus !== "All" ||
    selectedThreatType !== "All" ||
    selectedDepartment !== "All";

  // Helper badge color functions
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "Critical":
        return {
          background: "rgba(239, 68, 68, 0.14)",
          color: "#f87171",
          border: "1px solid rgba(239, 68, 68, 0.35)",
        };
      case "High":
        return {
          background: "rgba(249, 115, 22, 0.14)",
          color: "#fb923c",
          border: "1px solid rgba(249, 115, 22, 0.35)",
        };
      case "Medium":
        return {
          background: "rgba(234, 179, 8, 0.14)",
          color: "#facc15",
          border: "1px solid rgba(234, 179, 8, 0.35)",
        };
      case "Low":
        return {
          background: "rgba(56, 189, 248, 0.12)",
          color: "#38bdf8",
          border: "1px solid rgba(56, 189, 248, 0.3)",
        };
      default:
        return {
          background: "rgba(148, 163, 184, 0.12)",
          color: "#94a3b8",
          border: "1px solid rgba(148, 163, 184, 0.3)",
        };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Detected":
        return {
          background: "rgba(56, 189, 248, 0.14)",
          color: "#38bdf8",
          border: "1px solid rgba(56, 189, 248, 0.35)",
        };
      case "Investigating":
        return {
          background: "rgba(234, 179, 8, 0.14)",
          color: "#facc15",
          border: "1px solid rgba(234, 179, 8, 0.35)",
        };
      case "Contained":
        return {
          background: "rgba(34, 197, 94, 0.14)",
          color: "#4ade80",
          border: "1px solid rgba(34, 197, 94, 0.35)",
        };
      case "Resolved":
        return {
          background: "rgba(148, 163, 184, 0.14)",
          color: "#cbd5e1",
          border: "1px solid rgba(148, 163, 184, 0.3)",
        };
      case "Escalated":
        return {
          background: "rgba(168, 85, 247, 0.14)",
          color: "#c084fc",
          border: "1px solid rgba(168, 85, 247, 0.35)",
        };
      default:
        return {
          background: "rgba(148, 163, 184, 0.1)",
          color: "#94a3b8",
          border: "1px solid rgba(148, 163, 184, 0.2)",
        };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Unified Search, Filter and Quick-Triage Box */}
      <div
        style={{
          background: "#0a0f14",
          border: "1px solid rgba(62, 207, 207, 0.15)",
          borderRadius: "14px",
          padding: "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Top Row: Search Input & Dropdowns */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Main search input */}
          <div
            style={{
              flex: "1 1 280px",
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "14px",
                color: "rgba(255, 255, 255, 0.4)",
              }}
            />
            <input
              type="text"
              placeholder="Search by Alert ID, Asset, IP, Threat Type, CVE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                height: "40px",
                background: "#06090e",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "0 14px 0 40px",
                color: "#ffffff",
                fontSize: "13px",
                fontFamily: "inherit",
                outline: "none",
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3ecfcf")}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")
              }
            />
          </div>

          {/* Severity Dropdown */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              style={{
                height: "40px",
                background: "#06090e",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "0 28px 0 12px",
                color: "#ffffff",
                fontSize: "13px",
                fontFamily: "inherit",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Detection Status Dropdown */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                height: "40px",
                background: "#06090e",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "0 28px 0 12px",
                color: "#ffffff",
                fontSize: "13px",
                fontFamily: "inherit",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Detected">Detected</option>
              <option value="Investigating">Investigating</option>
              <option value="Contained">Contained</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
            </select>
          </div>

          {/* Threat Type Dropdown */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <select
              value={selectedThreatType}
              onChange={(e) => setSelectedThreatType(e.target.value)}
              style={{
                height: "40px",
                background: "#06090e",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "0 28px 0 12px",
                color: "#ffffff",
                fontSize: "13px",
                fontFamily: "inherit",
                cursor: "pointer",
                outline: "none",
                maxWidth: "190px",
              }}
            >
              <option value="All">All Threat Types</option>
              {threatTypes
                .filter((t) => t !== "All")
                .map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
            </select>
          </div>

          {/* Department / Asset Location Dropdown */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{
                height: "40px",
                background: "#06090e",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "0 28px 0 12px",
                color: "#ffffff",
                fontSize: "13px",
                fontFamily: "inherit",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="All">All Departments</option>
              {departments
                .filter((d) => d !== "All")
                .map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              style={{
                height: "40px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "8px",
                padding: "0 14px",
                color: "#f87171",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Bottom Row inside the box (Below Dropdowns): Quick Filter Pills & Live Status */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            paddingTop: "14px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          {/* Quick Filter Count Pills inside the box */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <div
              onClick={() => setSelectedSeverity("All")}
              style={{
                background: "#0c1017",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "5px 11px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.5)",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Total
              </span>
              <span
                style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}
              >
                {stats.total}
              </span>
            </div>

            <div
              onClick={() => setSelectedSeverity("Critical")}
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border:
                  selectedSeverity === "Critical"
                    ? "1px solid #ef4444"
                    : "1px solid rgba(239, 68, 68, 0.25)",
                borderRadius: "8px",
                padding: "5px 11px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "#f87171",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Critical
              </span>
              <span
                style={{ fontSize: "13px", fontWeight: 700, color: "#f87171" }}
              >
                {stats.critical}
              </span>
            </div>

            <div
              onClick={() => setSelectedSeverity("High")}
              style={{
                background: "rgba(249, 115, 22, 0.08)",
                border:
                  selectedSeverity === "High"
                    ? "1px solid #f97316"
                    : "1px solid rgba(249, 115, 22, 0.25)",
                borderRadius: "8px",
                padding: "5px 11px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "#fb923c",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                High
              </span>
              <span
                style={{ fontSize: "13px", fontWeight: 700, color: "#fb923c" }}
              >
                {stats.high}
              </span>
            </div>

            <div
              onClick={() => setSelectedStatus("Investigating")}
              style={{
                background: "rgba(234, 179, 8, 0.08)",
                border:
                  selectedStatus === "Investigating"
                    ? "1px solid #eab308"
                    : "1px solid rgba(234, 179, 8, 0.25)",
                borderRadius: "8px",
                padding: "5px 11px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "#facc15",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Investigating
              </span>
              <span
                style={{ fontSize: "13px", fontWeight: 700, color: "#facc15" }}
              >
                {stats.investigating}
              </span>
            </div>

            <div
              onClick={() => setSelectedStatus("Contained")}
              style={{
                background: "rgba(34, 197, 94, 0.08)",
                border:
                  selectedStatus === "Contained"
                    ? "1px solid #22c55e"
                    : "1px solid rgba(34, 197, 94, 0.25)",
                borderRadius: "8px",
                padding: "5px 11px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "#4ade80",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Contained
              </span>
              <span
                style={{ fontSize: "13px", fontWeight: 700, color: "#4ade80" }}
              >
                {stats.contained}
              </span>
            </div>
          </div>

          {/* Telemetry status on the right */}
          <div
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.45)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span>
              Showing <strong>{filteredAlerts.length}</strong> of{" "}
              <strong>{alerts.length}</strong> detected alerts
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255, 255, 255, 0.6)" }}>
              <Activity size={12} color="#3ecfcf" /> Real-time active
            </span>
          </div>
        </div>
      </div>

      {/* Alerts Table / List Card */}
      <div
        style={{
          background: "#0a0f14",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        {filteredAlerts.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.4)",
              fontSize: "14px",
            }}
          >
            <ShieldCheck
              size={36}
              color="#3ecfcf"
              style={{ marginBottom: "12px", opacity: 0.8 }}
            />
            <div style={{ color: "#ffffff", fontWeight: 600, marginBottom: "6px" }}>
              No matching security alerts found
            </div>
            <div>Try adjusting your search criteria or clearing active filters.</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  <th style={{ padding: "14px 18px" }}>Alert ID / Time</th>
                  <th style={{ padding: "14px 18px" }}>Affected Asset</th>
                  <th style={{ padding: "14px 18px" }}>Threat Classification</th>
                  <th style={{ padding: "14px 18px" }}>Severity</th>
                  <th style={{ padding: "14px 18px" }}>Risk Score</th>
                  <th style={{ padding: "14px 18px" }}>Detection Status</th>
                  <th style={{ padding: "14px 18px" }}>Response Status</th>
                  <th style={{ padding: "14px 18px", textAlign: "right" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => {
                  const severityStyle = getSeverityStyle(alert.severity);
                  const statusStyle = getStatusStyle(alert.detectionStatus);

                  return (
                    <tr
                      key={alert.id}
                      style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(62, 207, 207, 0.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      {/* Alert ID & Timestamp */}
                      <td style={{ padding: "16px 18px", whiteSpace: "nowrap" }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#ffffff",
                            fontFamily: "monospace",
                            fontSize: "13.5px",
                          }}
                        >
                          {alert.id}
                        </div>
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "rgba(255, 255, 255, 0.45)",
                            marginTop: "3px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Clock size={12} /> {alert.relativeTime}
                        </div>
                      </td>

                      {/* Affected Asset */}
                      <td style={{ padding: "16px 18px" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#ffffff",
                            fontSize: "13.5px",
                          }}
                        >
                          {alert.asset}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#3ecfcf",
                            fontFamily: "monospace",
                            marginTop: "2px",
                          }}
                        >
                          {alert.assetIp}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "rgba(255, 255, 255, 0.4)",
                            marginTop: "2px",
                          }}
                        >
                          {alert.department}
                        </div>

                        {alert.isMedicalDevice && (
                          <div style={{ marginTop: "5px" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "2px 7px",
                                borderRadius: "4px",
                                fontSize: "10.5px",
                                fontWeight: 700,
                                background:
                                  alert.clinicalApprovalStatus === "Approved"
                                    ? "rgba(16, 185, 129, 0.12)"
                                    : alert.clinicalApprovalStatus === "Rejected"
                                    ? "rgba(239, 68, 68, 0.12)"
                                    : "rgba(245, 158, 11, 0.12)",
                                color:
                                  alert.clinicalApprovalStatus === "Approved"
                                    ? "#34d399"
                                    : alert.clinicalApprovalStatus === "Rejected"
                                    ? "#f87171"
                                    : "#fbbf24",
                                border:
                                  alert.clinicalApprovalStatus === "Approved"
                                    ? "1px solid rgba(16, 185, 129, 0.3)"
                                    : alert.clinicalApprovalStatus === "Rejected"
                                    ? "1px solid rgba(239, 68, 68, 0.3)"
                                    : "1px solid rgba(245, 158, 11, 0.3)",
                              }}
                            >
                              <HeartPulse size={10} />
                              {alert.clinicalApprovalStatus === "Approved"
                                ? "Medical Sign-off: Approved"
                                : alert.clinicalApprovalStatus === "Rejected"
                                ? "Medical Sign-off: Rejected"
                                : "Medical Sign-off: Pending"}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Threat Type */}
                      <td style={{ padding: "16px 18px" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#ffffff",
                            fontSize: "13px",
                            lineHeight: "1.3",
                          }}
                        >
                          {alert.threatType}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "rgba(255, 255, 255, 0.4)",
                            marginTop: "3px",
                          }}
                        >
                          {alert.cve}
                        </div>
                      </td>

                      {/* Severity Indicator */}
                      <td style={{ padding: "16px 18px", whiteSpace: "nowrap" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            ...severityStyle,
                          }}
                        >
                          {alert.severity}
                        </span>
                      </td>

                      {/* Risk Score */}
                      <td style={{ padding: "16px 18px", whiteSpace: "nowrap" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: "48px",
                              height: "6px",
                              background: "rgba(255, 255, 255, 0.1)",
                              borderRadius: "3px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${alert.riskScore}%`,
                                height: "100%",
                                background:
                                  alert.riskScore >= 90
                                    ? "#ef4444"
                                    : alert.riskScore >= 75
                                    ? "#f97316"
                                    : alert.riskScore >= 50
                                    ? "#eab308"
                                    : "#38bdf8",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: "13px",
                              color:
                                alert.riskScore >= 90
                                  ? "#f87171"
                                  : alert.riskScore >= 75
                                  ? "#fb923c"
                                  : alert.riskScore >= 50
                                  ? "#facc15"
                                  : "#38bdf8",
                            }}
                          >
                            {alert.riskScore}
                          </span>
                        </div>
                      </td>

                      {/* Detection Status */}
                      <td style={{ padding: "16px 18px", whiteSpace: "nowrap" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "11.5px",
                            fontWeight: 600,
                            ...statusStyle,
                          }}
                        >
                          {alert.detectionStatus}
                        </span>
                      </td>

                      {/* Response Status */}
                      <td style={{ padding: "16px 18px" }}>
                        <div
                          style={{
                            fontSize: "12.5px",
                            color: "rgba(255, 255, 255, 0.8)",
                            fontWeight: 500,
                          }}
                        >
                          {alert.responseStatus}
                        </div>
                      </td>

                      {/* Investigate Action Button */}
                      <td
                        style={{
                          padding: "16px 18px",
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => onInvestigateAlert(alert)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 16px",
                            background: "#3ecfcf",
                            color: "#05080a",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "12.5px",
                            fontWeight: 700,
                            fontFamily: "inherit",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            boxShadow: "0 2px 10px rgba(62, 207, 207, 0.25)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#4fd1c5";
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 15px rgba(62, 207, 207, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#3ecfcf";
                            e.currentTarget.style.transform = "none";
                            e.currentTarget.style.boxShadow =
                              "0 2px 10px rgba(62, 207, 207, 0.25)";
                          }}
                        >
                          {isClinicalAdmin ? (
                            <>
                              Review Impact <ArrowRight size={13} />
                            </>
                          ) : (
                            <>
                              Investigate <ArrowRight size={13} />
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
