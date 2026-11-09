from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .soap_client import SoapServiceError, get_country_info


class CountrySoapView(APIView):
    """Consume el servicio SOAP público CountryInfoService."""

    permission_classes = [AllowAny]

    @swagger_auto_schema(
        tags=['Integraciones'],
        security=[],
        operation_summary='Consultar un país vía SOAP',
        operation_description=(
            'Consume el servicio público **CountryInfoService** (SOAP) '
            'usando la librería **zeep**. Devuelve el nombre del país, su '
            'capital, la moneda y la bandera. Ejemplo: '
            '`/api/v1/soap/country/?code=MX`.'
        ),
        manual_parameters=[
            openapi.Parameter(
                'code',
                openapi.IN_QUERY,
                description='Código ISO de dos letras del país.',
                type=openapi.TYPE_STRING,
                default='MX',
            )
        ],
        responses={
            200: openapi.Response(
                description='Datos obtenidos del servicio SOAP.',
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'iso': openapi.Schema(type=openapi.TYPE_STRING),
                        'country': openapi.Schema(type=openapi.TYPE_STRING),
                        'capital': openapi.Schema(type=openapi.TYPE_STRING),
                        'currency': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'code': openapi.Schema(type=openapi.TYPE_STRING),
                                'name': openapi.Schema(type=openapi.TYPE_STRING),
                            },
                        ),
                        'flag': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            format='uri',
                        ),
                        'source': openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            400: 'Código de país inválido.',
            502: 'El servicio SOAP no respondió correctamente.',
        },
    )
    def get(self, request):
        code = request.query_params.get('code', 'MX')

        try:
            data = get_country_info(code)
        except ValueError as exc:
            return Response(
                {'detail': str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except SoapServiceError as exc:
            return Response(
                {
                    'detail': 'No se pudo consultar el servicio SOAP.',
                    'error': str(exc),
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(data)
