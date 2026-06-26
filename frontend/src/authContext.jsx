import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import axios from 'axios'
import API_BASE_URL from './config.js';

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

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch { null }

    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    setUser(null);
    setToken(null);
    localStorage.clear();
  }, []);

  const refreshToken = useCallback(async () => {
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
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      isRefreshing.current = false;
      setIsLoading(false);
    }
  }, [logout]);

  const startRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }
    refreshTimerRef.current = setInterval(() => {
      refreshToken();
    }, 14 * 60 * 1000);
  }, [refreshToken]);

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
  }, [refreshToken, startRefreshTimer]);

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
  }, [token, refreshToken]);

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    startRefreshTimer();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
