"""
URLs for Quiz app
"""
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ChapterViewSet, start_session_view, submit_answer_view, get_summary_view, list_sessions_view, get_session_view, setup_view

router = DefaultRouter()
router.register(r'chapters', ChapterViewSet, basename='chapter')

urlpatterns = [
    path('sessions/start/', start_session_view, name='start_session'),
    path('sessions/<uuid:quiz_session_id>/answer/', submit_answer_view, name='submit_answer'),
    path('sessions/<uuid:quiz_session_id>/summary/', get_summary_view, name='get_summary'),
    path('sessions/', list_sessions_view, name='list_sessions'),
    path('sessions/<uuid:quiz_session_id>/', get_session_view, name='get_session'),
    path('setup/', setup_view, name='setup'),  # Setup endpoint (free alternative to Shell)
] + router.urls

