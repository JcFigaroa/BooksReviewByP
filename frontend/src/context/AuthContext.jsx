import { createContext, useState } from "react";

export const AuthContext = createContext();

function readPayload(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

// LoginService puts the user id in ClaimTypes.NameIdentifier, which the JWT handler writes as "nameid"
function readUserId(payload) {
  const id = payload.nameid ?? payload.sub ?? payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  return id ? Number(id) : null;
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
  const payload = isAuthenticated ? readPayload(token) : {};
  const isAdmin = payload.isAdmin === "True";
  const userId = readUserId(payload);
  const email = payload.email ?? null;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, isAdmin, userId, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
