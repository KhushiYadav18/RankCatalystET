"""
Serializers for Quiz app
"""
from rest_framework import serializers
from .models import Chapter, Question, QuizSession, QuestionAttempt


class ChapterSerializer(serializers.ModelSerializer):
    """Serializer for Chapter"""
    class Meta:
        model = Chapter
        fields = ['id', 'slug', 'name', 'description', 'is_active']


class QuizQuestionSerializer(serializers.ModelSerializer):
    """Serializer for Question when sending to frontend during quiz"""
    class Meta:
        model = Question
        fields = ['id', 'text', 'options', 'difficulty']


class QuestionSerializer(serializers.ModelSerializer):
    """Full serializer for Question (internal use)"""
    class Meta:
        model = Question
        fields = '__all__'


class QuestionAttemptSerializer(serializers.ModelSerializer):
    """Serializer for QuestionAttempt"""
    class Meta:
        model = QuestionAttempt
        fields = '__all__'
        read_only_fields = ['id', 'quiz_session']


class QuizSessionSerializer(serializers.ModelSerializer):
    """Serializer for QuizSession metadata"""
    chapter = ChapterSerializer(read_only=True)
    
    class Meta:
        model = QuizSession
        fields = [
            'id', 'chapter', 'started_at', 'ended_at', 'max_questions',
            'total_questions', 'num_correct', 'overall_accuracy',
            'overall_attention_ratio', 'overall_avg_response_time_ms',
            'webgazer_enabled', 'calibration_quality'
        ]
        read_only_fields = ['id', 'started_at', 'ended_at']


class StartSessionSerializer(serializers.Serializer):
    """Serializer for starting a quiz session"""
    chapter_slug = serializers.SlugField(required=True)
    max_questions = serializers.IntegerField(default=15, min_value=1, max_value=50)
    webgazer_enabled = serializers.BooleanField(default=True)
    calibration_quality = serializers.FloatField(required=False, allow_null=True, min_value=0.0, max_value=1.0)
    device_info = serializers.CharField(required=False, allow_blank=True)


class AnswerSubmissionSerializer(serializers.Serializer):
    """Serializer for submitting an answer"""
    question_id = serializers.UUIDField(required=True)
    question_index = serializers.IntegerField(required=True, min_value=1)
    started_at = serializers.DateTimeField(required=True)
    submitted_at = serializers.DateTimeField(required=True)
    response_time_ms = serializers.IntegerField(required=True, min_value=0)
    selected_option_index = serializers.IntegerField(required=False, allow_null=True, min_value=0, max_value=3)
    was_skipped = serializers.BooleanField(default=False)
    
    attention_metrics = serializers.DictField(required=False, allow_null=True)
    
    def validate_attention_metrics(self, value):
        """Validate attention metrics structure"""
        if value is None:
            return {}
        
        expected_fields = [
            'attention_ratio', 'off_screen_ratio', 'off_screen_duration_ms',
            'num_gaze_samples', 'num_on_task_samples', 'num_off_task_samples',
            'option_changes', 'raw_attention_trace'
        ]
        
        # Ensure all fields are present with defaults
        metrics = {}
        for field in expected_fields:
            metrics[field] = value.get(field, 0 if 'num' in field or 'duration' in field or 'changes' in field else 0.0)
        
        return metrics

