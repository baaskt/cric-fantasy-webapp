'''Health Endpoint'''
from flask_restx import Namespace, Resource
from service.users.users import Users


NS = Namespace('users', 'Users endpoint')


@NS.route('')
class UsersResource(Resource):
    '''Users resource'''

    def get(self):
        '''Users Get method'''
        return Users().get_all_users()
