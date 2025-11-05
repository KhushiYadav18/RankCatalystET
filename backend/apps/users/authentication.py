"""
Custom authentication classes for public endpoints
"""
from rest_framework.authentication import BaseAuthentication


class NoAuthentication(BaseAuthentication):
    """
    Authentication class that doesn't require authentication
    """
    def authenticate(self, request):
        return None

