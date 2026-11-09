import React from "react";
import { Button, Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../../api/user";
import { useAuth } from "../../hooks/useAuth";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: async (formValues) => {
      try {
        const response = await loginApi(formValues);
        const { access } = response;

        // Token que devuelve Django (visible en la consola del navegador).
        console.log("Access token JWT:", access);

        await login(access);
        toast.success("Sesión iniciada correctamente");
        navigate("/dashboard");
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <div className="login-admin">
      <div className="login-admin__content">
        <h1>Iniciar sesión</h1>
        <p>Tienda Online · Django + JWT + React</p>

        <Form className="login-form-admin" onSubmit={formik.handleSubmit}>
          <label>Correo electrónico</label>
          <Form.Input
            name="email"
            placeholder="admin@tiendaonline.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />

          <label>Contraseña</label>
          <Form.Input
            name="password"
            type="password"
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
            autoComplete="current-password"
          />

          <Button type="submit" content="Iniciar Sesión" primary fluid />
        </Form>

        <p style={{ marginTop: 20, textAlign: "center", color: "#6b7280" }}>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>

        <div
          style={{
            marginTop: 18,
            padding: "12px 14px",
            background: "#f3f7fb",
            borderRadius: 10,
            fontSize: 12,
            color: "#4b5563",
            lineHeight: 1.7,
          }}
        >
          <strong>Usuarios de prueba</strong>
          <br />
          admin@tiendaonline.com / Admin12345!
          <br />
          cliente@tiendaonline.com / Cliente12345!
        </div>
      </div>
    </div>
  );
}

function initialValues() {
  return {
    email: "",
    password: "",
  };
}

function validationSchema() {
  return Yup.object({
    email: Yup.string()
      .email("Correo electrónico no válido")
      .required("El correo electrónico es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria"),
  });
}
