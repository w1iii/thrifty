// authContext.jsx
import { createContext, useContext, useState } from "react";
import { useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
  const refresh = async () => {
    try {
      const res = await axios.post("http://localhost:5050/api/auth/refresh", { withCredentials: true });
      setToken(res.data.accessToken);
    } catch (err) {
      setToken(null);
    }
  };
  refresh();
}, []);


  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/auth/getData",
          {
            headers: {
               Authorization: `Bearer ${accessToken}`
            },
            withCredentials: true 
          });
        setUser(res.user.first_name)
      } catch (err) {
        setToken(null);
      }
    };
}, []);

 

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", token) 
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear()
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

