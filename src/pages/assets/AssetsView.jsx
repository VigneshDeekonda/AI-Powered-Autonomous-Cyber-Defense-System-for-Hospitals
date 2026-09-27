import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Tag,
  Cpu,
  MapPin,
  Building2,
  Factory,
  User,
  HeartPulse,
  Check,
  X,
  Info,
  HardDrive,
  Network,
  Search,
  Plus,
  SlidersHorizontal,
  ShieldCheck,
  AlertTriangle,
  Server,
  ChevronsUpDown,
  Lock,
} from "lucide-react";
import { hasPermission, ROLES, normalizeRole } from "../../utils/rbac";
import AccessDenied from "../../components/AccessDenied";

// Initial Hospital Asset Inventory dataset
export const INITIAL_ASSET_INVENTORY = [
  {
    id: "AST-101",
    name: "Infusion Pump ICU-04",
    type: "Medical IoT Device",
    department: "Intensive Care Unit (ICU)",
    ip: "10.24.118.42",
    mac: "AC:12:5E:8B:44:0F",
    location: "Block B · Floor 3 · Bay 12",
    osFirmware: "Embedded Linux 4.19",
    vendor: "Baxter International",
    owner: "Biomedical Engineering",
    criticality: "Life Critical",
    monitoringStatus: true,
    notes:
      "Target of firmware command injection containment. Subnet isolated to Quarantine VLAN 99.",
    registeredAt: "2026-09-20 09:15 UTC",
    riskPosture: "Quarantined",
  },
  {
    id: "AST-102",
    name: "Ventilator ICU-03",
    type: "Medical IoT Device",
    department: "Intensive Care Unit (ICU)",
    ip: "10.24.118.40",
    mac: "B4:99:BA:12:3A:89",
    location: "Block B · Floor 3 · Bay 08",
    osFirmware: "QNX Neutrino 7.1",
    vendor: "GE Healthcare",
    owner: "Critical Care Operations",
    criticality: "Life Critical",
    monitoringStatus: true,
    notes:
      "Continuous patient respiratory support node. High-priority autonomous telemetry monitoring.",
    registeredAt: "2026-09-15 11:20 UTC",
    riskPosture: "Normal",
  },
  {
    id: "AST-103",
    name: "PACS Imaging Server 01",
    type: "Hospital Server / Database",
    department: "Radiology",
    ip: "10.24.102.15",
    mac: "00:1A:2B:3C:4D:5E",
    location: "Data Center · Rack R-04",
    osFirmware: "Red Hat Enterprise Linux 9.2",
    vendor: "Siemens Healthineers",
    owner: "Radiology IT Systems",
    criticality: "Life Critical",
    monitoringStatus: true,
    notes:
      "Primary DICOM picture archiving system. Read-only immutable snapshot mode active.",
    registeredAt: "2026-09-10 14:00 UTC",
    riskPosture: "Normal",
  },
  {
    id: "AST-104",
    name: "MRI-Scanner-02",
    type: "Critical Diagnostic Imager",
    department: "Radiology",
    ip: "10.20.4.18",
    mac: "70:85:C2:55:1A:09",
    location: "Diagnostic Imaging Suite 2",
    osFirmware: "Debian 11 LTS / Syngo MR",
    vendor: "Siemens Healthineers",
    owner: "Biomedical Engineering",
    criticality: "Life Critical",
    monitoringStatus: true,
    notes:
      "Flagged for anomalous outbound DICOM exfiltration attempts. Active forensic capture in progress.",
    registeredAt: "2026-09-12 08:30 UTC",
    riskPosture: "Investigating",
  },
  {
    id: "AST-105",
    name: "EHR Database Server-01",
    type: "Hospital Server / Database",
    department: "Hospital Data Center",
    ip: "10.24.105.8",
    mac: "00:50:56:A1:B2:C3",
    location: "Data Center · Rack R-01",
    osFirmware: "Windows Server 2022 Datacenter",
    vendor: "Cerner / Oracle Health",
    owner: "Database Administration",
    criticality: "High",
    monitoringStatus: true,
    notes:
      "Electronic Health Records primary relational cluster. WAF and query rate limiting active.",
    registeredAt: "2026-09-01 10:00 UTC",
    riskPosture: "Normal",
  },
  {
    id: "AST-106",
    name: "Nurse Station Terminal 03",
    type: "Clinical Workstation",
    department: "Emergency Department",
    ip: "10.24.110.18",
    mac: "D8:BB:C1:4F:90:E2",
    location: "ER Triage Pod A",
    osFirmware: "Windows 11 Enterprise (Build 22631)",
    vendor: "Dell Healthcare Solutions",
    owner: "Clinical IT Support",
    criticality: "High",
    monitoringStatus: true,
    notes: "Kerberos ticket revocation and LSASS protection active.",
    registeredAt: "2026-09-18 16:45 UTC",
    riskPosture: "Normal",
  },
  {
    id: "AST-107",
    name: "Pharmacy Dispenser Hub 02",
    type: "Automated Medication Dispenser",
    department: "Pharmacy",
    ip: "10.24.120.08",
    mac: "2C:F0:5D:88:14:3B",
    location: "Central Inpatient Pharmacy",
    osFirmware: "Embedded Windows 10 IoT",
    vendor: "Baxter International",
    owner: "Pharmacy Governance",
    criticality: "Medium",
    monitoringStatus: true,
    notes: "Scheduled biometric and badge authentication audit cycle active.",
    registeredAt: "2026-09-14 12:10 UTC",
    riskPosture: "Normal",
  },
];

export default function AssetsView({ userRole }) {
  const navigate = useNavigate();
  const { roleId, subId } = useParams();
  const normRole = normalizeRole(userRole || roleId);
  const canAddAsset = hasPermission(normRole, "ADD_ASSET");
  const canManageAssets = hasPermission(normRole, "MANAGE_ASSETS");
  const isClinicalAdmin = normRole === ROLES.CLINICAL_IT_ADMIN;
  const isSocAnalyst = normRole === ROLES.SOC_ANALYST;

  // If user lacks permission to add asset and attempted direct URL to /new, block access
  if (!canAddAsset && subId === "new") {
    return <AccessDenied userRole={normRole} resourceName="Asset Registration (Add Asset)" />;
  }

  // View state: 'add' or 'inventory' (default to 'inventory' if user lacks ADD_ASSET permission)
  const [viewMode, setViewMode] = useState(() => {
    if (!canAddAsset) return "inventory";
    return subId === "new" ? "add" : "add";
  });

  // Inventory state
  const [assets, setAssets] = useState(INITIAL_ASSET_INVENTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [criticalityFilter, setCriticalityFilter] = useState("All");

  // Form State matching Reference Image
  const [formData, setFormData] = useState({
    name: "",
    type: "Medical IoT Device",
    department: "Intensive Care Unit",
    ip: "",
    mac: "",
    location: "",
    osFirmware: "",
    vendor: "Select vendor",
    owner: "",
    criticality: "Life Critical",
    monitoringStatus: true,
    notes: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSaveAsset = (e) => {
    e.preventDefault();

    // Validation
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Device / Asset Name is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newAsset = {
      id: `AST-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name.trim(),
      type: formData.type,
      department: formData.department,
      ip: formData.ip.trim() || "10.24.118." + Math.floor(50 + Math.random() * 150),
      mac:
        formData.mac.trim() ||
        "AC:" +
          Array.from({ length: 5 }, () =>
            Math.floor(Math.random() * 256)
              .toString(16)
              .padStart(2, "0")
              .toUpperCase()
          ).join(":"),
      location: formData.location.trim() || "Hospital Main Campus",
      osFirmware: formData.osFirmware.trim() || "Embedded Linux 4.19",
      vendor: formData.vendor === "Select vendor" ? "OEM Certified" : formData.vendor,
      owner: formData.owner.trim() || "Biomedical Engineering",
      criticality: formData.criticality,
      monitoringStatus: formData.monitoringStatus,
      notes: formData.notes.trim() || "Registered into AI-ACDS autonomous monitoring.",
      registeredAt: new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC",
      riskPosture: "Normal",
    };

    setAssets((prev) => [newAsset, ...prev]);

    // Reset Form
    setFormData({
      name: "",
      type: "Medical IoT Device",
      department: "Intensive Care Unit",
      ip: "",
      mac: "",
      location: "",
      osFirmware: "",
      vendor: "Select vendor",
      owner: "",
      criticality: "Life Critical",
      monitoringStatus: true,
      notes: "",
    });

    triggerToast(`Asset "${newAsset.name}" successfully registered into AI-ACDS inventory.`);
    setViewMode("inventory");
  };

  const handleCancel = () => {
    setViewMode("inventory");
  };

  // Filtered inventory
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (criticalityFilter !== "All" && asset.criticality !== criticalityFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          asset.name.toLowerCase().includes(q) ||
          asset.ip.toLowerCase().includes(q) ||
          asset.department.toLowerCase().includes(q) ||
          asset.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [assets, searchQuery, criticalityFilter]);

  // Options for Dropdowns
  const deviceTypeOptions = [
    "Medical IoT Device",
    "Critical Diagnostic Imager",
    "Patient Monitoring Node",
    "Clinical Workstation",
    "Hospital Server / Database",
    "Automated Medication Dispenser",
    "Network Infrastructure Gateway",
  ];

  const departmentOptions = [
    "Intensive Care Unit",
    "Neonatal ICU (NICU)",
    "Radiology",
    "Emergency Department",
    "Cardiology",
    "Pharmacy",
    "Hospital Data Center",
    "Pathology / Lab",
    "Surgical Suite",
  ];

  const vendorOptions = [
    "Select vendor",
    "GE Healthcare",
    "Philips Medical Systems",
    "Siemens Healthineers",
    "Baxter International",
    "Medtronic",
    "Cisco Systems",
    "Cerner / Oracle Health",
    "Dell Healthcare Solutions",
  ];

  const criticalityLevels = ["Life Critical", "High", "Medium", "Low"];

  return (
    <div
      style={{
        width: "100%",
        padding: "4px 0 40px 0",
        textAlign: "left",
        boxSizing: "border-box",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color: "#ffffff",
      }}
    >
      {/* Floating Toast Notification */}
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
          <Check size={16} color="#3ecfcf" />
          {toastMessage}
        </div>
      )}

      {/* Top Navigation Tabs: Switch between "Add New Asset" and "Asset Inventory" */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          paddingBottom: "14px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          {canAddAsset && (
            <button
              type="button"
              onClick={() => setViewMode("add")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: viewMode === "add" ? "#3ecfcf" : "rgba(255, 255, 255, 0.04)",
                border: viewMode === "add" ? "1px solid #3ecfcf" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: viewMode === "add" ? "#05080a" : "rgba(255, 255, 255, 0.75)",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s ease",
              }}
            >
              <Plus size={15} /> Add New Asset
            </button>
          )}

          <button
            type="button"
            onClick={() => setViewMode("inventory")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: viewMode === "inventory" ? "#3ecfcf" : "rgba(255, 255, 255, 0.04)",
              border: viewMode === "inventory" ? "1px solid #3ecfcf" : "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: viewMode === "inventory" ? "#05080a" : "rgba(255, 255, 255, 0.75)",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s ease",
            }}
          >
            <Server size={15} /> Asset Inventory ({assets.length})
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isClinicalAdmin && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "6px",
                background: "rgba(62, 207, 207, 0.08)",
                border: "1px solid rgba(62, 207, 207, 0.25)",
                fontSize: "12px",
                color: "#3ecfcf",
                fontWeight: 600,
              }}
            >
              <HeartPulse size={13} /> Clinical IT Admin: Medical &amp; Clinical Asset Scope (Read-Only)
            </span>
          )}
          {isSocAnalyst && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "6px",
                background: "rgba(56, 189, 248, 0.08)",
                border: "1px solid rgba(56, 189, 248, 0.25)",
                fontSize: "12px",
                color: "#38bdf8",
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={13} /> SOC Analyst: Monitored Asset Telemetry (Read-Only)
            </span>
          )}
          {viewMode === "add" && canAddAsset && (
            <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.45)" }}>
              * Indicates mandatory registration field
            </span>
          )}
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: ADD NEW ASSET SCREEN (Exact Match to User Reference Image)
          ========================================================================= */}
      {viewMode === "add" && canAddAsset ? (
        <div>
          {/* Header */}
          <div style={{ marginBottom: "22px", textAlign: "left" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#ffffff",
                margin: "0 0 6px 0",
                letterSpacing: "-0.4px",
              }}
            >
              Add New Asset
            </h1>
            <p
              style={{
                fontSize: "13.5px",
                color: "rgba(255, 255, 255, 0.55)",
                margin: 0,
              }}
            >
              Register a medical or IT device into the AI-ACDS asset inventory.
            </p>
          </div>

          {/* Form Card Container */}
          <div
            style={{
              background: "#0a0f14",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "26px 30px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              boxSizing: "border-box",
            }}
          >
            {/* Section Header: Asset Details */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "24px",
                paddingBottom: "14px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              <HardDrive size={16} color="rgba(255, 255, 255, 0.7)" />
              <span>Asset Details</span>
            </div>

            <form onSubmit={handleSaveAsset}>
              {/* Form Grid: 3 Columns */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px 24px",
                  marginBottom: "20px",
                }}
              >
                {/* Field 1: Device / Asset Name * */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.75)",
                      marginBottom: "8px",
                    }}
                  >
                    Device / Asset Name <span style={{ color: "#f87171" }}>*</span>
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Tag
                      size={15}
                      style={{
                        position: "absolute",
                        left: "14px",
                        color: "rgba(255, 255, 255, 0.4)",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="e.g. Infusion Pump ICU-04"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      style={{
                        width: "100%",
                        height: "42px",
                        background: "#06090e",
                        border: formErrors.name
                          ? "1px solid #ef4444"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "0 14px 0 42px",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.15s ease",
                      }}
                      onFocus={(e) => {
                        if (!formErrors.name) e.target.style.borderColor = "#3ecfcf";
                      }}
                      onBlur={(e) => {
                        if (!formErrors.name)
                          e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      }}
                    />
                  </div>
                  {formErrors.name && (
                    <div style={{ fontSize: "11px", color: "#f87171", marginTop: "4px" }}>
                      {formErrors.name}
                    </div>
                  )}
                </div>

                {/* Field 2: Device Type */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.75)",
                      marginBottom: "8px",
                    }}
                  >
                    Device Type
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <ChevronsUpDown
                      size={15}
                      style={{
                        position: "absolute",
                        left: "14px",
                        color: "rgba(255, 255, 255, 0.4)",
                        pointerEvents: "none",
                      }}
                    />
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      style={{
                        width: "100%",
                        height: "42px",
                        background: "#06090e",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "0 14px 0 42px",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        outline: "none",
                        cursor: "pointer",
                        boxSizing: "border-box",
                      }}
                    >
                      {deviceTypeOptions.map((opt) => (
                        <option key={opt} value={opt} style={{ background: "#0a0f14" }}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field 3: Department */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.75)",
                      marginBottom: "8px",
                    }}
                  >
                    Department
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Building2
                      size={15}
                      style={{
                        position: "absolute",
                        left: "14px",
                        color: "rgba(255, 255, 255, 0.4)",
                        pointerEvents: "none",
                      }}
                    />
                    <select
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      style={{
                        width: "100%",
                        height: "42px",
                        background: "#06090e",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "0 14px 0 42px",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        outline: "none",
                        cursor: "pointer",
                        boxSizing: "border-box",
                      }}
                    >
                      {departmentOptions.map((dept) => (
                        <option key={dept} value={dept} style={{ background: "#0a0f14" }}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field 4: IP Address */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.75)",
                      marginBottom: "8px",
                    }}
                  >
                    IP Address
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Network
                      size={15}
                      style={{
                        position: "absolute",
                        left: "14px",
                        color: "rgba(255, 255, 255, 0.4)",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="10.24.118.42"
                      value={formData.ip}
                      onChange={(e) => handleInputChange("ip", e.target.value)}
                      style={{
                        width: "100%",
                        height: "42px",
                        background: "#06090e",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "0 14px 0 42px",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontFamily: "'JetBrains Mono', monospace",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.15s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#3ecfcf")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")}
                    />
                  </div>
                </div>

                {/* Field 5: MAC Address */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.75)",
                      marginBottom: "8px",
                    }}
                  >
                    MAC Address
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Cpu
                      size={15}
                      style={{
                        position: "absolute",
                        left: "14px",
                        color: "rgba(255, 255, 255, 0.4)",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="AC:12:5E:8B:44:0F"
                      value={formData.mac}
                      onChange={(e) => handleInputChange("mac", e.target.value)}
                      style={{
                        width: "100%",
                        height: "42px",
                        background: "#06090e",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "0 14px 0 42px",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontFamily: "'JetBrains Mono', monospace",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.15s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#3ecfcf")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")}
                    />
                  </div>
                </div>

                {/* Field 6: Location */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.75)",
                      marginBottom: "8px",
                    }}
                  >
                    Location
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <MapPin
                      size={15}
                      style={{
                        position: "absolute",
                        left: "14px",
                        color: "rgba(255, 255, 255, 0.4)",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Block B · Floor 3 · Bay 12"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      style={{
                        width: "100%",
                        height: "42px",
                        background: "#06090e",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "0 14px 0 42px",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.15s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#3ecfcf")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")}
                    />
                  </div>
                </div>

                {/* Field 7: Operating System / Firmware */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.75)",
                      marginBottom: "8px",
                    }}
                  >
                    Operating System / Firmware
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Cpu
                      size={15}
                      style={{
                        position: "absolute",
                        left: "14px",
                        color: "rgba(255, 255, 255, 0.4)",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Embedded Linux 4.19"
                      value={formData.osFirmware}
                      onChange={(e) => handleInputChange("osFirmware", e.target.value)}
                      style={{
                        width: "100%",
                        height: "42px",
                        background: "#06090e",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "0 14px 0 42px",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.15s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#3ecfcf")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")}
                    />
                  </div>
                </div>

                {/* Field 8: Vendor / Manufacturer */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.75)",
                      marginBottom: "8px",
                    }}
                  >
                    Vendor / Manufacturer
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Factory
                      size={15}
                      style={{
                        position: "absolute",
                        left: "14px",
                        color: "rgba(255, 255, 255, 0.4)",
                        pointerEvents: "none",
                      }}
                    />
                    <select
                      value={formData.vendor}
                      onChange={(e) => handleInputChange("vendor", e.target.value)}
                      style={{
                        width: "100%",
                        height: "42px",
                        background: "#06090e",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "0 14px 0 42px",
                        color: formData.vendor === "Select vendor" ? "rgba(255, 255, 255, 0.5)" : "#ffffff",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        outline: "none",
                        cursor: "pointer",
                        boxSizing: "border-box",
                      }}
                    >
                      {vendorOptions.map((v) => (
                        <option key={v} value={v} style={{ background: "#0a0f14", color: "#ffffff" }}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field 9: Asset Owner */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.75)",
                      marginBottom: "8px",
                    }}
                  >
                    Asset Owner
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <User
                      size={15}
                      style={{
                        position: "absolute",
                        left: "14px",
                        color: "rgba(255, 255, 255, 0.4)",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Biomedical Engineering"
                      value={formData.owner}
                      onChange={(e) => handleInputChange("owner", e.target.value)}
                      style={{
                        width: "100%",
                        height: "42px",
                        background: "#06090e",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "0 14px 0 42px",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.15s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#3ecfcf")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")}
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Criticality Level (2 cols) & Monitoring Status (1 col) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "20px 24px",
                  marginBottom: "20px",
                }}
              >
                {/* Criticality Level Selector */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.75)",
                      marginBottom: "8px",
                    }}
                  >
                    Criticality Level
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {criticalityLevels.map((lvl) => {
                      const isSelected = formData.criticality === lvl;
                      let activeBg = "#1e293b";
                      let activeBorder = "rgba(255, 255, 255, 0.2)";
                      let activeColor = "#ffffff";

                      if (isSelected) {
                        if (lvl === "Life Critical") {
                          activeBg = "#ef4444";
                          activeBorder = "#ef4444";
                          activeColor = "#ffffff";
                        } else if (lvl === "High") {
                          activeBg = "#854d0e";
                          activeBorder = "#a16207";
                          activeColor = "#fef08a";
                        } else if (lvl === "Medium") {
                          activeBg = "#1e3a8a";
                          activeBorder = "#2563eb";
                          activeColor = "#93c5fd";
                        } else {
                          activeBg = "#334155";
                          activeBorder = "#475569";
                          activeColor = "#cbd5e1";
                        }
                      }

                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleInputChange("criticality", lvl)}
                          style={{
                            padding: "9px 18px",
                            borderRadius: "7px",
                            fontSize: "12.5px",
                            fontWeight: isSelected ? "700" : "500",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            border: isSelected
                              ? `1px solid ${activeBorder}`
                              : "1px solid rgba(255, 255, 255, 0.1)",
                            background: isSelected
                              ? activeBg
                              : "rgba(255, 255, 255, 0.04)",
                            color: isSelected ? activeColor : "rgba(255, 255, 255, 0.65)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {lvl === "Life Critical" && (
                            <HeartPulse size={14} color={isSelected ? "#ffffff" : "#f87171"} />
                          )}
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Monitoring Status Toggle Button */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.75)",
                      marginBottom: "8px",
                    }}
                  >
                    Monitoring Status
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange("monitoringStatus", !formData.monitoringStatus)
                    }
                    style={{
                      width: "100%",
                      height: "42px",
                      background: formData.monitoringStatus
                        ? "rgba(16, 185, 129, 0.16)"
                        : "rgba(255, 255, 255, 0.04)",
                      border: formData.monitoringStatus
                        ? "1px solid rgba(16, 185, 129, 0.35)"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: formData.monitoringStatus ? "#22c55e" : "rgba(255, 255, 255, 0.5)",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 18px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: formData.monitoringStatus ? "#22c55e" : "#64748b",
                        }}
                      />
                      <span>{formData.monitoringStatus ? "Enabled" : "Disabled"}</span>
                    </div>

                    {/* Visual toggle slider element */}
                    <div
                      style={{
                        width: "36px",
                        height: "18px",
                        borderRadius: "10px",
                        background: formData.monitoringStatus ? "#15803d" : "rgba(255,255,255,0.1)",
                        position: "relative",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: "#ffffff",
                          position: "absolute",
                          top: "2px",
                          left: formData.monitoringStatus ? "20px" : "2px",
                          transition: "left 0.2s ease",
                        }}
                      />
                    </div>
                  </button>
                </div>
              </div>

              {/* Row 5: Notes */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.75)",
                    marginBottom: "8px",
                  }}
                >
                  Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Maintenance window, VLAN segment, patch history or clinical usage context..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  style={{
                    width: "100%",
                    background: "#06090e",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "vertical",
                    transition: "border-color 0.15s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3ecfcf")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")}
                />
              </div>

              {/* Row 6: Information Banner (Image Match) */}
              <div
                style={{
                  background: "#080d12",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "26px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "rgba(255, 255, 255, 0.8)",
                    flexShrink: 0,
                  }}
                >
                  i
                </div>
                <div
                  style={{
                    fontSize: "12.5px",
                    color: "rgba(255, 255, 255, 0.65)",
                    lineHeight: "1.5",
                  }}
                >
                  Registered assets will be continuously monitored by the AI-ACDS platform for
                  threat detection and risk assessment.
                </div>
              </div>

              {/* Row 7: Action Buttons (Cancel / Save Asset) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "12px",
                  paddingTop: "16px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: "10px 22px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 24px",
                    background: "#93c5fd",
                    color: "#05080a",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: "0 2px 10px rgba(147, 197, 253, 0.3)",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#bfdbfe";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(147, 197, 253, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#93c5fd";
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(147, 197, 253, 0.3)";
                  }}
                >
                  <Check size={16} /> Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* =========================================================================
           VIEW 2: ASSET INVENTORY TABLE
           ========================================================================= */
        <div>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#ffffff",
                  margin: "0 0 6px 0",
                  letterSpacing: "-0.4px",
                }}
              >
                Asset Inventory
              </h1>
              <p
                style={{
                  fontSize: "13.5px",
                  color: "rgba(255, 255, 255, 0.55)",
                  margin: 0,
                }}
              >
                Monitored IoMT medical devices, clinical endpoints, and diagnostic hardware.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setViewMode("add")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 20px",
                background: "#3ecfcf",
                color: "#05080a",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 2px 12px rgba(62, 207, 207, 0.25)",
              }}
            >
              <Plus size={15} /> Add New Asset
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
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
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search asset name, IP, department or device type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  background: "#080d12",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  padding: "0 14px 0 40px",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
            </div>

            <select
              value={criticalityFilter}
              onChange={(e) => setCriticalityFilter(e.target.value)}
              style={{
                height: "40px",
                background: "#080d12",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "0 14px",
                color: "#ffffff",
                fontSize: "12.5px",
                fontFamily: "inherit",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="All">All Criticality Levels</option>
              <option value="Life Critical">Life Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Assets Inventory Card */}
          <div
            style={{
              background: "#0a0f14",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "20px 24px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2.8fr 1.6fr 1.6fr 1.2fr 100px",
                padding: "8px 16px 12px 16px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                fontSize: "11px",
                fontWeight: "700",
                color: "rgba(255, 255, 255, 0.4)",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              <div>Asset Name · Type</div>
              <div>Department · Location</div>
              <div>Network (IP / MAC)</div>
              <div>Criticality</div>
              <div style={{ textAlign: "center" }}>Status</div>
            </div>

            {/* Rows List */}
            {filteredAssets.length === 0 ? (
              <div
                style={{
                  padding: "48px 20px",
                  textAlign: "center",
                  color: "rgba(255, 255, 255, 0.4)",
                  fontSize: "13.5px",
                }}
              >
                No assets found matching your criteria.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                {filteredAssets.map((asset) => {
                  const isLifeCritical = asset.criticality === "Life Critical";
                  const isHigh = asset.criticality === "High";

                  return (
                    <div
                      key={asset.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2.8fr 1.6fr 1.6fr 1.2fr 100px",
                        padding: "14px 16px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: "8px",
                        alignItems: "center",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(62, 207, 207, 0.03)";
                        e.currentTarget.style.borderColor = "rgba(62, 207, 207, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                      }}
                    >
                      {/* Name & Type */}
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff", marginBottom: "3px" }}>
                          {asset.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.45)" }}>
                          {asset.type} · {asset.vendor}
                        </div>
                      </div>

                      {/* Department & Location */}
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255, 255, 255, 0.85)", marginBottom: "3px" }}>
                          {asset.department}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "rgba(255, 255, 255, 0.4)" }}>
                          {asset.location}
                        </div>
                      </div>

                      {/* Network Telemetry */}
                      <div>
                        <div
                          style={{
                            fontSize: "12.5px",
                            fontFamily: "'JetBrains Mono', monospace",
                            color: "#3ecfcf",
                            marginBottom: "2px",
                          }}
                        >
                          {asset.ip}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontFamily: "'JetBrains Mono', monospace",
                            color: "rgba(255, 255, 255, 0.35)",
                          }}
                        >
                          {asset.mac}
                        </div>
                      </div>

                      {/* Criticality */}
                      <div>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "11.5px",
                            fontWeight: "700",
                            background: isLifeCritical
                              ? "rgba(239, 68, 68, 0.15)"
                              : isHigh
                              ? "rgba(249, 115, 22, 0.15)"
                              : "rgba(255, 255, 255, 0.05)",
                            color: isLifeCritical
                              ? "#f87171"
                              : isHigh
                              ? "#fb923c"
                              : "rgba(255, 255, 255, 0.7)",
                            border: isLifeCritical
                              ? "1px solid rgba(239, 68, 68, 0.35)"
                              : isHigh
                              ? "1px solid rgba(249, 115, 22, 0.35)"
                              : "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          {isLifeCritical && <HeartPulse size={12} />}
                          {asset.criticality}
                        </span>
                      </div>

                      {/* Status */}
                      <div style={{ textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: "6px",
                            fontSize: "11.5px",
                            fontWeight: "700",
                            background:
                              asset.riskPosture === "Quarantined"
                                ? "rgba(239, 68, 68, 0.15)"
                                : asset.riskPosture === "Investigating"
                                ? "rgba(245, 158, 11, 0.15)"
                                : "rgba(16, 185, 129, 0.12)",
                            color:
                              asset.riskPosture === "Quarantined"
                                ? "#f87171"
                                : asset.riskPosture === "Investigating"
                                ? "#fbbf24"
                                : "#22c55e",
                            border:
                              asset.riskPosture === "Quarantined"
                                ? "1px solid rgba(239, 68, 68, 0.35)"
                                : asset.riskPosture === "Investigating"
                                ? "1px solid rgba(245, 158, 11, 0.35)"
                                : "1px solid rgba(16, 185, 129, 0.25)",
                          }}
                        >
                          {asset.riskPosture}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
