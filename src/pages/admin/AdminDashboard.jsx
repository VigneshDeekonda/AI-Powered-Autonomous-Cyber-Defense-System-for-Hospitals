import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { CheckCircle, XCircle, LogOut } from "lucide-react";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import "./../auth/Auth.css";

function AdminDashboard() {
  const { userProfile, logout } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Custom clean in-app modal state for rejection
  const [rejectModalUser, setRejectModalUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const usersRef = collection(db, "users");
    const pendingQuery = query(
      usersRef,
      where("approvalStatus", "==", "pending")
    );

    const unsubscribe = onSnapshot(
      pendingQuery,
      (snapshot) => {
        const users = snapshot.docs.map((userDoc) => ({
          id: userDoc.id,
          ...userDoc.data(),
        }));
        setPendingUsers(users);
        setLoading(false);
      },
      (error) => {
        console.error("Could not load pending users:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const approveUser = async (userId) => {
    try {
      setProcessingId(userId);
      await updateDoc(doc(db, "users", userId), {
        approvalStatus: "approved",
        approvedAt: new Date().toISOString(),
        approvedBy: userProfile?.email || "admin",
        rejectionReason: "",
      });
    } catch (error) {
      console.error("Could not approve user:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenRejectModal = (user) => {
    setRejectModalUser(user);
    setRejectionReason("");
  };

  const confirmReject = async () => {
    if (!rejectModalUser) return;

    try {
      setProcessingId(rejectModalUser.id);
      await updateDoc(doc(db, "users", rejectModalUser.id), {
        approvalStatus: "rejected",
        rejectedAt: new Date().toISOString(),
        rejectedBy: userProfile?.email || "admin",
        rejectionReason:
          rejectionReason.trim() ||
          "Registration was not approved by an administrator.",
      });
      setRejectModalUser(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Could not reject user:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="auth-page" style={{ alignItems: "flex-start", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
        {/* Header without emoji/icons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
            paddingBottom: "18px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 4px 0",
                fontSize: "24px",
                fontWeight: "700",
                color: "#ffffff",
                letterSpacing: "-0.4px",
              }}
            >
              AI-ACDS Administration
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: "rgba(255, 255, 255, 0.5)" }}>
              Identity Verification &amp; Access Control
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s ease",
            }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {/* Simple Pending Count */}
        <div
          style={{
            background: "#0a0f10",
            border: "1px solid rgba(62, 207, 207, 0.15)",
            borderRadius: "12px",
            padding: "20px 24px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "1.2px",
              color: "rgba(255, 255, 255, 0.45)",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            Pending Verifications
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#3ecfcf" }}>
            {pendingUsers.length}
          </div>
        </div>

        {/* Section title */}
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", margin: "0 0 4px 0" }}>
            Pending Identity Verifications
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.45)", margin: 0 }}>
            Review and verify user registrations.
          </p>
        </div>

        {/* User list */}
        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.4)",
              fontSize: "14px",
              background: "#0a0f10",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
            }}
          >
            Loading registrations...
          </div>
        ) : pendingUsers.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.4)",
              fontSize: "14px",
              background: "#0a0f10",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
            }}
          >
            No pending registrations.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                style={{
                  background: "#0a0f10",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: "4px",
                    }}
                  >
                    {user.fullName}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#3ecfcf",
                      marginBottom: "10px",
                    }}
                  >
                    {user.email}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px",
                      fontSize: "12.5px",
                      color: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    <span>
                      <strong style={{ color: "rgba(255, 255, 255, 0.7)" }}>Username:</strong>{" "}
                      {user.username}
                    </span>
                    <span>
                      <strong style={{ color: "rgba(255, 255, 255, 0.7)" }}>Department:</strong>{" "}
                      {user.department || "—"}
                    </span>
                    <span>
                      <strong style={{ color: "rgba(255, 255, 255, 0.7)" }}>Role:</strong>{" "}
                      {user.role}
                    </span>
                    <span>
                      <strong style={{ color: "rgba(255, 255, 255, 0.7)" }}>Phone:</strong>{" "}
                      {user.phone || "—"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                  <button
                    type="button"
                    disabled={processingId === user.id}
                    onClick={() => approveUser(user.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "9px 18px",
                      background: "#3ecfcf",
                      color: "#05080a",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "700",
                      fontFamily: "inherit",
                      cursor: processingId === user.id ? "not-allowed" : "pointer",
                      opacity: processingId === user.id ? 0.6 : 1,
                      transition: "opacity 0.15s ease",
                    }}
                  >
                    <CheckCircle size={15} /> Approve
                  </button>

                  <button
                    type="button"
                    disabled={processingId === user.id}
                    onClick={() => handleOpenRejectModal(user)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "9px 18px",
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#f87171",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "700",
                      fontFamily: "inherit",
                      cursor: processingId === user.id ? "not-allowed" : "pointer",
                      opacity: processingId === user.id ? 0.6 : 1,
                      transition: "opacity 0.15s ease",
                    }}
                  >
                    <XCircle size={15} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clean In-App Custom Rejection Modal (replaces browser window.prompt) */}
      {rejectModalUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setRejectModalUser(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "480px",
              background: "#0a0f14",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "14px",
              padding: "24px 28px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
              textAlign: "left",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                margin: "0 0 6px 0",
                fontSize: "18px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              Reject Registration
            </h2>

            <p
              style={{
                margin: "0 0 16px 0",
                fontSize: "13px",
                color: "rgba(255, 255, 255, 0.55)",
                lineHeight: "1.5",
              }}
            >
              Specify a reason for rejecting{" "}
              <strong style={{ color: "#ffffff" }}>{rejectModalUser.fullName}</strong>.
              This will be displayed on their rejection screen.
            </p>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Identity could not be verified with hospital HR records."
              style={{
                width: "100%",
                background: "#06090e",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "8px",
                padding: "12px 14px",
                color: "#ffffff",
                fontSize: "13px",
                fontFamily: "inherit",
                resize: "vertical",
                outline: "none",
                marginBottom: "20px",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#ef4444")}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255, 255, 255, 0.12)")
              }
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => setRejectModalUser(null)}
                style={{
                  padding: "9px 18px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={processingId === rejectModalUser.id}
                onClick={confirmReject}
                style={{
                  padding: "9px 18px",
                  background: "#ef4444",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor:
                    processingId === rejectModalUser.id
                      ? "not-allowed"
                      : "pointer",
                  opacity: processingId === rejectModalUser.id ? 0.6 : 1,
                  fontFamily: "inherit",
                  boxShadow: "0 2px 10px rgba(239, 68, 68, 0.3)",
                }}
              >
                {processingId === rejectModalUser.id
                  ? "Rejecting..."
                  : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;