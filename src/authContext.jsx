// authContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios'

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5050/api/auth/refresh",
          { withCredentials: true }
        );
        
        // Only update if we have valid data
        if (res.data.user && res.data.accessToken) {
          setToken(res.data.accessToken);
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.accessToken);
        }
      } catch (err) {
        console.error("Refresh error:", err);
        // Only clear if we get a 401 (unauthorized), not for other errors
        if (err.response?.status === 401) {
          setUser(null);
          setToken(null);
          localStorage.clear();
        } else {
          // For other errors, keep the stored user/token
          console.log("Keeping stored auth data due to non-401 error");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    refresh();
  }, []); // Empty dependency array - runs only once on mount

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
