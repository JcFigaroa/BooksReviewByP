import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { token } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" />;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const isAdmin = payload.isAdmin === "True";

  return isAdmin ? children : <Navigate to="/books" />;
}
