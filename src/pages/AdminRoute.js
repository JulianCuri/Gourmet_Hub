import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = (() => {
    try {
      const u = localStorage.getItem("currentUser");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  if (!user) {
    return <Navigate to="/login" replace state={{ error: "Debes iniciar sesión como administrador" }} />;
  }
  if (user.rol !== "admin") {
    return <Navigate to="/" replace state={{ error: "No tienes permisos de administrador" }} />;
  }
  return children;
}
