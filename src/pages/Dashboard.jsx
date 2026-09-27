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
} from "lucide-react";
import "./Dashboard.css";
import AlertsView, { INITIAL_ALERTS } from "./alerts/AlertsView";
import IncidentInvestigationView from "./investigation/IncidentInvestigationView";

export default function Dashboard() {
  const { userProfile, currentUser, logout } = useAuth();
  const { roleId, tab } = useParams();
  const navigate = useNavigate();
  const [selectedAlert, setSelectedAlert] = useState(INITIAL_ALERTS[0]);

  // Format internal database role keys to proper operational titles
  const formatRole = (role) => {
    if (!role) return "SOC Analyst";
    const r = role.toLowerCase().trim();
    if (
      r === "engineer" ||
      r === "network-admin" ||
      r === "network admin" ||
      r === "network administrator"
    ) {
      return "Network Administrator";
    }
    if (r === "analyst" || r === "soc-analyst" || r === "soc analyst") {
      return "SOC Analyst";
    }
    if (
      r === "responder" ||
      r === "medical-staff" ||
      r === "clinical it lead" ||
      r === "clinical-it-lead" ||
      r === "clinical-it-admin"
    ) {
      return "Clinical IT Lead";
    }
    return role;
  };

  // Determine active operational role dynamically from route, session, or profile
  const resolveRole = () => {
    if (roleId) {
      const lower = roleId.toLowerCase().trim();
      if (lower === "soc-analyst" || lower === "analyst") return "SOC Analyst";
      if (
        lower === "network-admin" ||
        lower === "network-administrator" ||
        lower === "engineer"
      ) {
        return "Network Administrator";
      }
      if (
        lower === "clinical-it-lead" ||
        lower === "clinical-it-admin" ||
        lower === "medical-staff" ||
        lower === "responder"
      ) {
        return "Clinical IT Lead";
      }
    }

    const sessionRole = sessionStorage.getItem("activeRole");
    if (sessionRole) {
      return formatRole(sessionRole);
    }

    return formatRole(userProfile?.role);
  };

  const resolveRoleId = () => {
    if (roleId) {
      const lower = roleId.toLowerCase().trim();
      if (lower === "soc-analyst" || lower === "analyst") return "soc-analyst";
      if (
        lower === "network-admin" ||
        lower === "network-administrator" ||
        lower === "engineer"
      ) {
        return "network-admin";
      }
      if (
        lower === "clinical-it-lead" ||
        lower === "clinical-it-admin" ||
        lower === "medical-staff"
      ) {
        return "clinical-it-lead";
      }
      return lower;
    }
    const sessionRoleId = sessionStorage.getItem("activeRoleId");
    if (sessionRoleId) return sessionRoleId;
    const roleMap = {
      "SOC Analyst": "soc-analyst",
      "Network Administrator": "network-admin",
      "Clinical IT Lead": "clinical-it-lead",
    };
    return roleMap[userProfile?.role] || "network-admin";
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

  // Role-specific operational scope definitions
  const ROLE_CONFIGS = {
    "SOC Analyst": {
      title: "SOC Analyst",
      eyebrow: "SECURITY OPERATIONS CENTER · INCIDENT TRIAGE",
      subtitle:
        "Real-time threat detection, automated triage pipeline, and explainable AI mitigation telemetry.",
    },
    "Network Administrator": {
      title: "Network Administrator",
      eyebrow: "INFRASTRUCTURE OPS · NETWORK TOPOLOGY",
      subtitle:
        "Real-time clinical VLAN posture, device connectivity, and automated node isolation controls.",
    },
    "Clinical IT Lead": {
      title: "Clinical IT Lead",
      eyebrow: "CLINICAL SYSTEMS GOVERNANCE · PATIENT SAFETY",
      subtitle:
        "Real-time healthcare IoMT operational integrity, system compliance, and clinical safety telemetry.",
    },
  };

  const roleMeta = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS["SOC Analyst"];

  // Navigation menu items for the sidebar with URL slug paths
  const navItems = [
    { label: "Home", icon: Home, path: "home" },
    { label: "Alerts", icon: Bell, path: "alerts" },
    { label: "Assets", icon: Layers, path: "assets" },
    { label: "Forensics", icon: Search, path: "forensics" },
    { label: "Incident Investigation", icon: FileCheck, path: "investigation" },
    { label: "Settings", icon: Settings, path: "settings" },
  ];

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
      asset: "NA",
      description: "TBD — awaiting threat detection model output",
    },
    {
      id: "alert-2",
      severity: "high",
      asset: "NA",
      description: "TBD — awaiting threat detection model output",
    },
    {
      id: "alert-3",
      severity: "high",
      asset: "NA",
      description: "TBD — awaiting threat detection model output",
    },
  ];

  const responseStages = [
    {
      id: "stage-1",
      name: "Threat Detection",
      modelOutput: "TBD — awaiting model output",
    },
    {
      id: "stage-2",
      name: "Explainable AI Analysis",
      modelOutput: "TBD — awaiting model output",
    },
    {
      id: "stage-3",
      name: "Threat Containment",
      modelOutput: "TBD — awaiting model output",
    },
    {
      id: "stage-4",
      name: "Security Verification",
      modelOutput: "TBD — awaiting model output",
    },
    {
      id: "stage-5",
      name: "Incident Reporting & Compliance",
      modelOutput: "TBD — awaiting model output",
    },
  ];

  const handleInvestigateAlert = (alert) => {
    setSelectedAlert(alert);
    navigate(`/dashboard/${currentRoleId}/investigation`);
  };

  return (
    <div className="dash-root">
      {/* Left Sidebar - Exact Original Structure with URL-based navigation */}
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
        {/* Top Bar - Exact Original Header Layout */}
        <header className="dash-header">
          <div className="dash-header-left">
            <span className="dash-eyebrow">
              {activeNav === "Alerts"
                ? "SECURITY OPERATIONS CENTER · REAL-TIME TRIAGE"
                : activeNav === "Incident Investigation"
                ? "SECURITY OPERATIONS CENTER · INCIDENT INVESTIGATION"
                : roleMeta.eyebrow}
            </span>
            <h1 className="dash-title">
              {activeNav === "Alerts"
                ? "Security Alerts"
                : activeNav === "Incident Investigation"
                ? "Incident Investigation"
                : "Home Dashboard"}
            </h1>
            <p className="dash-subtitle">
              {activeNav === "Alerts"
                ? "Real-time threat detection, IoMT telemetry triage, and autonomous mitigation controls."
                : activeNav === "Incident Investigation"
                ? "Detailed AI-based threat analysis, explainability metrics, and mitigation controls."
                : roleMeta.subtitle}
            </p>
          </div>

          <div className="dash-header-right">
            <div className="dash-user-info">
              <span className="dash-user-name">
                {userProfile?.fullName || currentUser?.displayName || "Error occurred: Refresh Page"}
              </span>
              <span className="dash-user-role">
                {currentRole}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="dash-body">
          {activeNav === "Alerts" ? (
            /* Alerts screen shown when URL is /dashboard/:roleId/alerts */
            <AlertsView onInvestigateAlert={handleInvestigateAlert} />
          ) : activeNav === "Incident Investigation" ? (
            /* Incident Investigation screen shown when URL is /dashboard/:roleId/investigation */
            <IncidentInvestigationView
              alert={selectedAlert}
              onBack={() => navigate(`/dashboard/${currentRoleId}/alerts`)}
            />
          ) : (
            /* Home Dashboard shown when URL is /dashboard/:roleId/home */
            <>
              {/* KPI Row (5 Metrics) */}
              <section className="dash-kpi-grid">
                <div className="dash-kpi-card">
                  <span className="dash-kpi-label">Active threats</span>
                  <span className="dash-kpi-value">TBD</span>
                  <span className="dash-kpi-hint">GET /api/v1/telemetry/threats/active</span>
                </div>

                <div className="dash-kpi-card">
                  <span className="dash-kpi-label">Open incidents (H/C)</span>
                  <span className="dash-kpi-value">TBD</span>
                  <span className="dash-kpi-hint">GET /api/v1/incidents/open</span>
                </div>

                <div className="dash-kpi-card">
                  <span className="dash-kpi-label">Avg response latency</span>
                  <span className="dash-kpi-value">TBD</span>
                  <span className="dash-kpi-hint">GET /api/v1/metrics/latency</span>
                </div>

                <div className="dash-kpi-card">
                  <span className="dash-kpi-label">Explainability coverage</span>
                  <span className="dash-kpi-value">TBD</span>
                  <span className="dash-kpi-hint">GET /api/v1/explainability/coverage</span>
                </div>

                <div className="dash-kpi-card">
                  <span className="dash-kpi-label">Devices monitored</span>
                  <span className="dash-kpi-value">TBD</span>
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