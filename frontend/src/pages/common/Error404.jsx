import React from "react";
import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="error404">
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}
