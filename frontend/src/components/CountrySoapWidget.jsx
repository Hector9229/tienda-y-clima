import React, { useEffect, useState } from "react";
import { Dropdown, Loader, Message } from "semantic-ui-react";
import { getCountrySoapApi } from "../api/integrations";

const COUNTRIES = [
  { key: "MX", text: "México (MX)", value: "MX" },
  { key: "US", text: "Estados Unidos (US)", value: "US" },
  { key: "ES", text: "España (ES)", value: "ES" },
  { key: "FR", text: "Francia (FR)", value: "FR" },
  { key: "BR", text: "Brasil (BR)", value: "BR" },
  { key: "AR", text: "Argentina (AR)", value: "AR" },
  { key: "CA", text: "Canadá (CA)", value: "CA" },
  { key: "JP", text: "Japón (JP)", value: "JP" },
];

export function CountrySoapWidget() {
  const [code, setCode] = useState("MX");
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCountrySoapApi(code);
        if (!cancelled) setCountry(data);
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
  }, [code]);

  return (
    <div className="card">
      <h3 className="card__title">
        Web Service SOAP
        <span className="ui label basic teal">zeep</span>
      </h3>
      <p className="card__subtitle">
        Datos de <strong>CountryInfoService</strong> obtenidos por Django con{" "}
        <code>zeep</code>.
      </p>

      <Dropdown
        fluid
        selection
        options={COUNTRIES}
        value={code}
        onChange={(_, data) => setCode(data.value)}
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

      {country && !loading && !error && (
        <div className="soap" style={{ marginTop: 18 }}>
          {country.flag && (
            <img className="soap__flag" src={country.flag} alt={country.country} />
          )}

          <div className="user-card__row">
            <span>País</span>
            <strong>{country.country}</strong>
          </div>
          <div className="user-card__row">
            <span>Capital</span>
            <strong>{country.capital}</strong>
          </div>
          <div className="user-card__row">
            <span>Moneda</span>
            <strong>
              {country.currency.name} ({country.currency.code})
            </strong>
          </div>
          <div className="user-card__row">
            <span>ISO</span>
            <strong>
              <span className="soap__code">{country.iso}</span>
            </strong>
          </div>

          <p style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
            Fuente: {country.source}
          </p>
        </div>
      )}
    </div>
  );
}
