import { createContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../../api/Api";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);
const userData = localStorage.getItem("auth_user");

export function AuthProvider({ children }) {
  const [user, setUser] = useState(userData ? JSON.parse(userData) : null);

  useEffect(() => {
    if (user?.token) {
      setAuthToken(user.token);
    } else {
      setAuthToken(null);
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const authData = {
        id: res.data.data.id,
        email: res.data.data.email,
        role: res.data.data.role,
        name: res.data.data.name,
        token: res.data.data.token,
      };
      
      // Update state and localStorage immediately
      setUser(authData);
      localStorage.setItem("auth_user", JSON.stringify(authData));
      
      // Set token immediately for API requests
      setAuthToken(authData.token);
      
      toast.success("Login successful");
      return authData;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}

export default AuthContext;