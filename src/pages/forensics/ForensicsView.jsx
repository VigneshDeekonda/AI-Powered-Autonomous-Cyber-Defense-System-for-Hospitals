import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  Link2,
  ArrowLeft,
  Download,
  FileText,
  X,
  Copy,
  Check,
  Network,
  ScrollText,
  Clock,
  HardDrive,
  Cpu,
  Layers,
  FileCode,
  Lock,
} from "lucide-react";

// Comprehensive Forensic Evidence Records matching hospital cybersecurity architecture
export const FORENSIC_EVIDENCE_DATA = [
  {
    id: "EVID-2291",
    asset: "Ventilator ICU-03",
    department: "Intensive Care Unit (ICU)",
    criticality: "Life Critical",
    evidenceType: "Network Packet Capture",
    linkedIncident: "ALT-8941 · INC-1042",
    collectedTime: "10:42:03",
    fullTimestamp: "2026-09-27 10:42:03 UTC",
    analyst: "M. Santos · Tier-3 Forensic Lead",
    analystInitials: "MS",
    description:
      "Captured bidirectional packet trace during automated isolation of ICU-03. Anomalous CAN-bus to TCP bridging attempts intercepted.",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    algorithm: "SHA-256",
    fileSize: "384 MB",
    hashStatus: "Verified",
    chainOfCustody: "Intact",
    downloadFileName: "EVID-2291_Ventilator_ICU03_packet_capture.pcap",
    previewType: "pcap",
    preview1Title: "Network Packet Capture Summary",
    preview1Lines: [
      "10:42:01  10.24.118.42:502 -> 194.26.29.112:443  MODBUS/TCP  outbound",
      "10:42:03  CAN_OVER_IP  payload 1.8 MB  isolated",
      "32,450 packets · 2 flagged destinations · 384 MB",
    ],
    preview2Title: "Security Log Summary",
    preview2Lines: [
      "10:41:48  CMD INJECT  root_exec  x3  (firmware bus)",
      "10:42:02  AUTO QUARANTINE -> VLAN 99 ENFORCED",
      "842 events · 9 critical severity · 1 source",
    ],
  },
  {
    id: "EVID-2290",
    asset: "Admin-PC-12",
    department: "Executive IT / Billing",
    criticality: "Administrative Tier",
    evidenceType: "Memory Snapshot",
    linkedIncident: "ALT-8935 · INC-1039",
    collectedTime: "10:38:51",
    fullTimestamp: "2026-09-27 10:38:51 UTC",
    analyst: "S. Rahman · Tier-2 SOC",
    analystInitials: "SR",
    description:
      "Full volatile memory snapshot extracted via forensic agent following suspicious PowerShell credential dumping behavior.",
    sha256: "4a8f3b2190cde471b86d9a10245e31a89cfa7b12d45089ec1b7a2d398f6e4a11",
    algorithm: "SHA-256",
    fileSize: "16.2 GB",
    hashStatus: "Verified",
    chainOfCustody: "Intact",
    downloadFileName: "EVID-2290_AdminPC12_memory_snapshot.dmp",
    previewType: "memory",
    preview1Title: "Memory Dump Analysis",
    preview1Lines: [
      "10:38:45  LSASS PROCESS HOOK  PID 744  injected reflective DLL",
      "10:38:50  Mimikatz signature detected in unmapped virtual page 0x7FFE0000",
      "16.2 GB memory mapped · 3 anomalous injected threads identified",
    ],
    preview2Title: "Kernel Telemetry Summary",
    preview2Lines: [
      "10:38:22  POWERSHELL  -enc BABgAH...  bypass execution policy",
      "10:38:49  MEM_INJECT  svchost.exe (PID: 3412) HOOKED",
      "2,310 events · 14 high severity · 3 sources",
    ],
  },
  {
    id: "EVID-2289",
    asset: "EHR Server-01",
    department: "Hospital Data Center",
    criticality: "Mission Critical Database",
    evidenceType: "Security Logs",
    linkedIncident: "ALT-8928 · INC-1035",
    collectedTime: "10:21:07",
    fullTimestamp: "2026-09-27 10:21:07 UTC",
    analyst: "K. Chen · Senior Incident Responder",
    analystInitials: "KC",
    description:
      "Consolidated audit logs from primary Electronic Health Records database during unauthorized SQL query enumeration burst.",
    sha256: "7f9c2d1840ab53ec61d908e4521fa7b398412ce09d8164bca81932dfe6701a24",
    algorithm: "SHA-256",
    fileSize: "89 MB",
    hashStatus: "Verified",
    chainOfCustody: "Intact",
    downloadFileName: "EVID-2289_EHRServer01_security_logs.tar.gz",
    previewType: "logs",
    preview1Title: "Database Audit Stream",
    preview1Lines: [
      "10:20:55  10.24.105.8:3306 <- 10.24.12.80:51204  SQL  internal",
      "10:21:05  UNION SELECT patients.*  flagged by database WAF",
      "12,180 packets · 1 flagged origin · 89 MB audit archive",
    ],
    preview2Title: "Security Log Summary",
    preview2Lines: [
      "10:20:31  AUTH FAIL  db_admin  x12  (remote console 10.24.12.80)",
      "10:21:04  DB POLICY  PHI export threshold exceeded",
      "4,890 events · 22 high severity · 1 source",
    ],
  },
  {
    id: "EVID-2288",
    asset: "Infusion Pump-02",
    department: "Cardiology Ward",
    criticality: "Life Critical",
    evidenceType: "Running Processes",
    linkedIncident: "ALT-8920 · INC-1031",
    collectedTime: "09:58:44",
    fullTimestamp: "2026-09-27 09:58:44 UTC",
    analyst: "M. Santos · Tier-3 Forensic Lead",
    analystInitials: "MS",
    description:
      "Process table snapshot of real-time embedded RTOS controller showing anomalous thread execution within drug delivery daemon.",
    sha256: "1a5b8c3d9e0f2a4b6c8d0e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b",
    algorithm: "SHA-256",
    fileSize: "18 MB",
    hashStatus: "Verified",
    chainOfCustody: "Intact",
    downloadFileName: "EVID-2288_InfusionPump02_running_processes.json",
    previewType: "processes",
    preview1Title: "Process Execution Tree",
    preview1Lines: [
      "09:58:39  [PID 102] /sbin/pump_control (parent PID 1)",
      "09:58:42  └── [PID 342] /bin/sh -c 'curl -s http://194.26.29.112/up'",
      "18 active processes · 1 rogue subshell spawned",
    ],
    preview2Title: "Kernel Telemetry Summary",
    preview2Lines: [
      "09:58:12  WATCHDOG  timer overflow reset prevented",
      "09:58:41  PRIVILEGE  root drop failed on daemon process",
      "512 events · 6 critical severity · 1 source",
    ],
  },
  {
    id: "EVID-2287",
    asset: "MRI Scanner-01",
    department: "Radiology Department",
    criticality: "Diagnostic Core",
    evidenceType: "Filesystem Snapshot",
    linkedIncident: "ALT-8914 · INC-1028",
    collectedTime: "09:40:12",
    fullTimestamp: "2026-09-27 09:40:12 UTC",
    analyst: "S. Rahman · Tier-2 SOC",
    analystInitials: "SR",
    description:
      "Read-only ext4 filesystem snapshot of imaging workstation reconstructed following unauthorized file modification in system binaries.",
    sha256: "5d8a9f1b2c3e4d5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
    algorithm: "SHA-256",
    fileSize: "1.8 GB",
    hashStatus: "Verified",
    chainOfCustody: "Intact",
    downloadFileName: "EVID-2287_MRIScanner01_filesystem_snapshot.img",
    previewType: "filesystem",
    preview1Title: "Filesystem Integrity Manifest",
    preview1Lines: [
      "09:40:02  /usr/lib/libcrypto.so.1.1  MODIFIED  (hash mismatch)",
      "09:40:10  /etc/cron.d/telemetry_sync  CREATED  (scheduled beacon)",
      "14,500 checked inodes · 2 unauthorized binary modifications",
    ],
    preview2Title: "Security Log Summary",
    preview2Lines: [
      "09:39:48  INTEGRITY FAIL  AIDE hash mismatch libcrypto",
      "09:40:09  CHMOD 777  applied to system directory /tmp/.sys",
      "980 events · 11 high severity · 2 sources",
    ],
  },
  {
    id: "EVD-2041",
    asset: "MRI-Scanner-02",
    department: "Radiology",
    criticality: "Life Critical",
    evidenceType: "Network Packet Capture",
    linkedIncident: "ALT-7734 · INC-0912",
    collectedTime: "12:41:07",
    fullTimestamp: "2025-04-18 12:41:07",
    analyst: "S. Rahman · Tier-2 SOC",
    analystInitials: "SR",
    description:
      "Suspicious outbound DICOM traffic from MRI console to an unrecognised external host, captured during containment.",
    sha256: "9f2c4a7be81d03f6a15c8b47e29d6c0af3b7154e8d92ac16f0e7b4d3c85a91f2",
    algorithm: "SHA-256",
    fileSize: "412 MB",
    hashStatus: "Verified",
    chainOfCustody: "Intact",
    downloadFileName: "EVD-2041_MRI_Scanner_02_packet_capture.pcap",
    previewType: "pcap",
    preview1Title: "Network Packet Capture Summary",
    preview1Lines: [
      "12:41:07  10.20.4.18:4184 -> 91.203.77.6:8443  TLS  outbound",
      "12:41:09  DICOM C-STORE  payload 4.2 MB  flagged",
      "48,912 packets · 3 flagged destinations · 412 MB",
    ],
    preview2Title: "Security Log Summary",
    preview2Lines: [
      "12:39:52  AUTH FAIL  svc_dicom  x5  (local console)",
      "12:40:41  FW ALLOW -> EGRESS RULE OVERRIDE",
      "1,204 events · 17 high severity · 2 sources",
    ],
  },
  {
    id: "EVID-2285",
    asset: "PACS Server-01",
    department: "Imaging Archives",
    criticality: "Critical Infrastructure",
    evidenceType: "DICOM Stream Dump",
    linkedIncident: "ALT-7690 · INC-0905",
    collectedTime: "08:15:22",
    fullTimestamp: "2026-09-27 08:15:22 UTC",
    analyst: "K. Chen · Senior Incident Responder",
    analystInitials: "KC",
    description:
      "Raw DICOM transmission stream dumped during exfiltration attempt targeting pediatric radiology studies.",
    sha256: "3b7c9d1e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c",
    algorithm: "SHA-256",
    fileSize: "620 MB",
    hashStatus: "Verified",
    chainOfCustody: "Intact",
    downloadFileName: "EVID-2285_PACSServer01_dicom_stream.raw",
    previewType: "dicom",
    preview1Title: "DICOM Protocol Inspection",
    preview1Lines: [
      "08:15:10  A-ASSOCIATE-RQ  called_aet: PACS_MAIN  calling_aet: UNKNOWN_SRV",
      "08:15:18  C-GET-RQ  SOP_Class: 1.2.840.10008.5.1.4.1.1.2  CT Image",
      "142 DICOM image headers analyzed · 620 MB stream buffer",
    ],
    preview2Title: "Firewall Connection Trace",
    preview2Lines: [
      "08:14:59  TCP SYN  185.190.141.8:104 -> 10.24.102.15:104",
      "08:15:21  TCP RST  Connection killed by Autonomous Firewall Rule",
      "310 packets · 1 blocked session · 1 source",
    ],
  },
  {
    id: "EVID-2284",
    asset: "Cardiac Monitor-04",
    department: "Coronary Care Unit",
    criticality: "Life Critical",
    evidenceType: "Firmware Integrity Dump",
    linkedIncident: "ALT-7650 · INC-0899",
    collectedTime: "07:50:40",
    fullTimestamp: "2026-09-27 07:50:40 UTC",
    analyst: "M. Santos · Tier-3 Forensic Lead",
    analystInitials: "MS",
    description:
      "SPI flash memory dump of cardiac telemetry node verifying zero bootloader tampering after detected port scan.",
    sha256: "8e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f",
    algorithm: "SHA-256",
    fileSize: "32 MB",
    hashStatus: "Verified",
    chainOfCustody: "Intact",
    downloadFileName: "EVID-2284_CardiacMonitor04_firmware_dump.bin",
    previewType: "firmware",
    preview1Title: "Firmware ROM Verification",
    preview1Lines: [
      "07:50:31  BOOT BLOCK HASH: OK  (Match OEM Certificate 0x98AF)",
      "07:50:38  KERNEL PARTITION: UNTOUCHED  (Cryptographic signature valid)",
      "32 MB SPI Flash Dump · 0 unauthorized byte patches found",
    ],
    preview2Title: "Hardware Telemetry Summary",
    preview2Lines: [
      "07:49:15  JTAG BUS ACTIVITY: NONE DETECTED",
      "07:50:39  SECURE BOOT COUNTER: 44 (Normal sequence)",
      "64 events · 0 critical alerts · 1 verification target",
    ],
  },
  {
    id: "EVID-2283",
    asset: "Telemetry Gateway-01",
    department: "Hospital Core Network",
    criticality: "Network Spine",
    evidenceType: "Firewall Access Logs",
    linkedIncident: "ALT-7612 · INC-0892",
    collectedTime: "06:33:19",
    fullTimestamp: "2026-09-27 06:33:19 UTC",
    analyst: "K. Chen · Senior Incident Responder",
    analystInitials: "KC",
    description:
      "Perimeter border firewall access log extract during distributed SYN flood against clinical monitoring VLAN.",
    sha256: "6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d",
    algorithm: "SHA-256",
    fileSize: "145 MB",
    hashStatus: "Verified",
    chainOfCustody: "Intact",
    downloadFileName: "EVID-2283_TelemetryGateway01_firewall_logs.csv",
    previewType: "logs",
    preview1Title: "Egress/Ingress Audit Stream",
    preview1Lines: [
      "06:33:01  DROP  TCP 194.26.29.0/24 -> 10.24.118.0/24:443  SYN_FLOOD",
      "06:33:15  RATE_LIMIT_HIT  VLAN 118 rate capped at 100 Mbps",
      "290,410 packets dropped · 14 upstream ASN origins · 145 MB log",
    ],
    preview2Title: "ACL State Summary",
    preview2Lines: [
      "06:32:48  DYNAMIC RULE ADDED: BLOCK 194.26.29.0/24 (TTL: 3600s)",
      "06:33:18  BGP REMOTELY TRIGGERED BLACKHOLE (RTBH) ENGAGED",
      "12,400 events · 32 high severity · 1 gateway target",
    ],
  },
  {
    id: "EVID-2282",
    asset: "Pharmacy Dispenser-03",
    department: "Clinical Pharmacy",
    criticality: "Life Safety & Controlled Substances",
    evidenceType: "Security Logs",
    linkedIncident: "ALT-7589 · INC-0885",
    collectedTime: "05:12:44",
    fullTimestamp: "2026-09-27 05:12:44 UTC",
    analyst: "M. Santos · Tier-3 Forensic Lead",
    analystInitials: "MS",
    description:
      "Automated Pyxis dispensing station authorization failure logs following multiple invalid badge credentials.",
    sha256: "2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a",
    algorithm: "SHA-256",
    fileSize: "24 MB",
    hashStatus: "Verified",
    chainOfCustody: "Intact",
    downloadFileName: "EVID-2282_PharmacyDispenser03_audit_log.json",
    previewType: "logs",
    preview1Title: "Dispenser Badge Access Log",
    preview1Lines: [
      "05:12:20  RFID READ  BADGE_ID: 994812  STATUS: REVOKED",
      "05:12:35  PIN ATTEMPT  USER: nurse_lead_04  STATUS: FAILED_x3",
      "Cabinet locked down · Emergency tamper switch engaged",
    ],
    preview2Title: "IoMT Vault Telemetry",
    preview2Lines: [
      "05:12:40  SOLENOID LOCK: FORCED ENGAGEMENT",
      "05:12:43  ALARM SENT -> Pharmacy Safety Desk & Security Ops",
      "140 events · 4 critical severity · 1 device",
    ],
  },
];

export default function ForensicsView() {
  const navigate = useNavigate();
  const { roleId, subId } = useParams();

  // Current active role id for navigation
  const activeRoleId = roleId || "network-admin";

  // Selected evidence item state (defaults to subId in URL if provided, otherwise null for repository list)
  const [selectedEvidence, setSelectedEvidence] = useState(() => {
    if (subId) {
      return (
        FORENSIC_EVIDENCE_DATA.find(
          (item) => item.id.toLowerCase() === subId.toLowerCase()
        ) || null
      );
    }
    return null;
  });

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pagination state (5 items per page as shown in Image 1)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Notification toast state for export and copy actions
  const [toastMessage, setToastMessage] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);

  // Sync state if URL subId changes
  useEffect(() => {
    if (subId) {
      const found = FORENSIC_EVIDENCE_DATA.find(
        (item) => item.id.toLowerCase() === subId.toLowerCase()
      );
      if (found) {
        setSelectedEvidence(found);
      }
    } else {
      setSelectedEvidence(null);
    }
  }, [subId]);

  // Show temporary toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Copy SHA-256 hash to clipboard
  const handleCopyHash = (hash) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hash);
      setCopiedHash(true);
      triggerToast("SHA-256 hash copied to clipboard.");
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  // Export Forensic Audit Report as downloadable formatted file
  const handleExportReport = (item) => {
    const reportContent = `================================================================================
AI-ACDS FORENSIC AUDIT & EVIDENCE VERIFICATION REPORT
Hospital Network Cyber Defense Platform - Digital Forensics Repository
================================================================================
Report Generated : ${new Date().toISOString()}
Evidence Record  : ${item.id}
Incident / Alert : ${item.linkedIncident}
Asset Target     : ${item.asset}
Department       : ${item.department}
Criticality Tier : ${item.criticality}
Assigned Analyst : ${item.analyst}
--------------------------------------------------------------------------------
CRYPTOGRAPHIC INTEGRITY VERIFICATION
Algorithm        : ${item.algorithm}
SHA-256 Digest   : ${item.sha256}
Integrity Status : ${item.hashStatus} (Mathematical validation passed)
Chain of Custody : ${item.chainOfCustody} (Tamper-proof blockchain audit trail)
Evidence Size    : ${item.fileSize}
Collection Time  : ${item.fullTimestamp}
--------------------------------------------------------------------------------
INVESTIGATION SUMMARY & DESCRIPTION
${item.description}
--------------------------------------------------------------------------------
TELEMETRY EXTRACTION PREVIEW:
${item.preview1Title}:
${item.preview1Lines.map((l) => "  " + l).join("\n")}

${item.preview2Title}:
${item.preview2Lines.map((l) => "  " + l).join("\n")}
--------------------------------------------------------------------------------
CHAIN OF CUSTODY LOG:
- 10:42:03 UTC | Automated Containment Agent captured raw volatile telemetry
- 10:42:04 UTC | SHA-256 cryptographic seal generated and logged to immutable ledger
- 10:42:05 UTC | Hospital SOC Analyst verified custody integrity
================================================================================
End of Forensic Audit Certificate
`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FORENSIC_REPORT_${item.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast(`Exported official forensic report for ${item.id}`);
  };

  // Download forensic binary/capture artifact
  const handleDownloadEvidence = (item) => {
    const mockContent = `AI-ACDS RAW FORENSIC CAPTURE FILE\nID: ${item.id}\nASSET: ${item.asset}\nSHA-256: ${item.sha256}\nSIZE: ${item.fileSize}\nTIMESTAMP: ${item.fullTimestamp}\n[RAW BYTES STREAM PROTECTED BY IMMUTABLE CRYPTOGRAPHIC SEAL]\n`;
    const blob = new Blob([mockContent], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = item.downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast(`Downloading evidence artifact: ${item.downloadFileName}`);
  };

  // Filter and search logic
  const filteredEvidence = useMemo(() => {
    return FORENSIC_EVIDENCE_DATA.filter((item) => {
      // Type filter
      if (filterType !== "All" && item.evidenceType !== filterType) {
        return false;
      }
      // Search query across ID, asset, evidenceType, analyst, department
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = item.id.toLowerCase().includes(q);
        const matchAsset = item.asset.toLowerCase().includes(q);
        const matchType = item.evidenceType.toLowerCase().includes(q);
        const matchAnalyst = item.analyst.toLowerCase().includes(q);
        const matchDept = item.department.toLowerCase().includes(q);
        if (!matchId && !matchAsset && !matchType && !matchAnalyst && !matchDept) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, filterType]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredEvidence.length / itemsPerPage) || 1;
  const paginatedEvidence = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvidence.slice(start, start + itemsPerPage);
  }, [filteredEvidence, currentPage, itemsPerPage]);

  // Navigate into Evidence Details view
  const handleViewEvidence = (item) => {
    setSelectedEvidence(item);
    navigate(`/dashboard/${activeRoleId}/forensics/${item.id}`);
  };

  // Navigate back to Evidence Repository list
  const handleBackToRepository = () => {
    setSelectedEvidence(null);
    navigate(`/dashboard/${activeRoleId}/forensics`);
  };

  // Unique evidence types for the filter dropdown
  const evidenceTypes = [
    "All",
    "Network Packet Capture",
    "Memory Snapshot",
    "Security Logs",
    "Running Processes",
    "Filesystem Snapshot",
    "DICOM Stream Dump",
    "Firmware Integrity Dump",
    "Firewall Access Logs",
  ];

  // =========================================================================
  // VIEW 2: EVIDENCE DETAILS VIEW (Matches Reference Image 2)
  // =========================================================================
  if (selectedEvidence) {
    const item = selectedEvidence;

    return (
      <div
        style={{
          width: "100%",
          padding: "8px 0 40px 0",
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
            <CheckCircle2 size={16} color="#3ecfcf" />
            {toastMessage}
          </div>
        )}

        {/* Top Breadcrumb & Path Bar (Matches Reference Image 2) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "12px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: "2px",
              }}
            >
              Evidence Details
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.5)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{ cursor: "pointer", color: "#3ecfcf" }}
                onClick={handleBackToRepository}
              >
                Forensics
              </span>
              <span>/</span>
              <span
                style={{ cursor: "pointer", color: "#3ecfcf" }}
                onClick={handleBackToRepository}
              >
                Evidence Repository
              </span>
              <span>/</span>
              <span style={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>
                {item.id}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              type="button"
              onClick={handleBackToRepository}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "7px",
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "12.5px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#3ecfcf";
                e.currentTarget.style.color = "#3ecfcf";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
              }}
            >
              <ArrowLeft size={14} /> Back to Repository
            </button>
          </div>
        </div>

        {/* Main Evidence Details Container Card (Image 2) */}
        <div
          style={{
            background: "#070b0e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "24px 28px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
            boxSizing: "border-box",
          }}
        >
          {/* Card Title Header with Close 'X' button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "rgba(62, 207, 207, 0.1)",
                  border: "1px solid rgba(62, 207, 207, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#3ecfcf",
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#ffffff",
                  letterSpacing: "-0.2px",
                }}
              >
                Evidence Details — {item.id}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleBackToRepository}
              title="Close and return to repository"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "6px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "#3ecfcf";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Section 1: Evidence Metadata (Image 2) */}
          <div style={{ marginBottom: "22px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                fontSize: "11.5px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                color: "rgba(255, 255, 255, 0.75)",
                marginBottom: "12px",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.4)",
                  fontSize: "9px",
                  textAlign: "center",
                  lineHeight: "12px",
                  fontWeight: "bold",
                }}
              >
                i
              </span>
              Evidence Metadata
            </div>

            {/* Metadata Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
              }}
            >
              {/* Box 1: Evidence ID */}
              <div
                style={{
                  background: "#05080c",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "8px",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.45)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  Evidence ID
                </div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff" }}>
                  {item.id}
                </div>
              </div>

              {/* Box 2: Incident / Linked Alert */}
              <div
                style={{
                  background: "#05080c",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "8px",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.45)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  Incident / Linked Alert
                </div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff" }}>
                  {item.linkedIncident}
                </div>
              </div>

              {/* Box 3: Asset Name */}
              <div
                style={{
                  background: "#05080c",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "8px",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.45)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  Asset Name
                </div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff" }}>
                  {item.asset}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "rgba(255, 255, 255, 0.4)",
                    marginTop: "2px",
                  }}
                >
                  {item.department} · {item.criticality}
                </div>
              </div>

              {/* Box 4: Evidence Type */}
              <div
                style={{
                  background: "#05080c",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "8px",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.45)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  Evidence Type
                </div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff" }}>
                  {item.evidenceType}
                </div>
              </div>

              {/* Box 5: Collection Time */}
              <div
                style={{
                  background: "#05080c",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "8px",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.45)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  Collection Time
                </div>
                <div
                  style={{
                    fontSize: "13.5px",
                    fontWeight: "600",
                    color: "#ffffff",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {item.fullTimestamp}
                </div>
              </div>

              {/* Box 6: Analyst Assigned */}
              <div
                style={{
                  background: "#05080c",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "8px",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.45)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  Analyst Assigned
                </div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff" }}>
                  {item.analyst}
                </div>
              </div>

              {/* Box 7: Description (Spans 2 columns on wide screens) */}
              <div
                style={{
                  background: "#05080c",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "8px",
                  padding: "14px 16px",
                  gridColumn: "span 2",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.45)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  Description
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: "1.45",
                  }}
                >
                  {item.description}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Integrity Verification (Image 2) */}
          <div style={{ marginBottom: "22px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                fontSize: "11.5px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                color: "rgba(255, 255, 255, 0.75)",
                marginBottom: "12px",
                textTransform: "uppercase",
              }}
            >
              <ShieldCheck size={13} />
              Integrity Verification
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 220px 220px",
                gap: "12px",
              }}
            >
              {/* Left Box: SHA-256 Hash */}
              <div
                style={{
                  background: "#05080c",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "8px",
                  padding: "14px 18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.45)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    SHA-256 Hash Value
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(item.sha256)}
                    title="Copy SHA-256 Hash"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: copiedHash ? "#10b981" : "rgba(255, 255, 255, 0.4)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {copiedHash ? <Check size={12} /> : <Copy size={12} />}
                    {copiedHash ? "Copied" : "Copy"}
                  </button>
                </div>

                <div
                  style={{
                    fontSize: "12.5px",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "rgba(255, 255, 255, 0.85)",
                    wordBreak: "break-all",
                    marginBottom: "6px",
                    letterSpacing: "-0.2px",
                  }}
                >
                  {item.sha256}
                </div>

                <div
                  style={{
                    fontSize: "11.5px",
                    color: "rgba(255, 255, 255, 0.45)",
                  }}
                >
                  Algorithm: {item.algorithm} · File size: {item.fileSize}
                </div>
              </div>

              {/* Status Box 1: Hash Status (Green box from Image 2) */}
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "8px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
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
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "10.5px",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontWeight: "600",
                      marginBottom: "2px",
                    }}
                  >
                    Hash Status
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#10b981",
                    }}
                  >
                    Verified
                  </div>
                </div>
              </div>

              {/* Status Box 2: Chain of Custody (Green box from Image 2) */}
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "8px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
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
                  <Link2 size={20} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "10.5px",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontWeight: "600",
                      marginBottom: "2px",
                    }}
                  >
                    Chain of Custody
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#10b981",
                    }}
                  >
                    Intact
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Evidence Preview (Image 2) */}
          <div style={{ marginBottom: "26px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                fontSize: "11.5px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                color: "rgba(255, 255, 255, 0.75)",
                marginBottom: "12px",
                textTransform: "uppercase",
              }}
            >
              <FileCode size={13} />
              Evidence Preview
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              {/* Preview Box 1 (e.g. Network Packet Capture Summary) */}
              <div
                style={{
                  background: "#05080c",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "8px",
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <Network size={16} color="#3ecfcf" />
                  <span
                    style={{
                      fontSize: "13.5px",
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {item.preview1Title}
                  </span>
                </div>

                <div
                  style={{
                    background: "#030608",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "6px",
                    padding: "12px 14px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: "1.6",
                  }}
                >
                  {item.preview1Lines.map((line, idx) => (
                    <div
                      key={idx}
                      style={{
                        color:
                          idx === item.preview1Lines.length - 1
                            ? "rgba(255, 255, 255, 0.5)"
                            : "#e2e8f0",
                        marginTop: idx === item.preview1Lines.length - 1 ? "6px" : "0",
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Box 2 (e.g. Security Log Summary) */}
              <div
                style={{
                  background: "#05080c",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "8px",
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <ScrollText size={16} color="#3ecfcf" />
                  <span
                    style={{
                      fontSize: "13.5px",
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {item.preview2Title}
                  </span>
                </div>

                <div
                  style={{
                    background: "#030608",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "6px",
                    padding: "12px 14px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: "1.6",
                  }}
                >
                  {item.preview2Lines.map((line, idx) => (
                    <div
                      key={idx}
                      style={{
                        color:
                          idx === item.preview2Lines.length - 1
                            ? "rgba(255, 255, 255, 0.5)"
                            : "#e2e8f0",
                        marginTop: idx === item.preview2Lines.length - 1 ? "6px" : "0",
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar (Image 2) */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Left: Back Button */}
            <button
              type="button"
              onClick={handleBackToRepository}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 18px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "8px",
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#3ecfcf";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
              }}
            >
              <ArrowLeft size={15} /> Back to Repository
            </button>

            {/* Right: Export Report and Download Evidence */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={() => handleExportReport(item)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 18px",
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                }}
              >
                <FileText size={15} /> Export Report
              </button>

              <button
                type="button"
                onClick={() => handleDownloadEvidence(item)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 20px",
                  background: "#3ecfcf",
                  color: "#05080a",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(62, 207, 207, 0.25)",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#5eead4";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(62, 207, 207, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#3ecfcf";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(62, 207, 207, 0.25)";
                }}
              >
                <Download size={15} /> Download Evidence
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: EVIDENCE REPOSITORY LIST (Matches Reference Image 1)
  // =========================================================================
  return (
    <div
      style={{
        width: "100%",
        padding: "8px 0 40px 0",
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
          <CheckCircle2 size={16} color="#3ecfcf" />
          {toastMessage}
        </div>
      )}

      {/* Search and Filter Row */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        {/* Search Input */}
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "16px",
              color: "rgba(255, 255, 255, 0.4)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search evidence ID, device or analyst..."
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              background: "#080d12",
              border: "1px solid rgba(255, 255, 255, 0.09)",
              borderRadius: "8px",
              color: "#ffffff",
              fontSize: "13.5px",
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3ecfcf")}
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255, 255, 255, 0.09)")
            }
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "14px",
                background: "transparent",
                border: "none",
                color: "rgba(255, 255, 255, 0.4)",
                cursor: "pointer",
                padding: "2px",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Evidence Button */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            background: isFilterOpen ? "rgba(62, 207, 207, 0.1)" : "#080d12",
            border: isFilterOpen
              ? "1px solid #3ecfcf"
              : "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "8px",
            color: isFilterOpen ? "#3ecfcf" : "rgba(255, 255, 255, 0.8)",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
          }}
        >
          <SlidersHorizontal size={15} />
          Filter Evidence
        </button>
      </div>

      {/* Expandable Filter Tray */}
      {isFilterOpen && (
        <div
          style={{
            background: "#080d12",
            border: "1px solid rgba(255, 255, 255, 0.09)",
            borderRadius: "8px",
            padding: "16px 20px",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.5)",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Evidence Type:
            </span>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                background: "#05080c",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "6px",
                padding: "7px 12px",
                color: "#ffffff",
                fontSize: "12.5px",
                fontFamily: "inherit",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {evidenceTypes.map((t) => (
                <option key={t} value={t} style={{ background: "#080d12" }}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.45)" }}>
              Showing {filteredEvidence.length} records
            </span>
            {(filterType !== "All" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setFilterType("All");
                  setSearchQuery("");
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#3ecfcf",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Evidence Repository Card Container (Matches Image 1) */}
      <div
        style={{
          background: "#070b0e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "12px",
          padding: "20px 24px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
          boxSizing: "border-box",
        }}
      >
        {/* Title Inside Card (Image 1) */}
        <h2
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "#ffffff",
            margin: "0 0 16px 0",
            letterSpacing: "-0.2px",
          }}
        >
          Evidence Repository
        </h2>

        {/* Table Header Row (Image 1) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3.2fr 1.2fr 1fr 1fr 100px",
            padding: "8px 16px 12px 16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            fontSize: "11px",
            fontWeight: "700",
            color: "rgba(255, 255, 255, 0.4)",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            alignItems: "center",
          }}
        >
          <div>Evidence ID · Asset · Evidence Type</div>
          <div>Collected Time</div>
          <div style={{ textAlign: "center" }}>Hash Verified</div>
          <div style={{ textAlign: "center" }}>Chain of Custody</div>
          <div style={{ textAlign: "center" }}>Action</div>
        </div>

        {/* Rows List */}
        {paginatedEvidence.length === 0 ? (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.4)",
              fontSize: "13.5px",
            }}
          >
            No forensic evidence found matching your search criteria.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
            {paginatedEvidence.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "3.2fr 1.2fr 1fr 1fr 100px",
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
                {/* Column 1: Evidence ID · Asset · Evidence Type */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "13.5px",
                      fontWeight: "700",
                      color: "#ffffff",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {item.id}
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>·</span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.85)",
                    }}
                  >
                    {item.asset}
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>·</span>
                  <span
                    style={{
                      fontSize: "12.5px",
                      color: "rgba(255, 255, 255, 0.45)",
                    }}
                  >
                    {item.evidenceType}
                  </span>
                </div>

                {/* Column 2: Collected Time */}
                <div
                  style={{
                    fontSize: "12.5px",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {item.collectedTime}
                </div>

                {/* Column 3: Hash Verified (Green pill from Image 1) */}
                <div style={{ textAlign: "center" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 14px",
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.28)",
                      borderRadius: "6px",
                      color: "#10b981",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Verified
                  </span>
                </div>

                {/* Column 4: Chain of Custody (Green pill from Image 1) */}
                <div style={{ textAlign: "center" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 14px",
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.28)",
                      borderRadius: "6px",
                      color: "#10b981",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Intact
                  </span>
                </div>

                {/* Column 5: Action (View button from Image 1) */}
                <div style={{ textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => handleViewEvidence(item)}
                    style={{
                      padding: "5px 16px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "6px",
                      color: "#ffffff",
                      fontSize: "12.5px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#3ecfcf";
                      e.currentTarget.style.color = "#05080a";
                      e.currentTarget.style.borderColor = "#3ecfcf";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Row (Matches Image 1: < Prev 1 2 3 Next >) */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginTop: "20px",
              paddingTop: "14px",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              fontSize: "12.5px",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              style={{
                background: "transparent",
                border: "none",
                color: currentPage === 1 ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.6)",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                padding: "4px 8px",
                fontFamily: "inherit",
                fontSize: "12.5px",
              }}
            >
              ‹ Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    background: isActive ? "rgba(62, 207, 207, 0.15)" : "transparent",
                    border: isActive
                      ? "1px solid #3ecfcf"
                      : "1px solid transparent",
                    borderRadius: "6px",
                    color: isActive ? "#3ecfcf" : "rgba(255, 255, 255, 0.6)",
                    fontWeight: isActive ? "700" : "500",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "12.5px",
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              style={{
                background: "transparent",
                border: "none",
                color:
                  currentPage === totalPages
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(255, 255, 255, 0.6)",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                padding: "4px 8px",
                fontFamily: "inherit",
                fontSize: "12.5px",
              }}
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
