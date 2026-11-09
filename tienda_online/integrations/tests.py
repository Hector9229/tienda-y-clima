from unittest.mock import patch

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class CountrySoapViewTests(APITestCase):
    """Pruebas del endpoint que consume el servicio SOAP."""

    @patch('integrations.views.get_country_info')
    def test_devuelve_datos_del_pais(self, mock_get_country_info):
        mock_get_country_info.return_value = {
            'iso': 'MX',
            'country': 'Mexico',
            'capital': 'Mexico City',
            'currency': {'code': 'MXN', 'name': 'Peso'},
            'flag': 'http://example.com/mx.jpg',
            'source': 'CountryInfoService (SOAP)',
        }

        response = self.client.get(reverse('soap-country'), {'code': 'MX'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['capital'], 'Mexico City')
        mock_get_country_info.assert_called_once_with('MX')

    @patch('integrations.views.get_country_info')
    def test_codigo_invalido_devuelve_400(self, mock_get_country_info):
        mock_get_country_info.side_effect = ValueError('Código inválido')

        response = self.client.get(reverse('soap-country'), {'code': 'MEX'})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('integrations.views.get_country_info')
    def test_error_del_servicio_devuelve_502(self, mock_get_country_info):
        from integrations.soap_client import SoapServiceError

        mock_get_country_info.side_effect = SoapServiceError('timeout')

        response = self.client.get(reverse('soap-country'), {'code': 'MX'})

        self.assertEqual(response.status_code, status.HTTP_502_BAD_GATEWAY)
