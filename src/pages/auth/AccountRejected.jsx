import { useNavigate } from "react-router-dom";
import { LogOut, ShieldX } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

function AccountRejected() {
    const navigate = useNavigate();
    const { userProfile, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
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
                {/* Icon */}
                <div
                    style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "20px",
                        background: "rgba(239, 68, 68, 0.08)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 28px",
                        boxShadow: "0 0 30px rgba(239, 68, 68, 0.12)",
                    }}
                >
                    <ShieldX size={32} color="#f87171" strokeWidth={1.5} />
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
                        color: "#f87171",
                        background: "rgba(239, 68, 68, 0.08)",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        padding: "5px 14px",
                        borderRadius: "9999px",
                        marginBottom: "20px",
                    }}
                >
                    Access Denied
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
                    Identity Verification Rejected
                </h1>

                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: "1.7",
                        color: "rgba(255,255,255,0.65)",
                        margin: 0,
                    }}
                >
                    Your request for access to the AI-ACDS system was not approved
                    by an administrator.
                </p>

                {/* Rejection reason */}
                {userProfile?.rejectionReason && (
                    <div
                        style={{
                            marginTop: "28px",
                            padding: "18px 20px",
                            background: "rgba(239, 68, 68, 0.05)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            borderRadius: "12px",
                            textAlign: "left",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "10px",
                                fontWeight: 700,
                                letterSpacing: "1.5px",
                                textTransform: "uppercase",
                                color: "#f87171",
                                marginBottom: "10px",
                                opacity: 0.8,
                            }}
                        >
                            Reason for Rejection
                        </div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.7)",
                                lineHeight: "1.6",
                            }}
                        >
                            {userProfile.rejectionReason}
                        </p>
                    </div>
                )}

                <button
                    type="button"
                    className="register-submit-btn"
                    style={{
                        marginTop: "28px",
                        background: "rgba(239, 68, 68, 0.15)",
                        color: "#f87171",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        boxShadow: "none",
                    }}
                    onClick={handleLogout}
                >
                    <LogOut size={15} />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default AccountRejected;