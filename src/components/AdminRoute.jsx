import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
    const { currentUser, userProfile, loading } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#05070a",
                    color: "#fff",
                }}
            >
                Loading...
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (userProfile?.accountType !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default AdminRoute;