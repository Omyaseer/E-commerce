import { Navigate } from "react-router-dom";
import { useAuth } from "../../Pages/contexts/useAuth";

function AuthRedirect() {
  const { user } = useAuth();

  // If user is logged in, redirect to home
  if (user && user.token) {
    return <Navigate to="/home" replace />;
  }

  // If not logged in, redirect to login
  return <Navigate to="/Login" replace />;
}

export default AuthRedirect;

