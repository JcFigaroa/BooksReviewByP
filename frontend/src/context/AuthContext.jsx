import { createContext, useState } from "react";

export const AuthContext = createContext();

function readIsAdmin(token) {
  try {
    return JSON.parse(atob(token.split(".")[1])).isAdmin === "True";
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const isAuthenticated = Boolean(token);
  const isAdmin = isAuthenticated && readIsAdmin(token);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
