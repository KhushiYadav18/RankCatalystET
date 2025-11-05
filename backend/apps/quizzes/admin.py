"""
Admin configuration for Quiz app
"""
from django.contrib import admin
from .models import Chapter, Question, QuizSession, QuestionAttempt


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'slug']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['chapter', 'difficulty', 'text_preview', 'is_active', 'created_at']
    list_filter = ['chapter', 'difficulty', 'is_active', 'created_at']
    search_fields = ['text', 'external_id']
    
    def text_preview(self, obj):
        return obj.text[:50] + "..." if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Text'


@admin.register(QuizSession)
class QuizSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'chapter', 'started_at', 'total_questions', 'num_correct', 'overall_accuracy']
    list_filter = ['chapter', 'started_at', 'webgazer_enabled']
    search_fields = ['user__email', 'chapter__name']
    readonly_fields = ['id', 'started_at', 'ended_at']


@admin.register(QuestionAttempt)
class QuestionAttemptAdmin(admin.ModelAdmin):
    list_display = ['quiz_session', 'question_index', 'difficulty_at_attempt', 'is_correct', 'attention_ratio']
    list_filter = ['difficulty_at_attempt', 'is_correct', 'flagged_low_attention']
    search_fields = ['quiz_session__user__email']
    readonly_fields = ['id']

