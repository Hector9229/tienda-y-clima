/**
 * API de terceros: Open-Meteo (https://open-meteo.com/).
 * Servicio público, sin API key, que devuelve el clima actual.
 */
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeatherApi(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code",
    timezone: "auto",
  });

  const response = await fetch(`${WEATHER_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("No se pudo consultar la API del clima");
  }

  return response.json();
}

/**
 * Traduce el código WMO de Open-Meteo a una descripción legible.
 */
export function weatherDescription(code) {
  const codes = {
    0: "Cielo despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna intensa",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    71: "Nevada ligera",
    73: "Nevada moderada",
    75: "Nevada intensa",
    80: "Chubascos ligeros",
    81: "Chubascos moderados",
    82: "Chubascos fuertes",
    95: "Tormenta eléctrica",
    96: "Tormenta con granizo",
    99: "Tormenta fuerte con granizo",
  };

  return codes[code] || "Condición desconocida";
}
