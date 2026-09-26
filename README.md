#  AI-ACDS: Autonomous Cyber Defense System for Hospitals

<p align="center">
  <img src="src/assets/hero.png" alt="AI-ACDS Banner" width="750" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.6);" />
</p>

<p align="center">
  <strong>Next-Generation Autonomous Threat Detection, Containment &amp; Clinical Asset Defense for Healthcare Infrastructure</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Firebase-12.19-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase 12" />
  <img src="https://img.shields.io/badge/Lucide-Icons-4fd1c5?style=for-the-badge&logoColor=white" alt="Lucide Icons" />
  <img src="https://img.shields.io/badge/Spline-3D%20Engine-FF5C00?style=for-the-badge&logo=spline&logoColor=white" alt="Spline 3D" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

---

##  Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Hospital Roles & Access Control](#-hospital-roles--access-control)
- [Identity Verification & Admin Approval Workflow](#-identity-verification--admin-approval-workflow)
- [Project Architecture & File Structure](#-project-architecture--file-structure)
- [Routing & Security Matrix](#-routing--security-matrix)
- [Getting Started](#-getting-started)
- [Bootstrap First Admin User](#-bootstrap-first-admin-user)
- [Backend & AI Integration Guide](#-backend--ai-integration-guide)
- [Available Scripts](#-available-scripts)
- [License](#-license)

---

##  Overview

Modern healthcare networks are prime targets for ransomware, data exfiltration, and IoT weaponization. When critical Internet of Medical Things (IoMT) devices—such as ventilators, infusion pumps, or MRI telemetry gateways—are targeted, traditional human-in-the-loop response times can jeopardize patient safety.

**AI-ACDS (AI-Powered Autonomous Cyber Defense System for Hospitals)** delivers:
* **Zero-Downtime Autonomous Mitigation**: AI models analyze telemetry and neutralize active attack vectors within milliseconds.
* **Clinical Safety First**: Automated VLAN isolation and quarantine that protects clinical workflows without shutting down life-support systems.
* **Strict Role-Based Access Control (RBAC)**: Multi-tier clearance levels engineered for hospital clinical, network, and security staff.
* **Audited Verification Workflow**: New user registrations require authorized administrative approval with real-time status notifications.

---

##  Key Features

* **3D Cyber Experience**: Interactive 3D Spline cyber-terminal rendering on landing pages.
* **Glassmorphism Cyber Theme**: Custom dark-mode UI with neon teal (`#4fd1c5`) accents, radial glowing backdrops, and cyber grids.
* **Real-Time Reactive State**: Powered by Firebase Cloud Firestore `onSnapshot` listeners—account approvals, rejections, and alerts reflect instantly without page reloads.
* **Explainable AI (XAI) Telemetry Pipeline**: Visualizes five operational defense phases:
  1. *Threat Detection*
  2. *Explainable AI Analysis*
  3. *Threat Containment*
  4. *Security Verification*
  5. *Incident Reporting & HIPAA Compliance*
* **IoMT Asset Health Monitoring**: Tracks live status of hospital hardware (`normal`, `at_risk`, `isolated`).

---

##  Hospital Roles & Access Control

AI-ACDS implements three operational role profiles tailored to hospital staff responsibilities:

| Operational Role | Clearance Level | Operational Scope & Responsibilities |
| :--- | :---: | :--- |
| **SOC Analyst** | `Level 3` (Full Security) | Real-time threat triage, autonomous pipeline monitoring, XAI root-cause forensics, and threat containment logs. |
| **Network Administrator** | `Level 2` (Infrastructure Ops) | Clinical VLAN topography, device routing integrity, automated switch isolation, and bandwidth anomaly telemetry. |
| **Clinical IT Lead** | `Level 1` (Clinical Systems) | IoMT medical equipment compliance (Ventilators, Infusion Pumps, PACS/EHR), zero-downtime safety governance. |

---

##  Identity Verification & Admin Approval Workflow

To prevent unauthorized access to hospital defense telemetry, account creation follows a gated approval process:

```
[ User Registers ] 
         │
         ▼
[ Firestore Created: accountType: "user", approvalStatus: "pending" ]
         │
         ▼
[ Redirected to /pending-approval (Real-time listener active) ]
         │
         ├───────────────────────────────────────────────┐
         ▼                                               ▼
[ Admin Reviews in /admin ]                   [ Admin Denies in /admin ]
         │                                               │
         ▼                                               ▼
[ approvalStatus: "approved" ]                 [ approvalStatus: "rejected" ]
         │                                               │
         ▼                                               ▼
[ Real-time auto-redirect to /dashboard ]      [ Auto-redirect to /account-rejected ]
```

1. **User Registration**: User enters clinical credentials (Full Name, Username, Work Email, Phone, Department, and Role).
2. **Pending Clearance**: The account is created with `approvalStatus: "pending"` and the user is held at `/pending-approval`.
3. **Administrator Review**: Administrators logged into `/admin` inspect identity details and choose:
   * **Approve**: Immediately grants system access. The user's screen automatically updates and navigates to `/dashboard`.
   * **Reject**: Prompts for an audited justification and routes the user to `/account-rejected`.

---

##  Project Architecture & File Structure

```
ai-acds-frontend/
├── public/
│   ├── favicon.svg                # Application Favicon
│   └── icons.svg                  # SVG Icons sprite
├── src/
│   ├── assets/
│   │   ├── hero.png               # Cyber defense hero artwork
│   │   └── react.svg
│   ├── components/
│   │   ├── AdminRoute.jsx         # Guard: requires accountType === "admin"
│   │   └── ProtectedRoute.jsx     # Guard: requires approvalStatus === "approved"
│   ├── context/
│   │   └── AuthContext.jsx        # Firebase auth state & real-time profile listeners
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx # Admin management portal (/admin)
│   │   ├── auth/
│   │   │   ├── AccountRejected.jsx# Rejection notice & reason page
│   │   │   ├── Auth.css           # Authentication & cyber-theme styles
│   │   │   ├── Auth.jsx           # Unified auth view container
│   │   │   ├── Login.jsx          # Role selector & credential authentication
│   │   │   ├── PendingApproval.jsx# Real-time waiting room
│   │   │   └── Register.jsx       # Multi-field hospital registration
│   │   ├── Dashboard.css          # Cyber operations center styles
│   │   └── Dashboard.jsx          # Unified telemetry & threat defense dashboard
│   ├── App.css
│   ├── App.jsx                    # Route mapping & layout wrapper
│   ├── firebase.js                # Firebase App, Auth & Firestore initialization
│   ├── index.css                  # Global CSS resets & typography
│   └── main.jsx                   # Application entry point
├── eslint.config.js               # ESLint configuration
├── index.html                     # HTML root template
├── package.json                   # Project metadata and dependencies
└── vite.config.js                 # Vite build & allowedHosts configuration
```

---

##  Routing & Security Matrix

| Route | Guard | Description | Access Requirement |
| :--- | :--- | :--- | :--- |
| `/` | *None* | Interactive 3D cyber landing page | Public |
| `/login` | *None* | Multi-role authentication portal | Public |
| `/register` | *None* | Hospital staff registration form | Public |
| `/pending-approval` | [`useAuth`](file:///C:/Users/Lenovo/ai-acds-frontend/src/context/AuthContext.jsx) | Real-time waiting room | Authenticated (`approvalStatus == "pending"`) |
| `/account-rejected` | [`useAuth`](file:///C:/Users/Lenovo/ai-acds-frontend/src/context/AuthContext.jsx) | Displays rejection reasons & appeal info | Authenticated (`approvalStatus == "rejected"`) |
| `/dashboard` | [`ProtectedRoute`](file:///C:/Users/Lenovo/ai-acds-frontend/src/components/ProtectedRoute.jsx) | Main operations dashboard | Authenticated (`approvalStatus == "approved"`) |
| `/dashboard/:roleId` | [`ProtectedRoute`](file:///C:/Users/Lenovo/ai-acds-frontend/src/components/ProtectedRoute.jsx) | Role-filtered telemetry dashboard | Authenticated (`approvalStatus == "approved"`) |
| `/admin` | [`AdminRoute`](file:///C:/Users/Lenovo/ai-acds-frontend/src/components/AdminRoute.jsx) | Access verification and approvals console | Authenticated (`accountType == "admin"`) |

---

##  Getting Started

### 1. Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)
* A **Firebase Project** with Authentication and Cloud Firestore enabled.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-org/ai-acds-frontend.git

# Navigate into project directory
cd ai-acds-frontend

# Install dependencies
npm install
```

### 3. Firebase Configuration
Open [`src/firebase.js`](file:///C:/Users/Lenovo/ai-acds-frontend/src/firebase.js) and configure your Firebase credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

##  Bootstrap First Admin User

When setting up a fresh database, all newly registered users start with `pending` status. To create your first **System Administrator**:

1. Open your browser and register a new account through the `/register` page.
2. The app will navigate you to `/pending-approval`.
3. Open the **[Firebase Console](https://console.firebase.google.com/)**:
   * Navigate to **Firestore Database** $\rightarrow$ **`users`** collection.
   * Click on the document matching your user's UID.
4. Edit (or add) the following fields:
   * **`accountType`**: set value to `"admin"` (string)
   * **`approvalStatus`**: set value to `"approved"` (string)
5. Save the document.
6. The app's real-time listener will instantly detect the update and grant you full access to `/admin` without requiring a page refresh!

---

##  Backend & AI Integration Guide

The frontend is ready to bind to live AI detection microservices and SIEM/SOAR streaming backends. Replace placeholder structures in [`src/pages/Dashboard.jsx`](file:///C:/Users/Lenovo/ai-acds-frontend/src/pages/Dashboard.jsx):

### 1. Clinical Asset Status Telemetry
* **Target Endpoint**: `GET /api/v1/assets/status`
* **Schema**:
```json
[
  {
    "id": "asset-ventilator-01",
    "name": "ICU Ventilator-1",
    "status": "normal" // "normal" | "at_risk" | "isolated"
  }
]
```

### 2. Real-Time Alert Stream
* **Target Endpoint**: `GET /api/v1/alerts/live` or WebSocket `ws://.../api/v1/alerts/stream`
* **Schema**:
```json
[
  {
    "id": "alt-8921",
    "severity": "critical", // "critical" | "high" | "medium"
    "asset": "PACS Gateway Server",
    "description": "Unauthorized lateral movement detected matching LockBit 3.0 signature.",
    "timestamp": "2026-09-26T18:40:00Z"
  }
]
```

### 3. Autonomous Response Timeline
* **Target Endpoint**: `GET /api/v1/incidents/current/timeline` or Server-Sent Events (SSE)
* **Schema**:
```json
[
  {
    "id": "stage-1",
    "name": "Threat Detection",
    "modelOutput": "Anomalous SMB payload flagged by Transformer-based IDS model."
  },
  {
    "id": "stage-2",
    "name": "Explainable AI Analysis",
    "modelOutput": "99.2% confidence ransomware encryption beaconing targeting /data/pacs."
  },
  {
    "id": "stage-3",
    "name": "Threat Containment",
    "modelOutput": "Autonomous VLAN isolation triggered for subnet 192.168.12.0/24."
  }
]
```

---

##  Available Scripts

In the project root, you can run:

* `npm run dev` — Launches the Vite development server with Hot Module Replacement (HMR).
* `npm run build` — Compiles production-ready assets into the `dist/` folder.
* `npm run preview` — Locally previews the built production bundle.
* `npm run lint` — Runs ESLint to inspect code quality and conventions.

---

##  License

Distributed under the **MIT License**. See `LICENSE` for more information.
