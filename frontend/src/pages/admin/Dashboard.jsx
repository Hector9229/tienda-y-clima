import React from "react";
import { Button, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { WeatherWidget } from "../../components/WeatherWidget";
import { CountrySoapWidget } from "../../components/CountrySoapWidget";

const API_URL = import.meta.env.VITE_BASE_API_URL || "http://127.0.0.1:8000";

export function Dashboard() {
  const { logout, auth } = useAuth();
  const navigate = useNavigate();
  const user = auth?.me;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email;

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__brand">
          <img src="/tienda.svg" alt="Tienda Online" />
          <div>
            <h2>Tienda Online</h2>
            <span>Django + JWT + React</span>
          </div>
        </div>

        <div className="dashboard__user">
          <div className="dashboard__hello">
            <strong>{fullName}</strong>
            <small>{user?.email}</small>
          </div>
          <Button color="google plus" onClick={handleLogout}>
            <Icon name="sign-out" />
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="dashboard__content">
        <section className="dashboard__welcome">
          <h1>Bienvenido, {user?.first_name || user?.email}</h1>
          <p>
            Sesión activa con JWT. Esta ruta está protegida: si no hay token, el
            sistema redirige al login.
          </p>
        </section>

        <div className="dashboard__grid">
          <div className="card user-card">
            <h3 className="card__title">
              Mi perfil
              <span className="ui label basic green">Protegido</span>
            </h3>
            <p className="card__subtitle">
              Datos obtenidos de <code>GET /api/v1/auth/me/</code> con el token
              JWT.
            </p>

            <div className="user-card__row">
              <span>Nombre</span>
              <strong>{fullName}</strong>
            </div>
            <div className="user-card__row">
              <span>Correo</span>
              <strong>{user?.email}</strong>
            </div>
            <div className="user-card__row">
              <span>Teléfono</span>
              <strong>{user?.phone || "—"}</strong>
            </div>
            <div className="user-card__row">
              <span>Rol</span>
              <strong>{user?.is_staff ? "Administrador" : "Cliente"}</strong>
            </div>
            <div className="user-card__row">
              <span>Fecha de registro</span>
              <strong>
                {user?.date_joined
                  ? new Date(user.date_joined).toLocaleString("es-MX")
                  : "—"}
              </strong>
            </div>
          </div>

          <WeatherWidget />

          <CountrySoapWidget />

          <div className="card">
            <h3 className="card__title">
              Endpoints del backend
              <span className="ui label basic blue">API</span>
            </h3>
            <p className="card__subtitle">
              Documentación interactiva en{" "}
              <a href={`${API_URL}/swagger/`} target="_blank" rel="noreferrer">
                Swagger
              </a>
              .
            </p>

            <div className="user-card__row">
              <span>Login JWT</span>
              <strong>
                <span className="soap__code">POST /api/v1/auth/token/</span>
              </strong>
            </div>
            <div className="user-card__row">
              <span>Registro</span>
              <strong>
                <span className="soap__code">POST /api/v1/auth/register/</span>
              </strong>
            </div>
            <div className="user-card__row">
              <span>Mi perfil</span>
              <strong>
                <span className="soap__code">GET /api/v1/auth/me/</span>
              </strong>
            </div>
            <div className="user-card__row">
              <span>SOAP país</span>
              <strong>
                <span className="soap__code">
                  GET /api/v1/soap/country/?code=MX
                </span>
              </strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
