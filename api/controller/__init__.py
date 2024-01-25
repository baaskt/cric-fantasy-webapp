'''Controller Entrypoint'''
from flask import Blueprint
from flask_restx import Api
from controller.health.health import NS as health_ns
from controller.users.users import NS as user_ns

API_BP = Blueprint("api", __name__)

AUTHORIZATION = {
    "Bearer": {
        "type": "apiKey",
        "in": "header",
        "name": "Authorization"
    }
}

API = Api(
    API_BP,
    version="1.0",
    title="Cric KCC Backend",
    description="CricK Fantasy Swagger documentation!",
    doc='/docs',
    authorizations=AUTHORIZATION,
)


API.add_namespace(health_ns)
API.add_namespace(user_ns)
