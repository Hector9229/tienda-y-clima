import React from "react";
import { Button, Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../api/user";

export function Register() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: async (formValues) => {
      try {
        const { password_confirm, ...payload } = formValues;
        const result = await registerApi(payload);

        console.log("Usuario registrado:", result);
        toast.success("Usuario registrado. Ya puedes iniciar sesión.");
        navigate("/login");
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <div className="login-admin">
      <div className="login-admin__content">
        <h1>Crear cuenta</h1>
        <p>Regístrate para acceder al dashboard</p>

        <Form className="register-form-admin" onSubmit={formik.handleSubmit}>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Nombre</label>
              <Form.Input
                name="first_name"
                placeholder="Nombre"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.first_name && formik.errors.first_name}
              />
            </Form.Field>

            <Form.Field>
              <label>Apellido</label>
              <Form.Input
                name="last_name"
                placeholder="Apellido"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.last_name && formik.errors.last_name}
              />
            </Form.Field>
          </Form.Group>

          <label>Correo electrónico</label>
          <Form.Input
            name="email"
            placeholder="correo@ejemplo.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />

          <label>Teléfono</label>
          <Form.Input
            name="phone"
            placeholder="5551234567"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && formik.errors.phone}
          />

          <label>Contraseña</label>
          <Form.Input
            name="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
            autoComplete="new-password"
          />

          <label>Confirmar contraseña</label>
          <Form.Input
            name="password_confirm"
            type="password"
            placeholder="Repite la contraseña"
            value={formik.values.password_confirm}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.password_confirm && formik.errors.password_confirm
            }
            autoComplete="new-password"
          />

          <Button type="submit" content="Registrarme" primary fluid />
        </Form>

        <p style={{ marginTop: 20, textAlign: "center", color: "#6b7280" }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

function initialValues() {
  return {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirm: "",
  };
}

function validationSchema() {
  return Yup.object({
    first_name: Yup.string().required("El nombre es obligatorio"),
    last_name: Yup.string().required("El apellido es obligatorio"),
    email: Yup.string()
      .email("Correo electrónico no válido")
      .required("El correo electrónico es obligatorio"),
    phone: Yup.string()
      .required("El teléfono es obligatorio")
      .min(7, "El teléfono debe tener al menos 7 dígitos"),
    password: Yup.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .required("La contraseña es obligatoria"),
    password_confirm: Yup.string()
      .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
      .required("Confirma la contraseña"),
  });
}
