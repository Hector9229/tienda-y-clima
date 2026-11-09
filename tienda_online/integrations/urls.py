from django.urls import path

from .views import CountrySoapView

urlpatterns = [
    path('soap/country/', CountrySoapView.as_view(), name='soap-country'),
]
