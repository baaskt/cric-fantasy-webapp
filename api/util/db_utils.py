'''DB Utils'''

from firebase_admin import credentials, firestore, initialize_app
from configs import settings


class DBUtils:
    """
    DB Utility class
    """

    def __init__(self) -> None:
        # ! need to implement singleton for avoiding multiple db connections
        self.cred = credentials.Certificate(settings.CREDENTIAL)
        self.default_app = initialize_app(self.cred)
        self.db = firestore.client()

    def get_collection(self, collection_name):
        """
        Returns the collection from the db

        Args:
            collection_name (str): collection name
        """
        return self.db.collection(collection_name)
