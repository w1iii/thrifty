// authContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from 'axios'
const API_BASE_URL = "https://thrifty-qdg3.onrender.com";

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
  const refreshTimerRef = useRef(null);
  const isRefreshing = useRef(false);

  const refreshToken = async () => {
    if (isRefreshing.current) return;
    isRefreshing.current = true;
    
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/auth/refresh`,
        { withCredentials: true }
      );
      
      if (res.data.user && res.data.accessToken) {
        setToken(res.data.accessToken);
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.accessToken);
      }
    } catch (err) {
      console.error("Refresh error:", err);
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      isRefreshing.current = false;
      setIsLoading(false);
    }
  };

  const startRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }
    refreshTimerRef.current = setInterval(() => {
      refreshToken();
    }, 14 * 60 * 1000);
  };

  useEffect(() => {
    const initialRefresh = async () => {
      await refreshToken();
      startRefreshTimer();
    };
    
    initialRefresh();

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          await refreshToken();
          
          const newToken = localStorage.getItem("token");
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token]);

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    startRefreshTimer();
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.log("Logout API error:", err);
    }
    
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }
    
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
