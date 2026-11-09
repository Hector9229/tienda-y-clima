"""Cliente SOAP para el servicio público CountryInfoService.

Documentación del servicio:
http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL

Se usa zeep para construir la petición SOAP y convertir la respuesta XML
en objetos de Python.
"""

from functools import lru_cache

import requests
from zeep import Client, Settings
from zeep.transports import Transport

WSDL = (
    'http://webservices.oorsprong.org/websamples.countryinfo/'
    'CountryInfoService.wso?WSDL'
)


class SoapServiceError(Exception):
    """Error al comunicarse con el servicio SOAP externo."""


@lru_cache(maxsize=1)
def _get_client():
    """Crea el cliente zeep una sola vez (el WSDL se descarga una vez)."""
    session = requests.Session()
    session.headers.update({'User-Agent': 'TiendaOnline/1.0 (+Django)'})
    transport = Transport(session=session, timeout=10, operation_timeout=10)
    return Client(
        wsdl=WSDL,
        transport=transport,
        settings=Settings(strict=False, xml_huge_tree=True),
    )


def get_country_info(code):
    """Devuelve nombre, capital, moneda y bandera de un país.

    ``code`` es el código ISO de dos letras (por ejemplo ``MX``).
    """
    code = (code or '').strip().upper()
    if len(code) != 2 or not code.isalpha():
        raise ValueError(
            'El código ISO del país debe tener dos letras, por ejemplo MX.'
        )

    try:
        client = _get_client()
        name = client.service.CountryName(sCountryISOCode=code)
        capital = client.service.CapitalCity(sCountryISOCode=code)
        currency = client.service.CountryCurrency(sCountryISOCode=code)
        flag = client.service.CountryFlag(sCountryISOCode=code)
    except Exception as exc:  # zeep/requests pueden lanzar varios tipos
        raise SoapServiceError(str(exc)) from exc

    return {
        'iso': code,
        'country': name,
        'capital': capital,
        'currency': {
            'code': getattr(currency, 'sISOCode', ''),
            'name': getattr(currency, 'sName', ''),
        },
        'flag': flag,
        'source': 'CountryInfoService (SOAP)',
    }
