import { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    query,
    where,
    doc,
    updateDoc,
} from "firebase/firestore";
import { CheckCircle, XCircle, LogOut, Users } from "lucide-react";

import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
    const { userProfile, logout } = useAuth();

    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

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
            alert("Failed to approve user.");
        } finally {
            setProcessingId(null);
        }
    };

    const rejectUser = async (userId) => {
        const reason = window.prompt(
            "Enter a reason for rejecting this registration:"
        );
        if (reason === null) return;

        try {
            setProcessingId(userId);
            await updateDoc(doc(db, "users", userId), {
                approvalStatus: "rejected",
                rejectedAt: new Date().toISOString(),
                rejectedBy: userProfile?.email || "admin",
                rejectionReason: reason.trim() || "No reason provided.",
            });
        } catch (error) {
            console.error("Could not reject user:", error);
            alert("Failed to reject user.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "radial-gradient(circle at 50% 0%, rgba(79, 209, 197, 0.06) 0%, #08090c 60%), #08090c",
                backgroundAttachment: "fixed",
                color: "#fff",
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            }}
        >
            {/* Top nav bar */}
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "18px 40px",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(8, 9, 12, 0.85)",
                    backdropFilter: "blur(20px)",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "22px",
                            fontWeight: 700,
                            color: "#ffffff",
                            letterSpacing: "-0.4px",
                        }}
                    >
                        AI-ACDS Administration
                    </h1>
                    <p
                        style={{
                            margin: "3px 0 0",
                            fontSize: "12px",
                            color: "rgba(255,255,255,0.45)",
                            letterSpacing: "0.2px",
                        }}
                    >
                        Identity Verification &amp; Access Control
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "9px 18px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "10px",
                        color: "rgba(255,255,255,0.75)",
                        fontSize: "13px",
                        fontWeight: 600,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                        e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                    }}
                >
                    <LogOut size={14} />
                    Sign Out
                </button>
            </header>

            {/* Page body */}
            <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px" }}>

                {/* Stats card */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "16px",
                        marginBottom: "36px",
                    }}
                >
                    <div
                        style={{
                            padding: "24px",
                            background: "rgba(18, 21, 28, 0.75)",
                            border: "1px solid rgba(79, 209, 197, 0.18)",
                            borderRadius: "14px",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 0 30px -8px rgba(79, 209, 197, 0.12)",
                            display: "flex",
                            alignItems: "center",
                            gap: "18px",
                        }}
                    >
                        <div
                            style={{
                                width: "46px",
                                height: "46px",
                                borderRadius: "12px",
                                background: "rgba(79, 209, 197, 0.1)",
                                border: "1px solid rgba(79, 209, 197, 0.25)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <Users size={20} color="#4fd1c5" />
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    letterSpacing: "1.2px",
                                    textTransform: "uppercase",
                                    color: "rgba(255,255,255,0.45)",
                                    marginBottom: "4px",
                                }}
                            >
                                Pending Verifications
                            </div>
                            <div
                                style={{
                                    fontSize: "32px",
                                    fontWeight: 700,
                                    color: "#4fd1c5",
                                    lineHeight: 1,
                                }}
                            >
                                {pendingUsers.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section header */}
                <div style={{ marginBottom: "20px" }}>
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#ffffff",
                            letterSpacing: "-0.3px",
                        }}
                    >
                        Pending Identity Verifications
                    </h2>
                    <p
                        style={{
                            margin: "6px 0 0",
                            fontSize: "13px",
                            color: "rgba(255,255,255,0.45)",
                        }}
                    >
                        Review and action each registration below.
                    </p>
                </div>

                {/* User list */}
                {loading ? (
                    <div
                        style={{
                            padding: "48px",
                            textAlign: "center",
                            color: "rgba(255,255,255,0.45)",
                            background: "rgba(18,21,28,0.6)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "14px",
                        }}
                    >
                        Loading registrations...
                    </div>
                ) : pendingUsers.length === 0 ? (
                    <div
                        style={{
                            padding: "48px",
                            textAlign: "center",
                            background: "rgba(18,21,28,0.6)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "14px",
                            color: "rgba(255,255,255,0.4)",
                            fontSize: "14px",
                        }}
                    >
                        ✓ No pending registrations.
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {pendingUsers.map((user) => (
                            <div
                                key={user.id}
                                style={{
                                    padding: "24px 28px",
                                    background: "rgba(18, 21, 28, 0.75)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "14px",
                                    backdropFilter: "blur(20px)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "24px",
                                    transition: "border-color 0.2s ease",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.borderColor = "rgba(79,209,197,0.25)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                                }
                            >
                                {/* User info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: 700,
                                            color: "#ffffff",
                                            marginBottom: "6px",
                                        }}
                                    >
                                        {user.fullName}
                                    </div>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                                            gap: "4px 24px",
                                            marginTop: "8px",
                                        }}
                                    >
                                        {[
                                            ["Email", user.email],
                                            ["Username", user.username],
                                            ["Department", user.department || "—"],
                                            ["Role", user.role],
                                            ["Phone", user.phone || "—"],
                                        ].map(([label, value]) => (
                                            <div key={label}>
                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        color: "rgba(255,255,255,0.4)",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.8px",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {label}:{" "}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: "13px",
                                                        color: "rgba(255,255,255,0.75)",
                                                    }}
                                                >
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                                    <button
                                        type="button"
                                        disabled={processingId === user.id}
                                        onClick={() => approveUser(user.id)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "7px",
                                            padding: "10px 18px",
                                            background: "rgba(79, 209, 197, 0.1)",
                                            border: "1px solid rgba(79, 209, 197, 0.35)",
                                            borderRadius: "10px",
                                            color: "#4fd1c5",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            fontFamily: "inherit",
                                            cursor: processingId === user.id ? "not-allowed" : "pointer",
                                            opacity: processingId === user.id ? 0.5 : 1,
                                            transition: "all 0.2s ease",
                                            whiteSpace: "nowrap",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (processingId !== user.id) {
                                                e.currentTarget.style.background = "rgba(79, 209, 197, 0.18)";
                                                e.currentTarget.style.boxShadow = "0 0 18px rgba(79,209,197,0.2)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "rgba(79, 209, 197, 0.1)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <CheckCircle size={15} />
                                        Approve
                                    </button>

                                    <button
                                        type="button"
                                        disabled={processingId === user.id}
                                        onClick={() => rejectUser(user.id)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "7px",
                                            padding: "10px 18px",
                                            background: "rgba(239, 68, 68, 0.08)",
                                            border: "1px solid rgba(239, 68, 68, 0.3)",
                                            borderRadius: "10px",
                                            color: "#f87171",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            fontFamily: "inherit",
                                            cursor: processingId === user.id ? "not-allowed" : "pointer",
                                            opacity: processingId === user.id ? 0.5 : 1,
                                            transition: "all 0.2s ease",
                                            whiteSpace: "nowrap",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (processingId !== user.id) {
                                                e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
                                                e.currentTarget.style.boxShadow = "0 0 18px rgba(239,68,68,0.15)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <XCircle size={15} />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;