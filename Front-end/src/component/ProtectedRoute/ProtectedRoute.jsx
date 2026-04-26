import { Navigate } from "react-router-dom";
import { useAuth } from "../../Pages/contexts/useAuth";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user || !user.token) {
    // Redirect to login if not authenticated
    return <Navigate to="/Login" replace />;
  }

  return children;
}

export default ProtectedRoute;

