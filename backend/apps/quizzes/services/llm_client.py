"""
LLM Client for generating quiz summaries using OpenRouter
"""
from django.conf import settings
from openai import OpenAI
from ..models import QuizSession


def generate_quiz_summary(session: QuizSession, summary_data: dict) -> str:
    """
    Generate a personalized feedback summary using LLM via OpenRouter.
    
    Args:
        session: The QuizSession instance
        summary_data: Dictionary containing aggregated stats
    
    Returns:
        Generated summary text
    """
    try:
        # Initialize OpenRouter client
        client = OpenAI(
            base_url=settings.OPENROUTER_BASE_URL,
            api_key=settings.OPENROUTER_API_KEY,
        )
        
        # Build prompt
        chapter_name = session.chapter.name
        total_questions = summary_data.get('total_questions', 0)
        num_correct = summary_data.get('num_correct', 0)
        overall_accuracy = summary_data.get('overall_accuracy', 0.0)
        overall_attention = summary_data.get('overall_attention_ratio', 0.0)
        avg_response_time = summary_data.get('overall_avg_response_time_ms', 0)
        
        difficulty_breakdown = summary_data.get('difficulty_breakdown', {})
        
        prompt = f"""You are an intelligent tutoring system analyzing a student's performance on a JEE Chemistry quiz.

Chapter: {chapter_name}
Total Questions: {total_questions}
Correct Answers: {num_correct}
Overall Accuracy: {overall_accuracy:.1%}
Average Attention Ratio: {overall_attention:.1%}
Average Response Time: {avg_response_time / 1000:.1f} seconds

Performance by Difficulty:
"""
        
        for diff in ['easy', 'medium', 'hard']:
            if diff in difficulty_breakdown:
                stats = difficulty_breakdown[diff]
                prompt += f"- {diff.capitalize()}: {stats['correct']}/{stats['questions']} correct ({stats['accuracy']:.1%}), "
                prompt += f"avg attention: {stats['avg_attention_ratio']:.1%}, "
                prompt += f"avg time: {stats['avg_response_time_ms'] / 1000:.1f}s\n"
        
        prompt += f"""
Per-Question Performance:
"""
        
        per_question = summary_data.get('per_question_stats', [])
        for pq in per_question[:10]:  # Limit to first 10 for prompt size
            prompt += f"Q{pq['question_index']} ({pq['difficulty']}): {'✓' if pq['is_correct'] else '✗'}, "
            prompt += f"attention: {pq.get('attention_ratio', 0):.1%}, "
            prompt += f"time: {pq.get('response_time_ms', 0) / 1000:.1f}s\n"
        
        prompt += """
Please provide a concise, personalized feedback (2-3 paragraphs) that:
1. Highlights the student's strengths
2. Identifies areas of difficulty
3. Mentions attention patterns (if relevant)
4. Suggests specific next steps for improvement
5. Is encouraging and constructive

Write in a friendly, supportive tone suitable for a JEE Chemistry student.
"""
        
        # Call OpenRouter API
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": settings.OPENROUTER_SITE_URL,
                "X-Title": settings.OPENROUTER_SITE_NAME,
            },
            model=settings.OPENROUTER_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=500,
        )
        
        summary_text = completion.choices[0].message.content
        
        # Save to session
        session.summary_text = summary_text
        from django.utils import timezone
        session.summary_generated_at = timezone.now()
        session.save()
        
        return summary_text
        
    except Exception as e:
        # Fallback summary if LLM fails
        fallback = f"""You completed {summary_data.get('total_questions', 0)} questions in {chapter_name} with an accuracy of {summary_data.get('overall_accuracy', 0):.1%}. 
        
Your average attention was {summary_data.get('overall_attention_ratio', 0):.1%}. 
        
Keep practicing to improve your performance!"""
        
        session.summary_text = fallback
        from django.utils import timezone
        session.summary_generated_at = timezone.now()
        session.save()
        
        return fallback

