'''Application Entrypoint'''

from flask import Flask
from flask_cors import CORS
from controller import API_BP


APP = Flask(__name__)
CORS(APP, resources={r'/*': {'origins': "*", "send_wildcard": "False"}})
APP.register_blueprint(API_BP, url_prefix='/api')
APP.run(host='0.0.0.0', port=5000, debug=True)
