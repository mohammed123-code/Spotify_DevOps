import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const AuthContextProvider = ({ children }) => {
  const [user, setUser]         = useState(null);
  const [token, setToken]       = useState(localStorage.getItem("spotify_token") || "");
  const [authLoading, setAuthLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) { setAuthLoading(false); return; }
      try {
        const res = await axios.get(`${backendUrl}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch {
        // Token invalid/expired — clear it
        localStorage.removeItem("spotify_token");
        setToken("");
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("spotify_token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("spotify_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, authLoading, login, logout, backendUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContextProvider;
