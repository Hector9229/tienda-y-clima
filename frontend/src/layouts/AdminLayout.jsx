import React from "react";
import { Navigate } from "react-router-dom";
import { Loader } from "semantic-ui-react";
import { useAuth } from "../hooks/useAuth";

export function AdminLayout({ children }) {
  const { auth } = useAuth();

  // Mientras se comprueba el token guardado.
  if (auth === undefined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader active inline="centered" content="Cargando sesión..." />
      </div>
    );
  }

  // Ruta protegida: sin sesión se redirige al login.
  if (!auth) return <Navigate to="/login" replace />;

  return <div>{children}</div>;
}
