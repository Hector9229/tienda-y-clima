from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer de usuarios.

    La contraseña es *write-only*: se puede enviar para crear o actualizar,
    pero nunca se devuelve en las respuestas de la API.
    """

    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=False,
        min_length=8,
        style={'input_type': 'password'},
        help_text='Contraseña del usuario. Solo se escribe, nunca se lee.',
    )

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'phone',
            'password',
            'is_active',
            'is_staff',
            'date_joined',
        )
        read_only_fields = ('id', 'date_joined')

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        if not password:
            raise serializers.ValidationError(
                {'password': 'La contraseña es obligatoria al crear un usuario.'}
            )

        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        # Se extrae la contraseña para no guardarla en texto plano.
        password = validated_data.pop('password', None)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        # Solo se cambia la contraseña si realmente vino en la petición.
        if password:
            instance.set_password(password)

        instance.save()
        return instance


class RegisterUserSerializer(serializers.ModelSerializer):
    """Registro público de clientes.

    Solo expone los datos necesarios para crear la cuenta. La contraseña es
    write-only y se guarda con ``set_password`` (hash de Django).
    """

    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'},
        help_text='Contraseña de al menos 8 caracteres.',
    )

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'phone',
            'password',
        )
        read_only_fields = ('id',)
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone': {'required': True},
        }

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                'Ya existe un usuario con este correo electrónico.'
            )
        return value.lower()

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)
