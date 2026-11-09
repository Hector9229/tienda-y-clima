const API_URL = import.meta.env.VITE_BASE_API_URL || "http://127.0.0.1:8000";

/**
 * Consulta el endpoint de Django que consume el Web Service SOAP
 * CountryInfoService mediante la librería zeep.
 */
export async function getCountrySoapApi(code) {
  const url = `${API_URL}/api/v1/soap/country/?code=${encodeURIComponent(code)}`;

  const response = await fetch(url);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.detail || "No se pudo consultar el servicio SOAP");
  }

  return result;
}
