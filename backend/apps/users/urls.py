"""
URLs for User app
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import AllowAny
from .views import RegisterView, login_view, me_view

# Create a custom token refresh view that allows unauthenticated requests
class PublicTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('token/refresh/', PublicTokenRefreshView.as_view(), name='token_refresh'),
    path('me/', me_view, name='me'),
]

