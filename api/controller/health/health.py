'''Health Endpoint'''
from flask_restx import Namespace, Resource


NS = Namespace('health', 'Health-check endpoint')


@NS.route('')
class HealthCheck(Resource):
    '''Health-check resource'''

    def get(self):
        '''Health-check Get method'''
        return {'message': "Healthy!"}
