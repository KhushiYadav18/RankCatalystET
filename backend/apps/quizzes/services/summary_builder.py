"""
Summary Builder Service
Computes aggregated statistics for a quiz session
"""
from typing import Dict, List
from django.utils import timezone
from ..models import QuizSession, QuestionAttempt


def build_session_summary(session: QuizSession) -> Dict:
    """
    Build comprehensive summary statistics for a quiz session.
    
    Returns:
        Dictionary with aggregated stats, per-question data, and difficulty breakdown
    """
    attempts = session.attempts.all().order_by('question_index')
    
    # Per-question stats
    per_question_stats = []
    for attempt in attempts:
        per_question_stats.append({
            'question_index': attempt.question_index,
            'question_id': str(attempt.question.id),
            'difficulty': attempt.difficulty_at_attempt,
            'is_correct': attempt.is_correct,
            'response_time_ms': attempt.response_time_ms,
            'attention_ratio': attempt.attention_ratio,
            'off_screen_ratio': attempt.off_screen_ratio,
        })
    
    # Aggregate stats
    total_questions = len(attempts)
    num_correct = sum(1 for a in attempts if a.is_correct)
    overall_accuracy = num_correct / total_questions if total_questions > 0 else 0.0
    
    # Average attention ratio
    attention_ratios = [a.attention_ratio for a in attempts if a.attention_ratio is not None]
    overall_attention_ratio = sum(attention_ratios) / len(attention_ratios) if attention_ratios else 0.0
    
    # Average response time
    response_times = [a.response_time_ms for a in attempts if a.response_time_ms]
    overall_avg_response_time_ms = int(sum(response_times) / len(response_times)) if response_times else 0
    
    # Difficulty breakdown
    difficulty_stats = {}
    for diff in ['easy', 'medium', 'hard']:
        diff_attempts = [a for a in attempts if a.difficulty_at_attempt == diff]
        if diff_attempts:
            diff_correct = sum(1 for a in diff_attempts if a.is_correct)
            diff_accuracy = diff_correct / len(diff_attempts)
            
            diff_attention = [a.attention_ratio for a in diff_attempts if a.attention_ratio is not None]
            diff_avg_attention = sum(diff_attention) / len(diff_attention) if diff_attention else 0.0
            
            diff_times = [a.response_time_ms for a in diff_attempts if a.response_time_ms]
            diff_avg_time = int(sum(diff_times) / len(diff_times)) if diff_times else 0
            
            difficulty_stats[diff] = {
                'questions': len(diff_attempts),
                'correct': diff_correct,
                'accuracy': diff_accuracy,
                'avg_attention_ratio': diff_avg_attention,
                'avg_response_time_ms': diff_avg_time,
            }
        else:
            difficulty_stats[diff] = {
                'questions': 0,
                'correct': 0,
                'accuracy': 0.0,
                'avg_attention_ratio': 0.0,
                'avg_response_time_ms': 0,
            }
    
    # Update session aggregates
    session.total_questions = total_questions
    session.num_correct = num_correct
    session.overall_accuracy = overall_accuracy
    session.overall_attention_ratio = overall_attention_ratio
    session.overall_avg_response_time_ms = overall_avg_response_time_ms
    if not session.ended_at:
        session.ended_at = timezone.now()
    session.save()
    
    return {
        'total_questions': total_questions,
        'num_correct': num_correct,
        'overall_accuracy': overall_accuracy,
        'overall_attention_ratio': overall_attention_ratio,
        'overall_avg_response_time_ms': overall_avg_response_time_ms,
        'per_question_stats': per_question_stats,
        'difficulty_breakdown': difficulty_stats,
    }

