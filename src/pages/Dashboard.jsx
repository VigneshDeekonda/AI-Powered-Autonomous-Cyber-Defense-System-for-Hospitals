import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  Bell,
  Layers,
  Search,
  FileCheck,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Activity,
  HeartPulse,
} from "lucide-react";
import "./Dashboard.css";
import AlertsView, { INITIAL_ALERTS } from "./alerts/AlertsView";
import IncidentInvestigationView from "./investigation/IncidentInvestigationView";
import ForensicsView from "./forensics/ForensicsView";
import AssetsView from "./assets/AssetsView";
import AccessDenied from "../components/AccessDenied";
import {
  ROLES,
  ROLE_KEYS,
  hasPermission,
  normalizeRole,
  getRoleKey,
} from "../utils/rbac";

export default function Dashboard() {
  const { userProfile, currentUser, logout } = useAuth();
  const { roleId, tab, subId } = useParams();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState(INITIAL_ALERTS[0]);

  const handleUpdateAlertStatus = (alertId, newStatus, newResponseStatus) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((a) =>
        a.id === alertId
          ? {
              ...a,
              detectionStatus: newStatus,
              responseStatus: newResponseStatus || a.responseStatus,
            }
          : a
      )
    );
    setSelectedAlert((prev) =>
      prev && prev.id === alertId
        ? {
            ...prev,
            detectionStatus: newStatus,
            responseStatus: newResponseStatus || prev.responseStatus,
          }
        : prev
    );
  };

  // Determine active operational role dynamically from route, session, or profile
  const resolveRole = () => {
    if (roleId) return normalizeRole(roleId);
    const sessionRole = sessionStorage.getItem("activeRole");
    if (sessionRole) return normalizeRole(sessionRole);
    return normalizeRole(userProfile?.role);
  };

  const resolveRoleId = () => {
    if (roleId) return getRoleKey(roleId);
    const sessionRoleId = sessionStorage.getItem("activeRoleId");
    if (sessionRoleId) return sessionRoleId;
    return getRoleKey(userProfile?.role);
  };

  const currentRole = resolveRole();
  const currentRoleId = resolveRoleId();

  // Tab mapping for clean URLs: /dashboard/:roleId/home, /dashboard/:roleId/alerts, etc.
  const TAB_MAP = {
    home: "Home",
    alerts: "Alerts",
    assets: "Assets",
    forensics: "Forensics",
    investigation: "Incident Investigation",
    "incident-investigation": "Incident Investigation",
    settings: "Settings",
  };

  const activeNav = (tab && TAB_MAP[tab.toLowerCase()]) || "Home";

  // Redirect to /dashboard/:roleId/home if no sub-tab is specified in URL
  useEffect(() => {
    if (!tab) {
      navigate(`/dashboard/${currentRoleId}/home`, { replace: true });
    }
  }, [tab, currentRoleId, navigate]);

  // Tab-level RBAC permission mapping
  const tabPermissionMap = {
    home: "VIEW_DASHBOARD",
    alerts: "VIEW_ALERTS",
    assets: "VIEW_ASSETS",
    forensics: "VIEW_FORENSICS",
    investigation: "VIEW_INVESTIGATION",
    "incident-investigation": "VIEW_INVESTIGATION",
    settings: "VIEW_SETTINGS",
  };

  const currentTabKey = (tab || "home").toLowerCase();
  const activePermission = tabPermissionMap[currentTabKey] || "VIEW_DASHBOARD";
  const isAuthorized = hasPermission(currentRole, activePermission);

  // Switch role handler for header role switcher
  const handleSwitchRole = (newRoleTitle) => {
    const newRoleKey = getRoleKey(newRoleTitle);
    sessionStorage.setItem("activeRole", newRoleTitle);
    sessionStorage.setItem("activeRoleId", newRoleKey);

    // If current tab is authorized for the new role, remain on tab; otherwise go to home
    if (hasPermission(newRoleTitle, activePermission)) {
      navigate(`/dashboard/${newRoleKey}/${tab || "home"}`);
    } else {
      navigate(`/dashboard/${newRoleKey}/home`);
    }
  };

  // Role-specific operational scope definitions
  const ROLE_CONFIGS = {
    [ROLES.SOC_ANALYST]: {
      title: "SOC Analyst",
      eyebrow: "SECURITY OPERATIONS CENTER · REAL-TIME TRIAGE",
      subtitle:
        "Real-time threat detection, IoMT telemetry triage, and autonomous explainable mitigation pipeline.",
    },
    [ROLES.NETWORK_ADMIN]: {
      title: "Network Administrator",
      eyebrow: "INFRASTRUCTURE OPS · NETWORK TOPOLOGY & QUARANTINE",
      subtitle:
        "Real-time clinical VLAN posture, device connectivity, and automated node isolation controls.",
    },
    [ROLES.CLINICAL_IT_ADMIN]: {
      title: "Clinical IT Admin",
      eyebrow: "CLINICAL SYSTEMS GOVERNANCE · PATIENT SAFETY & CONTINUITY",
      subtitle:
        "Real-time healthcare IoMT operational integrity, bedside continuity, and clinical containment governance.",
    },
  };

  const roleMeta = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS[ROLES.SOC_ANALYST];

  // Navigation menu items filtered dynamically by RBAC permissions
  const allNavItems = [
    { label: "Home", icon: Home, path: "home", permission: "VIEW_DASHBOARD" },
    { label: "Alerts", icon: Bell, path: "alerts", permission: "VIEW_ALERTS" },
    { label: "Assets", icon: Layers, path: "assets", permission: "VIEW_ASSETS" },
    { label: "Forensics", icon: Search, path: "forensics", permission: "VIEW_FORENSICS" },
    { label: "Incident Investigation", icon: FileCheck, path: "investigation", permission: "VIEW_INVESTIGATION" },
    { label: "Settings", icon: Settings, path: "settings", permission: "VIEW_SETTINGS" },
  ];

  const navItems = allNavItems.filter((item) =>
    hasPermission(currentRole, item.permission)
  );

  // Asset Inventory placeholder
  const placeholderAssets = [
    { id: "asset-1", name: "Ventilator-1", status: "normal" },
    { id: "asset-2", name: "Ventilator-3", status: "isolated" },
    { id: "asset-3", name: "Infusion-2", status: "at_risk" },
    { id: "asset-4", name: "Cardiac-4", status: "normal" },
    { id: "asset-5", name: "MRI-1", status: "normal" },
    { id: "asset-6", name: "EHR-1", status: "at_risk" },
    { id: "asset-7", name: "EHR-2", status: "normal" },
    { id: "asset-8", name: "Admin-04", status: "normal" },
    { id: "asset-9", name: "Admin-12", status: "normal" },
    { id: "asset-10", name: "Pharmacy-1", status: "normal" },
  ];

  const placeholderAlerts = [
    {
      id: "alert-1",
      severity: "critical",
      asset: "Infusion Pump ICU-04",
      description: "IoMT Firmware Command Injection attempting dosage override",
    },
    {
      id: "alert-2",
      severity: "critical",
      asset: "PACS Imaging Server 01",
      description: "Ransomware Lateral Movement burst targeting DICOM shares",
    },
    {
      id: "alert-3",
      severity: "high",
      asset: "ICU Ventilator-3",
      description: "DDoS Telemetry Flood targeting telemetry port 8080",
    },
  ];

  const responseStages = [
    {
      id: "stage-1",
      name: "Threat Detection",
      modelOutput: "Anomalous Packet Payload Tripped Behavioral Baseline",
    },
    {
      id: "stage-2",
      name: "Explainable AI Analysis",
      modelOutput: "Root Cause: CAN-Bus Bridge Override (99.4% Conf)",
    },
    {
      id: "stage-3",
      name: "Threat Containment",
      modelOutput: "Automated VLAN 99 Quarantine Isolation",
    },
    {
      id: "stage-4",
      name: "Security Verification",
      modelOutput: "Network Egress Verified Blocked · Ingress Dropped",
    },
    {
      id: "stage-5",
      name: "Incident Reporting & Compliance",
      modelOutput: "Cryptographic Incident Hash Pinned to HIPAA Ledger",
    },
  ];

  const handleInvestigateAlert = (alert) => {
    setSelectedAlert(alert);
    navigate(`/dashboard/${currentRoleId}/investigation`);
  };

  return (
    <div className="dash-root">
      {/* Left Sidebar - Exact Original Structure with URL-based navigation & Dynamic RBAC */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-top">
          <span className="dash-nav-header">NAVIGATION</span>

          <nav className="dash-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`dash-nav-btn ${isActive ? "active" : ""}`}
                  onClick={() => navigate(`/dashboard/${currentRoleId}/${item.path}`)}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="dash-sidebar-bottom">
          <button type="button" className="dash-logout-btn" onClick={logout}>
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dash-main-area">
        {/* Top Bar - Header Layout with RBAC Role Switcher */}
        <header className="dash-header">
          <div className="dash-header-left">
            <span className="dash-eyebrow">
              {activeNav === "Alerts"
                ? "SECURITY OPERATIONS CENTER · REAL-TIME TRIAGE"
                : activeNav === "Incident Investigation"
                ? currentRole === ROLES.CLINICAL_IT_ADMIN
                  ? "CLINICAL SYSTEMS GOVERNANCE · PATIENT SAFETY & APPROVAL"
                  : "SECURITY OPERATIONS CENTER · INCIDENT INVESTIGATION"
                : activeNav === "Forensics"
                ? "DIGITAL FORENSICS REPOSITORY · TAMPER-PROOF CHAIN OF CUSTODY"
                : activeNav === "Assets"
                ? currentRole === ROLES.CLINICAL_IT_ADMIN
                  ? "CLINICAL ASSET GOVERNANCE · MEDICAL DEVICE STATUS"
                  : "CLINICAL ASSET GOVERNANCE · INVENTORY & REGISTRATION"
                : activeNav === "Settings"
                ? "SYSTEM SETTINGS"
                : roleMeta.eyebrow}
            </span>
            <h1 className="dash-title">
              {activeNav === "Alerts"
                ? "Security Alerts"
                : activeNav === "Incident Investigation"
                ? currentRole === ROLES.CLINICAL_IT_ADMIN
                  ? "Clinical Containment Approval"
                  : "Incident Investigation"
                : activeNav === "Forensics"
                ? "Forensics"
                : activeNav === "Assets"
                ? "Assets"
                : activeNav === "Settings"
                ? "Settings"
                : currentRole === ROLES.CLINICAL_IT_ADMIN
                ? "Clinical Safety Dashboard"
                : currentRole === ROLES.NETWORK_ADMIN
                ? "Infrastructure Dashboard"
                : "SOC Monitoring Dashboard"}
            </h1>
            <p className="dash-subtitle">
              {activeNav === "Alerts"
                ? currentRole === ROLES.CLINICAL_IT_ADMIN
                  ? "Review clinical impact of cyber threats and verify patient safety."
                  : "Real-time threat detection, IoMT telemetry triage, and autonomous mitigation controls."
                : activeNav === "Incident Investigation"
                ? currentRole === ROLES.CLINICAL_IT_ADMIN
                  ? "Evaluate patient safety impact and authorize or reject medical device quarantine isolation."
                  : "Detailed AI-based threat analysis, explainability metrics, and mitigation controls."
                : activeNav === "Forensics"
                ? "Tamper-proof evidence collected from autonomous investigations."
                : activeNav === "Assets"
                ? currentRole === ROLES.CLINICAL_IT_ADMIN
                  ? "Monitor clinical IoMT equipment, operational state, and bedside connectivity."
                  : "Register and manage medical and IT devices in the hospital inventory."
                : activeNav === "Settings"
                ? "System configuration and operational preferences."
                : roleMeta.subtitle}
            </p>
          </div>

          <div className="dash-header-right">
            {/* Interactive Role Switcher */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                padding: "6px 12px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  color: "rgba(255, 255, 255, 0.45)",
                }}
              >
                Active Role:
              </span>
              <select
                value={currentRole}
                onChange={(e) => handleSwitchRole(e.target.value)}
                style={{
                  background: "#06090e",
                  border: "1px solid rgba(62, 207, 207, 0.35)",
                  color: "#3ecfcf",
                  borderRadius: "6px",
                  padding: "5px 10px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              >
                <option value={ROLES.NETWORK_ADMIN}>Network Administrator</option>
                <option value={ROLES.SOC_ANALYST}>SOC Analyst</option>
                <option value={ROLES.CLINICAL_IT_ADMIN}>Clinical IT Admin</option>
              </select>
            </div>

            <div className="dash-user-info">
              <span className="dash-user-name">
                {userProfile?.fullName || currentUser?.displayName || "System Operator"}
              </span>
              <span className="dash-user-role">
                {currentRole}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="dash-body">
          {/* RBAC Route Guard */}
          {!isAuthorized ? (
            <AccessDenied userRole={currentRole} resourceName={activeNav} />
          ) : activeNav === "Alerts" ? (
            /* Alerts screen shown when URL is /dashboard/:roleId/alerts */
            <AlertsView
              alerts={alerts}
              onInvestigateAlert={handleInvestigateAlert}
              onUpdateStatus={handleUpdateAlertStatus}
              userRole={currentRole}
            />
          ) : activeNav === "Incident Investigation" ? (
            /* Incident Investigation screen shown when URL is /dashboard/:roleId/investigation */
            <IncidentInvestigationView
              alert={selectedAlert}
              onBack={() => navigate(`/dashboard/${currentRoleId}/alerts`)}
              onUpdateStatus={handleUpdateAlertStatus}
              userRole={currentRole}
            />
          ) : activeNav === "Forensics" ? (
            /* Forensics screen shown when URL is /dashboard/:roleId/forensics */
            <ForensicsView userRole={currentRole} />
          ) : activeNav === "Assets" ? (
            /* Assets screen shown when URL is /dashboard/:roleId/assets */
            <AssetsView userRole={currentRole} />
          ) : activeNav === "Settings" ? (
            /* Settings screen */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "360px",
                background: "#0a0f14",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "40px 20px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.75)",
                  letterSpacing: "-0.2px",
                }}
              >
                Not yet prepared
              </span>
            </div>
          ) : (
            /* Home Dashboard shown when URL is /dashboard/:roleId/home */
            <>
              {/* KPI Row (5 Metrics tailored per Role) */}
              <section className="dash-kpi-grid">
                <div className="dash-kpi-card">
                  <span className="dash-kpi-label">
                    {currentRole === ROLES.CLINICAL_IT_ADMIN
                      ? "Clinical Devices at Risk"
                      : "Active Threats"}
                  </span>
                  <span className="dash-kpi-value">
                    {currentRole === ROLES.CLINICAL_IT_ADMIN ? "2" : "3"}
                  </span>
                  <span className="dash-kpi-hint">
                    {currentRole === ROLES.CLINICAL_IT_ADMIN
                      ? "GET /api/v1/clinical/devices/at-risk"
                      : "GET /api/v1/telemetry/threats/active"}
                  </span>
                </div>

                <div className="dash-kpi-card">
                  <span className="dash-kpi-label">
                    {currentRole === ROLES.CLINICAL_IT_ADMIN
                      ? "Pending Clinical Sign-offs"
                      : currentRole === ROLES.NETWORK_ADMIN
                      ? "Isolated VLAN Subnets"
                      : "Open Incidents (H/C)"}
                  </span>
                  <span className="dash-kpi-value">
                    {currentRole === ROLES.CLINICAL_IT_ADMIN ? "1" : "1"}
                  </span>
                  <span className="dash-kpi-hint">
                    {currentRole === ROLES.CLINICAL_IT_ADMIN
                      ? "GET /api/v1/clinical/approvals/pending"
                      : "GET /api/v1/incidents/open"}
                  </span>
                </div>

                <div className="dash-kpi-card">
                  <span className="dash-kpi-label">
                    {currentRole === ROLES.CLINICAL_IT_ADMIN
                      ? "Patient Safety Score"
                      : "Avg Response Latency"}
                  </span>
                  <span className="dash-kpi-value">
                    {currentRole === ROLES.CLINICAL_IT_ADMIN ? "99.8%" : "420 ms"}
                  </span>
                  <span className="dash-kpi-hint">
                    {currentRole === ROLES.CLINICAL_IT_ADMIN
                      ? "GET /api/v1/clinical/safety-index"
                      : "GET /api/v1/metrics/latency"}
                  </span>
                </div>

                <div className="dash-kpi-card">
                  <span className="dash-kpi-label">
                    {currentRole === ROLES.CLINICAL_IT_ADMIN
                      ? "Clinical Continuity Guard"
                      : "Explainability Coverage"}
                  </span>
                  <span className="dash-kpi-value">100%</span>
                  <span className="dash-kpi-hint">
                    {currentRole === ROLES.CLINICAL_IT_ADMIN
                      ? "GET /api/v1/clinical/continuity"
                      : "GET /api/v1/explainability/coverage"}
                  </span>
                </div>

                <div className="dash-kpi-card">
                  <span className="dash-kpi-label">
                    {currentRole === ROLES.CLINICAL_IT_ADMIN
                      ? "IoMT Devices Monitored"
                      : "Devices Monitored"}
                  </span>
                  <span className="dash-kpi-value">
                    {currentRole === ROLES.CLINICAL_IT_ADMIN ? "142" : "318"}
                  </span>
                  <span className="dash-kpi-hint">GET /api/v1/assets/count</span>
                </div>
              </section>

              {/* Middle Layout: Asset Risk Heatmap + Topology VS Live Alert Queue */}
              <div className="dash-middle-grid">
                {/* Left Column: Asset Grid + Topology Graph Container */}
                <div className="dash-middle-left">
                  <section className="dash-panel">
                    <div className="dash-panel-header">
                      <div>
                        <h2 className="dash-panel-title">Asset risk heatmap</h2>
                        <p className="dash-panel-sub">Simulated clinical and IoMT environment</p>
                      </div>
                      <div className="dash-status-legend">
                        <span className="legend-tag legend-normal">Solid: Normal</span>
                        <span className="legend-tag legend-at-risk">Dashed: At Risk</span>
                        <span className="legend-tag legend-isolated">Filled: Isolated</span>
                      </div>
                    </div>

                    <div className="dash-asset-grid">
                      {placeholderAssets.map((asset) => (
                        <div
                          key={asset.id}
                          className={`dash-asset-node status-${asset.status}`}
                        >
                          <span className="dash-asset-name">{asset.name}</span>
                          <span className="dash-asset-badge">{asset.status}</span>
                        </div>
                      ))}
                    </div>

                    <div className="dash-topology-container">
                      <div className="dash-topology-content">
                        <Layers size={28} className="dash-topology-icon" />
                        <span className="dash-topology-text">Topology / risk surface</span>
                        <span className="dash-topology-hint">
                          Awaiting AI Network Topology &amp; Attack Graph telemetry (GET /api/v1/topology/network)
                        </span>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Live Alert Queue */}
                <aside className="dash-panel dash-alerts-panel">
                  <div className="dash-panel-header">
                    <div>
                      <h2 className="dash-panel-title">Live alert queue</h2>
                      <p className="dash-panel-sub">AI triage · explainable decisions</p>
                    </div>
                  </div>

                  <div className="dash-alerts-list">
                    {placeholderAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`dash-alert-card severity-${alert.severity}`}
                      >
                        <div className="dash-alert-header-row">
                          <span className="dash-alert-severity">{alert.severity}</span>
                          <span className="dash-alert-asset">Asset: {alert.asset}</span>
                        </div>
                        <p className="dash-alert-desc">{alert.description}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="dash-view-all-btn"
                    onClick={() => navigate(`/dashboard/${currentRoleId}/alerts`)}
                  >
                    View all alerts
                  </button>
                </aside>
              </div>

              {/* Bottom Section: Autonomous Response Timeline */}
              <section className="dash-panel dash-timeline-panel">
                <div className="dash-panel-header">
                  <div>
                    <h2 className="dash-panel-title">Autonomous response timeline</h2>
                    <p className="dash-panel-sub">
                      Automated mitigation and causal explanation pipeline
                    </p>
                  </div>
                </div>

                <div className="dash-timeline-track">
                  {responseStages.map((stage, idx) => (
                    <div key={stage.id} className="dash-timeline-step">
                      <div className="dash-stage-column">
                        <div className="dash-stage-card">
                          <span className="dash-stage-output">{stage.modelOutput}</span>
                        </div>
                        <span className="dash-stage-label-below">{stage.name}</span>
                      </div>
                      {idx < responseStages.length - 1 && (
                        <div className="dash-timeline-arrow">
                          <ChevronRight size={18} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}