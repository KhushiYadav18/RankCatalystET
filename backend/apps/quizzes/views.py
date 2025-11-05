"""
Views for Quiz app
"""
import os
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Chapter, QuizSession, Question, QuestionAttempt
from .serializers import (
    ChapterSerializer, QuizQuestionSerializer, QuizSessionSerializer,
    StartSessionSerializer, AnswerSubmissionSerializer
)
from .services.question_selector import get_first_question_for_session, select_next_question
from .services.summary_builder import build_session_summary
from .services.llm_client import generate_quiz_summary


class ChapterViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/quizzes/chapters/
    List all active chapters
    """
    queryset = Chapter.objects.filter(is_active=True)
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None  # Disable pagination for chapters


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_session_view(request):
    """
    POST /api/quizzes/sessions/start/
    Start a new quiz session
    """
    serializer = StartSessionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    chapter_slug = serializer.validated_data['chapter_slug']
    chapter = get_object_or_404(Chapter, slug=chapter_slug, is_active=True)
    
    # Create quiz session
    session = QuizSession.objects.create(
        user=request.user,
        chapter=chapter,
        max_questions=serializer.validated_data.get('max_questions', 15),
        webgazer_enabled=serializer.validated_data.get('webgazer_enabled', True),
        calibration_quality=serializer.validated_data.get('calibration_quality'),
        device_info=serializer.validated_data.get('device_info', ''),
    )
    
    # Get first question
    question = get_first_question_for_session(session)
    
    if not question:
        return Response(
            {'error': 'No questions available for this chapter'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Increment question index
    session.current_question_index = 1
    session.save()
    
    return Response({
        'quiz_session_id': str(session.id),
        'chapter': ChapterSerializer(chapter).data,
        'max_questions': session.max_questions,
        'current_question_index': session.current_question_index,
        'question': QuizQuestionSerializer(question).data,
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answer_view(request, quiz_session_id):
    """
    POST /api/quizzes/sessions/{quiz_session_id}/answer/
    Submit an answer and get the next question
    """
    # Get session and verify ownership
    session = get_object_or_404(QuizSession, id=quiz_session_id)
    if session.user != request.user:
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if session.ended_at:
        return Response(
            {'error': 'Session has already ended'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    serializer = AnswerSubmissionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    data = serializer.validated_data
    
    # Get question
    question = get_object_or_404(Question, id=data['question_id'])
    if question.chapter != session.chapter:
        return Response(
            {'error': 'Question does not belong to this session chapter'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if this question was already attempted in this session
    existing_attempt = QuestionAttempt.objects.filter(
        quiz_session=session,
        question_index=data['question_index']
    ).first()
    
    if existing_attempt:
        return Response(
            {'error': 'This question has already been attempted'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Compute correctness
    selected_index = data.get('selected_option_index')
    is_correct = False
    if selected_index is not None and not data.get('was_skipped', False):
        is_correct = (selected_index == question.correct_option_index)
    
    # Get attention metrics
    attention_metrics = data.get('attention_metrics', {})
    
    # Flag low attention
    attention_ratio = attention_metrics.get('attention_ratio', 0.0)
    flagged_low_attention = attention_ratio < 0.4
    
    # Create attempt
    ability_before = session.current_ability
    
    attempt = QuestionAttempt.objects.create(
        quiz_session=session,
        question=question,
        question_index=data['question_index'],
        difficulty_at_attempt=question.difficulty,
        ability_before=ability_before,
        ability_after=ability_before,  # Will be updated by select_next_question
        started_at=data['started_at'],
        submitted_at=data['submitted_at'],
        response_time_ms=data['response_time_ms'],
        selected_option_index=selected_index,
        is_correct=is_correct,
        was_skipped=data.get('was_skipped', False),
        attention_ratio=attention_metrics.get('attention_ratio'),
        off_screen_ratio=attention_metrics.get('off_screen_ratio'),
        off_screen_duration_ms=attention_metrics.get('off_screen_duration_ms'),
        num_gaze_samples=attention_metrics.get('num_gaze_samples', 0),
        num_on_task_samples=attention_metrics.get('num_on_task_samples', 0),
        num_off_task_samples=attention_metrics.get('num_off_task_samples', 0),
        option_changes=attention_metrics.get('option_changes', 0),
        flagged_low_attention=flagged_low_attention,
        raw_attention_trace=attention_metrics.get('raw_attention_trace'),
    )
    
    # Update session stats
    session.total_questions += 1
    if is_correct:
        session.num_correct += 1
    session.current_question_index = data['question_index'] + 1
    session.save()
    
    # Select next question using ITS logic
    next_question = select_next_question(session, attempt)
    
    # Check if quiz should end
    if session.total_questions >= session.max_questions or next_question is None:
        session.ended_at = timezone.now()
        session.save()
        
        return Response({
            'has_more': False,
            'is_correct': is_correct,
        })
    
    return Response({
        'has_more': True,
        'next_question_index': session.current_question_index,
        'question': QuizQuestionSerializer(next_question).data,
        'is_correct': is_correct,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_summary_view(request, quiz_session_id):
    """
    GET /api/quizzes/sessions/{quiz_session_id}/summary/
    Get quiz session summary with LLM feedback
    """
    # Get session and verify ownership
    session = get_object_or_404(QuizSession, id=quiz_session_id)
    if session.user != request.user:
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Build summary if not already generated
    if not session.summary_text:
        summary_data = build_session_summary(session)
        llm_summary = generate_quiz_summary(session, summary_data)
    else:
        # Rebuild summary data but use existing LLM summary
        summary_data = build_session_summary(session)
        llm_summary = session.summary_text
    
    # Prepare response
    response_data = {
        'session': QuizSessionSerializer(session).data,
        'per_question_stats': summary_data['per_question_stats'],
        'difficulty_breakdown': summary_data['difficulty_breakdown'],
        'llm_summary': llm_summary,
    }
    
    return Response(response_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_sessions_view(request):
    """
    GET /api/quizzes/sessions/
    List all quiz sessions for the current user
    """
    sessions = QuizSession.objects.filter(user=request.user).order_by('-started_at')
    serializer = QuizSessionSerializer(sessions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_session_view(request, quiz_session_id):
    """
    GET /api/quizzes/sessions/{quiz_session_id}/
    Get metadata for a single session
    """
    session = get_object_or_404(QuizSession, id=quiz_session_id)
    if session.user != request.user:
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = QuizSessionSerializer(session)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([])  # No authentication required for setup
def setup_view(request):
    """
    POST /api/quizzes/setup/
    Run initial setup: migrations, create superuser, load questions
    This is a free alternative to using Shell on Render
    
    Security: Only works if SETUP_SECRET is set and matches
    """
    from django.conf import settings
    from django.core.management import call_command
    from apps.users.models import User
    
    # Security check - only allow if SETUP_SECRET is set and matches
    setup_secret = os.getenv('SETUP_SECRET', '')
    provided_secret = request.data.get('secret', '')
    
    if not setup_secret or provided_secret != setup_secret:
        return Response(
            {'error': 'Invalid setup secret. Set SETUP_SECRET env var and provide it in request.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    results = {}
    
    # Run migrations
    try:
        call_command('migrate', verbosity=0, interactive=False)
        results['migrations'] = 'success'
    except Exception as e:
        results['migrations'] = f'error: {str(e)}'
    
    # Create superuser if none exists
    try:
        if not User.objects.filter(is_superuser=True).exists():
            email = request.data.get('admin_email', 'admin@rankcatalyst.com')
            password = request.data.get('admin_password', 'admin123')
            User.objects.create_superuser(email=email, password=password)
            results['superuser'] = f'success: created {email}'
        else:
            results['superuser'] = 'skipped: superuser already exists'
    except Exception as e:
        results['superuser'] = f'error: {str(e)}'
    
    # Load questions
    try:
        call_command('load_questions', verbosity=0)
        results['questions'] = 'success'
    except Exception as e:
        results['questions'] = f'error: {str(e)}'
    
    return Response({
        'status': 'completed',
        'results': results
    })

