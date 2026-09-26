import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          background: "#05070a",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Admins do not need normal user approval.
  if (userProfile?.accountType === "admin") {
    return children;
  }

  // No profile or no approval status = not allowed.
  if (!userProfile) {
    return <Navigate to="/pending-approval" replace />;
  }

  if (userProfile.approvalStatus === "pending") {
    return <Navigate to="/pending-approval" replace />;
  }

  if (userProfile.approvalStatus === "rejected") {
    return <Navigate to="/account-rejected" replace />;
  }

  if (userProfile.approvalStatus !== "approved") {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
}

export default ProtectedRoute;