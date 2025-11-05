"""
ITS Logic - Question Selection Service
Implements adaptive difficulty selection based on attention and correctness
"""
from typing import Optional
from django.db.models import Q
from ..models import QuizSession, Question, QuestionAttempt


def get_first_question_for_session(session: QuizSession) -> Optional[Question]:
    """
    Get the first question for a new quiz session.
    Always starts with an easy question.
    """
    # Reset ability to 0 for new session
    session.current_ability = 0
    session.save()
    
    # Get a random easy question from the chapter that hasn't been attempted
    attempted_question_ids = set(
        session.attempts.values_list('question_id', flat=True)
    )
    
    question = Question.objects.filter(
        chapter=session.chapter,
        difficulty='easy',
        is_active=True
    ).exclude(id__in=attempted_question_ids).order_by('?').first()
    
    # If no easy questions available, try medium, then hard
    if not question:
        question = Question.objects.filter(
            chapter=session.chapter,
            difficulty='medium',
            is_active=True
        ).exclude(id__in=attempted_question_ids).order_by('?').first()
    
    if not question:
        question = Question.objects.filter(
            chapter=session.chapter,
            difficulty='hard',
            is_active=True
        ).exclude(id__in=attempted_question_ids).order_by('?').first()
    
    return question


def select_next_question(
    session: QuizSession,
    last_attempt: QuestionAttempt
) -> Optional[Question]:
    """
    Select the next question based on ITS logic after evaluating the last attempt.
    
    Ability adjustment rules:
    - Correct + High attention (>=0.6) + Fast response (<45s) → ability +1
    - Correct + Low attention → ability unchanged
    - Incorrect + High attention (>=0.6) → ability -1
    - Incorrect + Very low attention (<0.3) → ability unchanged (unreliable)
    
    Difficulty mapping:
    - ability <= -1 → easy
    - ability == 0 → medium
    - ability >= 1 → hard
    """
    ability_before = session.current_ability
    ability_after = ability_before
    
    attention_ratio = last_attempt.attention_ratio or 0.0
    response_time_ms = last_attempt.response_time_ms
    is_correct = last_attempt.is_correct
    
    # Log the decision factors for debugging
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"ITS Decision - Q{last_attempt.question_index}: correct={is_correct}, "
                f"attention={attention_ratio:.2f}, time={response_time_ms}ms, "
                f"ability_before={ability_before}")
    
    # ITS Rule: Adjust ability based on performance and attention
    if is_correct:
        if attention_ratio >= 0.6 and response_time_ms < 45000:  # Fast and focused
            ability_after = ability_before + 1
            logger.info(f"Increase difficulty: correct + high attention + fast")
        else:
            # Correct but low attention or slow → might be guess, keep ability same
            ability_after = ability_before
            logger.info(f"Maintain difficulty: correct but low attention or slow")
    else:
        if attention_ratio >= 0.6:
            # Incorrect but focused → genuine mistake, reduce difficulty
            ability_after = ability_before - 1
            logger.info(f"Decrease difficulty: incorrect but focused")
        elif attention_ratio < 0.3 or (last_attempt.off_screen_ratio or 0) > 0.5:
            # Very low attention or mostly off-screen → unreliable sample, don't change
            ability_after = ability_before
            logger.info(f"Maintain difficulty: unreliable sample (low attention)")
        else:
            # Moderate attention but wrong → slight reduction
            ability_after = max(ability_before - 1, -2)
            logger.info(f"Decrease difficulty: incorrect with moderate attention")
    
    # Map ability to difficulty
    if ability_after <= -1:
        target_difficulty = 'easy'
    elif ability_after == 0:
        target_difficulty = 'medium'
    else:  # ability_after >= 1
        target_difficulty = 'hard'
    
    # Update session ability
    session.current_ability = ability_after
    session.save()
    
    # Store ability transition in attempt
    last_attempt.ability_after = ability_after
    last_attempt.save()
    
    # Get attempted question IDs
    attempted_question_ids = set(
        session.attempts.values_list('question_id', flat=True)
    )
    
    # Try to get a question of target difficulty
    question = Question.objects.filter(
        chapter=session.chapter,
        difficulty=target_difficulty,
        is_active=True
    ).exclude(id__in=attempted_question_ids).order_by('?').first()
    
    # Fallback: if no questions in target difficulty, try others
    if not question:
        fallback_order = ['medium', 'easy', 'hard']
        if target_difficulty in fallback_order:
            fallback_order.remove(target_difficulty)
        
        for diff in fallback_order:
            question = Question.objects.filter(
                chapter=session.chapter,
                difficulty=diff,
                is_active=True
            ).exclude(id__in=attempted_question_ids).order_by('?').first()
            if question:
                break
    
    return question

