'''Settings module'''

from decouple import config


class Settings:
    JWT_SECRET_KEY: str = config("JWT_SECRET_KEY", cast=str)
    JWT_REFRESH_SECRET_KEY: str = config("JWT_REFRESH_SECRET_KEY", cast=str)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    PROJECT_NAME: str = "CricK Fantasy Backend"


class DBSettings(Settings):
    CREDENTIAL = {
        "type": "service_account",
        "project_id": config("PROJECT_ID", cast=str),
        "private_key_id": config("PRIVATE_KEY_ID", cast=str),
        "private_key": config("PRIVATE_KEY", cast=str).replace('\\n', '\n'),
        "client_email": config("CLIENT_EMAIL", cast=str),
        "client_id": config("CLIENT_ID", cast=str),
        "auth_uri": config("AUTH_URI", cast=str),
        "token_uri": config("TOKEN_URI", cast=str),
        "auth_provider_x509_cert_url": config("AUTH_PROVIDER", cast=str),
        "client_x509_cert_url": config("CLIENT_CERT_URL", cast=str),
        "universe_domain": config("UNIVERSE_DOMAIN", cast=str)
    }


settings = DBSettings()
