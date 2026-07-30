import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f4f7f2",
          color: "#17351f",
          fontFamily: "inherit",
        }}
      >
        <p>Loading Lawnview Admin…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
