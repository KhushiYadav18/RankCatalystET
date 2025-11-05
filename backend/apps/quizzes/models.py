"""
Models for Quiz app
"""
import uuid
from django.db import models
from django.conf import settings


class Chapter(models.Model):
    """Represents a quiz topic/chapter"""
    id = models.AutoField(primary_key=True)
    slug = models.SlugField(unique=True, max_length=100)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chapters'
        ordering = ['name']

    def __str__(self):
        return self.name


class Question(models.Model):
    """Represents a single MCQ question"""
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chapter = models.ForeignKey(Chapter, related_name='questions', on_delete=models.CASCADE)
    external_id = models.CharField(max_length=100, blank=True, null=True)
    text = models.TextField()
    options = models.JSONField()  # List of exactly 4 strings
    correct_option_index = models.IntegerField()  # 0, 1, 2, or 3
    explanation = models.TextField(blank=True)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'questions'
        indexes = [
            models.Index(fields=['chapter', 'difficulty', 'is_active']),
        ]

    def __str__(self):
        return f"{self.chapter.name} - {self.difficulty} - {self.text[:50]}"


class QuizSession(models.Model):
    """Represents one quiz session for a user on a particular chapter"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='quiz_sessions',
        on_delete=models.CASCADE
    )
    chapter = models.ForeignKey(Chapter, related_name='quiz_sessions', on_delete=models.PROTECT)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    max_questions = models.IntegerField(default=15)
    
    # ITS ability tracking
    current_ability = models.IntegerField(default=0)
    current_question_index = models.IntegerField(default=0)
    
    # Aggregate stats
    total_questions = models.IntegerField(default=0)
    num_correct = models.IntegerField(default=0)
    overall_accuracy = models.FloatField(null=True, blank=True)
    overall_attention_ratio = models.FloatField(null=True, blank=True)
    overall_avg_response_time_ms = models.IntegerField(null=True, blank=True)
    
    # WebGazer info
    webgazer_enabled = models.BooleanField(default=True)
    calibration_quality = models.FloatField(null=True, blank=True)
    device_info = models.TextField(blank=True)
    
    # LLM summary
    summary_text = models.TextField(blank=True)
    summary_generated_at = models.DateTimeField(null=True, blank=True)
    
    # Misc
    settings = models.JSONField(default=dict)

    class Meta:
        db_table = 'quiz_sessions'
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.user.email} - {self.chapter.name} - {self.started_at}"


class QuestionAttempt(models.Model):
    """Represents one attempt by the user at a specific question"""
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quiz_session = models.ForeignKey(
        QuizSession,
        related_name='attempts',
        on_delete=models.CASCADE
    )
    question = models.ForeignKey(Question, related_name='attempts', on_delete=models.PROTECT)
    question_index = models.IntegerField()
    
    # Snapshot of difficulty and ability
    difficulty_at_attempt = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    ability_before = models.IntegerField()
    ability_after = models.IntegerField()
    
    # Timing
    started_at = models.DateTimeField()
    submitted_at = models.DateTimeField()
    response_time_ms = models.IntegerField()
    
    # Response
    selected_option_index = models.IntegerField(null=True, blank=True)
    is_correct = models.BooleanField()
    was_skipped = models.BooleanField(default=False)
    
    # Attention metrics
    attention_ratio = models.FloatField(null=True, blank=True)
    off_screen_ratio = models.FloatField(null=True, blank=True)
    off_screen_duration_ms = models.IntegerField(null=True, blank=True)
    num_gaze_samples = models.IntegerField(default=0)
    num_on_task_samples = models.IntegerField(default=0)
    num_off_task_samples = models.IntegerField(default=0)
    option_changes = models.IntegerField(default=0)
    flagged_low_attention = models.BooleanField(default=False)
    
    # Optional trace
    raw_attention_trace = models.JSONField(null=True, blank=True)

    class Meta:
        db_table = 'question_attempts'
        ordering = ['question_index']
        unique_together = [['quiz_session', 'question_index']]

    def __str__(self):
        return f"Q{self.question_index} - {self.quiz_session} - {'Correct' if self.is_correct else 'Incorrect'}"

