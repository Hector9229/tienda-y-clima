import React from "react";
import { Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="login-admin">
      <div className="login-admin__content" style={{ maxWidth: 620 }}>
        <h1>Tienda Online</h1>
        <p>
          Proyecto full stack de la Unidad 3: backend con Django + JWT y
          frontend con React.
        </p>

        <div style={{ textAlign: "center", margin: "30px 0 10px" }}>
          <Button primary size="large" as={Link} to="/login">
            <Icon name="sign-in" />
            Iniciar sesión
          </Button>
          <Button
            size="large"
            as={Link}
            to="/register"
            style={{ marginLeft: 12 }}
          >
            <Icon name="user plus" />
            Crear cuenta
          </Button>
        </div>

        <div
          style={{
            marginTop: 26,
            padding: "16px 18px",
            background: "#f3f7fb",
            borderRadius: 12,
            fontSize: 13,
            color: "#4b5563",
            lineHeight: 1.8,
          }}
        >
          <strong>Incluye:</strong>
          <br />
          Autenticación JWT · Rutas protegidas · Registro de usuarios
          <br />
          Widget con API de terceros (Open-Meteo)
          <br />
          Consumo de Web Service SOAP con zeep (CountryInfoService)
        </div>
      </div>
    </div>
  );
}
