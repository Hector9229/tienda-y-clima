import React, { useEffect, useState } from "react";
import { Dropdown, Loader, Message } from "semantic-ui-react";
import { getWeatherApi, weatherDescription } from "../api/weather";

const CITIES = [
  { key: "cdmx", text: "Ciudad de México", value: "cdmx", lat: 19.4326, lon: -99.1332 },
  { key: "gdl", text: "Guadalajara", value: "gdl", lat: 20.6597, lon: -103.3496 },
  { key: "mty", text: "Monterrey", value: "mty", lat: 25.6866, lon: -100.3161 },
  { key: "tij", text: "Tijuana", value: "tij", lat: 32.5149, lon: -117.0382 },
  { key: "mid", text: "Mérida", value: "mid", lat: 20.9674, lon: -89.5926 },
];

export function WeatherWidget() {
  const [city, setCity] = useState(CITIES[0]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getWeatherApi(city.lat, city.lon);
        if (!cancelled) setWeather(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [city]);

  const current = weather?.current;

  return (
    <div className="card">
      <h3 className="card__title">
        Clima actual
        <span className="ui label basic blue">API de terceros</span>
      </h3>
      <p className="card__subtitle">
        Datos en vivo de <strong>Open-Meteo</strong> consumidos con{" "}
        <code>fetch</code>.
      </p>

      <Dropdown
        fluid
        selection
        options={CITIES}
        value={city.value}
        onChange={(_, data) =>
          setCity(CITIES.find((item) => item.value === data.value))
        }
      />

      {loading && (
        <div style={{ padding: "30px 0", textAlign: "center" }}>
          <Loader active inline="centered" />
        </div>
      )}

      {error && !loading && (
        <Message negative style={{ marginTop: 18 }}>
          {error}
        </Message>
      )}

      {current && !loading && !error && (
        <div className="weather" style={{ marginTop: 18 }}>
          <div className="weather__temp">{Math.round(current.temperature_2m)}°C</div>
          <div className="weather__desc">
            {weatherDescription(current.weather_code)} · {city.text}
          </div>

          <div className="weather__details">
            <div>
              <strong>{Math.round(current.apparent_temperature)}°C</strong>
              Sensación
            </div>
            <div>
              <strong>{current.relative_humidity_2m}%</strong>
              Humedad
            </div>
            <div>
              <strong>{current.wind_speed_10m} km/h</strong>
              Viento
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
