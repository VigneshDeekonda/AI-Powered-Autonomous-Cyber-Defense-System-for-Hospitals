import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

function PendingApproval() {
    const navigate = useNavigate();
    const { currentUser, userProfile, logout } = useAuth();

    useEffect(() => {
        if (!userProfile) return;

        if (userProfile.accountType === "admin") {
            navigate("/admin", { replace: true });
            return;
        }

        if (userProfile.approvalStatus === "approved") {
            navigate("/dashboard", { replace: true });
            return;
        }

        if (userProfile.approvalStatus === "rejected") {
            navigate("/account-rejected", { replace: true });
        }
    }, [userProfile, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="auth-container">
            <div className="auth-grid-overlay" />

            <div
                className="auth-card"
                style={{
                    maxWidth: "560px",
                    textAlign: "center",
                    padding: "52px 44px",
                }}
            >
                {/* Animated icon */}
                <div
                    style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "20px",
                        background: "rgba(79, 209, 197, 0.08)",
                        border: "1px solid rgba(79, 209, 197, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 28px",
                        boxShadow: "0 0 30px rgba(79, 209, 197, 0.15)",
                    }}
                >
                    <Clock size={32} color="#4fd1c5" strokeWidth={1.5} />
                </div>

                {/* Badge */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "1.8px",
                        textTransform: "uppercase",
                        color: "#4fd1c5",
                        background: "rgba(79, 209, 197, 0.08)",
                        border: "1px solid rgba(79, 209, 197, 0.25)",
                        padding: "5px 14px",
                        borderRadius: "9999px",
                        marginBottom: "20px",
                    }}
                >
                    <span
                        style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#4fd1c5",
                            boxShadow: "0 0 8px #4fd1c5",
                            display: "inline-block",
                            animation: "pulseDot 2s infinite ease-in-out",
                        }}
                    />
                    Awaiting Authorization
                </div>

                <h1
                    style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#ffffff",
                        margin: "0 0 16px",
                        letterSpacing: "-0.5px",
                    }}
                >
                    Identity Verification Pending
                </h1>

                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: "1.7",
                        color: "rgba(255,255,255,0.65)",
                        margin: "0 0 8px",
                    }}
                >
                    Your AI-ACDS registration has been submitted successfully.
                </p>

                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: "1.7",
                        color: "rgba(255,255,255,0.65)",
                        margin: 0,
                    }}
                >
                    Your identity and authorization details are currently waiting
                    for verification by an AI-ACDS administrator.
                </p>

                {/* User info box */}
                {userProfile?.fullName && (
                    <div
                        style={{
                            marginTop: "28px",
                            padding: "18px 20px",
                            background: "rgba(79, 209, 197, 0.04)",
                            border: "1px solid rgba(79, 209, 197, 0.15)",
                            borderRadius: "12px",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "10px",
                                fontWeight: 700,
                                letterSpacing: "1.5px",
                                textTransform: "uppercase",
                                color: "#4fd1c5",
                                marginBottom: "10px",
                                opacity: 0.8,
                            }}
                        >
                            Registered User
                        </div>

                        <div
                            style={{
                                fontSize: "16px",
                                fontWeight: 600,
                                color: "#ffffff",
                                marginBottom: "4px",
                            }}
                        >
                            {userProfile.fullName}
                        </div>

                        <div
                            style={{
                                fontSize: "13px",
                                color: "rgba(255,255,255,0.5)",
                            }}
                        >
                            {currentUser?.email}
                        </div>
                    </div>
                )}

                <p
                    style={{
                        marginTop: "20px",
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.35)",
                        letterSpacing: "0.2px",
                    }}
                >
                    This page will update automatically once your account has been reviewed.
                </p>

                <button
                    type="button"
                    className="register-submit-btn"
                    style={{ marginTop: "24px" }}
                    onClick={handleLogout}
                >
                    <LogOut size={15} />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default PendingApproval;