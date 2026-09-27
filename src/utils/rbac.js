// Role-Based Access Control (RBAC) Definitions for AI-ACDS Hospital Cyber Defense

export const ROLES = {
  NETWORK_ADMIN: "Network Administrator",
  SOC_ANALYST: "SOC Analyst",
  CLINICAL_IT_ADMIN: "Clinical IT Admin",
};

export const ROLE_KEYS = {
  NETWORK_ADMIN: "network-admin",
  SOC_ANALYST: "soc-analyst",
  CLINICAL_IT_ADMIN: "clinical-it-admin",
};

// Normalize any database string or URL slug to standard role title
export const normalizeRole = (role) => {
  if (!role) return ROLES.NETWORK_ADMIN;
  const r = role.toLowerCase().trim();
  if (
    r === "network administrator" ||
    r === "network admin" ||
    r === "network-admin" ||
    r === "network-administrator" ||
    r === "engineer"
  ) {
    return ROLES.NETWORK_ADMIN;
  }
  if (r === "soc analyst" || r === "soc-analyst" || r === "analyst") {
    return ROLES.SOC_ANALYST;
  }
  if (
    r === "clinical it admin" ||
    r === "clinical-it-admin" ||
    r === "clinical it lead" ||
    r === "clinical-it-lead" ||
    r === "medical-staff" ||
    r === "responder"
  ) {
    return ROLES.CLINICAL_IT_ADMIN;
  }
  return role;
};

// Map normalized role to URL route key
export const getRoleKey = (role) => {
  const norm = normalizeRole(role);
  if (norm === ROLES.SOC_ANALYST) return ROLE_KEYS.SOC_ANALYST;
  if (norm === ROLES.CLINICAL_IT_ADMIN) return ROLE_KEYS.CLINICAL_IT_ADMIN;
  return ROLE_KEYS.NETWORK_ADMIN;
};

// Fine-grained permission definitions matching RBAC matrix
export const PERMISSIONS = {
  // Navigation & Page Access
  VIEW_DASHBOARD: [ROLES.NETWORK_ADMIN, ROLES.SOC_ANALYST, ROLES.CLINICAL_IT_ADMIN],
  VIEW_ALERTS: [ROLES.NETWORK_ADMIN, ROLES.SOC_ANALYST, ROLES.CLINICAL_IT_ADMIN],
  VIEW_ASSETS: [ROLES.NETWORK_ADMIN, ROLES.SOC_ANALYST, ROLES.CLINICAL_IT_ADMIN],
  ADD_ASSET: [ROLES.NETWORK_ADMIN], // Only Network Admin
  MANAGE_ASSETS: [ROLES.NETWORK_ADMIN], // Only Network Admin
  VIEW_FORENSICS: [ROLES.NETWORK_ADMIN, ROLES.SOC_ANALYST], // Hidden from Clinical IT Admin
  VIEW_INVESTIGATION: [ROLES.NETWORK_ADMIN, ROLES.SOC_ANALYST, ROLES.CLINICAL_IT_ADMIN],
  VIEW_SETTINGS: [ROLES.NETWORK_ADMIN], // Only Network Admin

  // Alert & Investigation Actions
  INVESTIGATE_ALERTS: [ROLES.NETWORK_ADMIN, ROLES.SOC_ANALYST],
  UPDATE_DETECTION_STATUS: [ROLES.NETWORK_ADMIN, ROLES.SOC_ANALYST],
  REVERIFY_ISOLATION: [ROLES.NETWORK_ADMIN, ROLES.SOC_ANALYST],
  EXPORT_INCIDENT_REPORT: [ROLES.NETWORK_ADMIN, ROLES.SOC_ANALYST],
  APPROVE_CLINICAL_CONTAINMENT: [ROLES.CLINICAL_IT_ADMIN, ROLES.NETWORK_ADMIN], // Clinical IT Admin approval workflow
  VIEW_RAW_FORENSIC_TELEMETRY: [ROLES.NETWORK_ADMIN, ROLES.SOC_ANALYST],
};

// Permission check helper
export const hasPermission = (userRole, permission) => {
  const norm = normalizeRole(userRole);
  const allowedRoles = PERMISSIONS[permission] || [];
  return allowedRoles.includes(norm);
};
