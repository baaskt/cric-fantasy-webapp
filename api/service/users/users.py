'''Users service'''

from util.db_utils import DBUtils
from http import HTTPStatus


class Users:
    '''Users service class'''

    def __init__(self) -> None:
        self.collection_name = 'users'
        self.collection = DBUtils().get_collection(self.collection_name)

    def get_all_users(self):
        """Returns all the users
        """
        users = [user.to_dict() for user in self.collection.stream()]
        return {'result': users}, HTTPStatus.OK
