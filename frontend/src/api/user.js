const API_URL = import.meta.env.VITE_BASE_API_URL || "http://127.0.0.1:8000";

/**
 * Inicia sesión contra el endpoint JWT de Django.
 * Devuelve { refresh, access }.
 */
export async function loginApi(formData) {
  const url = `${API_URL}/api/v1/auth/token/`;
  console.log("POST", url);

  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };

  const response = await fetch(url, params);

  if (response.status !== 200) {
    throw new Error("Usuario o contraseña incorrecta");
  }

  const result = await response.json();
  console.log("Respuesta del backend:", result);

  return result;
}

/**
 * Registra un usuario nuevo (endpoint público).
 */
export async function registerApi(formData) {
  const url = `${API_URL}/api/v1/auth/register/`;
  console.log("POST", url);

  const params = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };

  const response = await fetch(url, params);
  const result = await response.json().catch(() => ({}));

  if (response.status !== 201) {
    throw new Error(extractErrorMessage(result));
  }

  return result;
}

/**
 * Obtiene los datos del usuario autenticado usando el token JWT.
 */
export async function getMeApi(token) {
  const url = `${API_URL}/api/v1/auth/me/`;

  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(url, params);

  if (response.status === 401) {
    throw new Error("La sesión expiró o el token no es válido");
  }

  const result = await response.json();
  return result;
}

/**
 * Convierte los errores de DRF en un mensaje legible.
 */
function extractErrorMessage(result) {
  if (!result || typeof result !== "object") {
    return "No se pudo crear el usuario";
  }

  const firstKey = Object.keys(result)[0];
  if (!firstKey) return "No se pudo crear el usuario";

  const value = result[firstKey];
  const text = Array.isArray(value) ? value[0] : value;

  if (firstKey === "email") return `Correo: ${text}`;
  if (firstKey === "password") return `Contraseña: ${text}`;

  return `${firstKey}: ${text}`;
}
