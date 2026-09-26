import { useState } from "react";
import { useParams } from "react-router-dom";
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

export default function Dashboard() {
  const { userProfile, logout } = useAuth();
  const { roleId } = useParams();
  const [activeNav, setActiveNav] = useState("Home");

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

  const currentRole = resolveRole();

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

  // Navigation menu items for the sidebar
  const navItems = [
    { label: "Home", icon: Home },
    { label: "Alerts", icon: Bell },
    { label: "Assets", icon: Layers },
    { label: "Forensics", icon: Search },
    { label: "Incident Investigation", icon: FileCheck },
    { label: "Settings", icon: Settings },
  ];

  // =========================================================================
  // AI BACKEND INTEGRATION PLACEHOLDERS
  // =========================================================================

  // TODO: Asset Inventory & Risk Status Telemetry
  // Replace this placeholder array with dynamic data from your AI asset triage model.
  // Endpoint: GET /api/v1/assets/status
  // Expected Shape: Array<{ id: string, name: string, status: "normal" | "at_risk" | "isolated" }>
  // Status mapping:
  //   - "normal": operational without detected anomalies
  //   - "at_risk": unusual traffic or behavioral signature flagged by model
  //   - "isolated": automated quarantine executed by policy agent
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

  // TODO: Live Alert Queue Stream
  // Replace this placeholder array with real-time stream data from WebSocket or polling endpoint.
  // Endpoint: GET /api/v1/alerts/live or ws://.../api/v1/alerts/stream
  // Expected Shape: Array<{ id: string, severity: "critical" | "high" | "medium", asset: string, description: string, timestamp?: string }>
  // Note for backend developers: The total count of active critical/high items here should reconcile
  // with the "Active threats" and "Open incidents" KPI cards below.
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

  // TODO: Autonomous Response Pipeline Stages
  // The table/box will display real-time content coming from the AI models.
  // Endpoint: GET /api/v1/incidents/current/timeline or SSE stream
  // Expected Shape: Array<{ id: string, name: string, modelOutput: string, timestamp?: string, status?: string }>
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

  return (
    <div className="dash-root">
      {/* Left Sidebar */}
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
                  onClick={() => setActiveNav(item.label)}
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
        {/* Top Bar: Title & Subtext (Shifted Left), Logged-in User & Role (Right) */}
        {/* TODO: Global system operational status (e.g., "All layers operational", "Mitigation active")
            must be wired dynamically to the AI backend system health check (GET /api/v1/system/status),
            not hardcoded. No mock clocks or fake logos are displayed. */}
        <header className="dash-header">
          <div className="dash-header-left">
            <span className="dash-eyebrow">{roleMeta.eyebrow}</span>
            <h1 className="dash-title">Home Dashboard</h1>
            <p className="dash-subtitle">{roleMeta.subtitle}</p>
          </div>

          <div className="dash-header-right">
            <div className="dash-user-info">
              <span className="dash-user-name">
                {userProfile?.fullName || "Vignesh Suresh Deekonda"}
              </span>
              <span className="dash-user-role">
                {currentRole}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="dash-body">
          {/* KPI Row (5 Metrics) */}
          <section className="dash-kpi-grid">
            {/* KPI 1: Active threats */}
            {/* TODO: Expected type: Integer (count).
                Source: Detection Ensemble & Correlator (Endpoint: GET /api/v1/telemetry/threats/active).
                Replace "TBD" with live count of unmitigated threat signals across network nodes. */}
            <div className="dash-kpi-card">
              <span className="dash-kpi-label">Active threats</span>
              <span className="dash-kpi-value">TBD</span>
              <span className="dash-kpi-hint">GET /api/v1/telemetry/threats/active</span>
            </div>

            {/* KPI 2: Open incidents */}
            {/* TODO: Expected type: Integer or breakdown string (e.g. "TBD (Critical: TBD, High: TBD)").
                Source: Incident Manager & Correlation Engine (Endpoint: GET /api/v1/incidents/open).
                Aggregates multiple correlated alerts into validated multi-stage attack campaigns. */}
            <div className="dash-kpi-card">
              <span className="dash-kpi-label">Open incidents (H/C)</span>
              <span className="dash-kpi-value">TBD</span>
              <span className="dash-kpi-hint">GET /api/v1/incidents/open</span>
            </div>

            {/* KPI 3: Avg response latency */}
            {/* TODO: Expected type: String/Float with unit (e.g., "18.4s" or milliseconds).
                Source: Orchestration Engine & Autonomous RL Agent (Endpoint: GET /api/v1/metrics/latency).
                Elapsed duration from anomaly detection to autonomous containment. */}
            <div className="dash-kpi-card">
              <span className="dash-kpi-label">Avg response latency</span>
              <span className="dash-kpi-value">TBD</span>
              <span className="dash-kpi-hint">GET /api/v1/metrics/latency</span>
            </div>

            {/* KPI 4: Explainability coverage */}
            {/* TODO: Expected type: Percentage string (e.g., "100%" or float 0-100).
                Source: Explainability (XAI) Pipeline (Endpoint: GET /api/v1/explainability/coverage).
                Proportion of automated mitigations with full causal reasoning trees. */}
            <div className="dash-kpi-card">
              <span className="dash-kpi-label">Explainability coverage</span>
              <span className="dash-kpi-value">TBD</span>
              <span className="dash-kpi-hint">GET /api/v1/explainability/coverage</span>
            </div>

            {/* KPI 5: Devices monitored */}
            {/* TODO: Expected type: Integer (count).
                Source: Asset Discovery & Inventory Service (Endpoint: GET /api/v1/assets/count).
                Total active connected devices streaming telemetry into the pipeline. */}
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
              {/* Asset Risk Grid */}
              {/* TODO: Connect to GET /api/v1/assets/status.
                  Render real-time device health states ("normal", "at_risk", "isolated"). */}
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

                {/* Topology / Risk Surface Box */}
                {/* TODO: This container will render the interactive force-directed network topology
                    graph / SVG node connection diagram once GET /api/v1/topology/network backend is wired. */}
                <div className="dash-topology-container">
                  <div className="dash-topology-content">
                    <Layers size={28} className="dash-topology-icon" />
                    <span className="dash-topology-text">Topology / risk surface</span>
                    <span className="dash-topology-hint">
                      Awaiting AI Network Topology & Attack Graph telemetry (GET /api/v1/topology/network)
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Live Alert Queue */}
            {/* TODO: Connect to GET /api/v1/alerts/live or WebSocket stream.
                Displays ranked triage queue with severity labels. */}
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

              <button type="button" className="dash-view-all-btn">
                View all alerts
              </button>
            </aside>
          </div>

          {/* Bottom Section: Autonomous Response Timeline */}
          {/* TODO: Connect to SSE / WebSocket endpoint GET /api/v1/incidents/current/timeline.
              Shows the RL remediation pipeline progression through the 5 stages. */}
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
        </main>
      </div>
    </div>
  );
}