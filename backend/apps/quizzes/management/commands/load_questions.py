"""
Management command to load questions from JSON files
"""
import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from apps.quizzes.models import Chapter, Question


class Command(BaseCommand):
    help = 'Load questions from JSON files in question_bank directory'

    def handle(self, *args, **options):
        # Ensure chapters exist
        chapters_data = [
            {'slug': 'p-block', 'name': 'P-Block', 'description': 'P-Block elements and their properties'},
            {'slug': 'thermodynamics', 'name': 'Thermodynamics', 'description': 'Thermodynamic principles and laws'},
            {'slug': 'gaseous-state', 'name': 'Gaseous State', 'description': 'Behavior and properties of gases'},
            {'slug': 'mole-concept', 'name': 'Mole Concept', 'description': 'Mole concept and stoichiometry'},
        ]
        
        for chapter_data in chapters_data:
            chapter, created = Chapter.objects.get_or_create(
                slug=chapter_data['slug'],
                defaults={
                    'name': chapter_data['name'],
                    'description': chapter_data['description'],
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created chapter: {chapter.name}'))
            else:
                self.stdout.write(f'Chapter already exists: {chapter.name}')
        
        # Map slugs to filenames
        chapter_files = {
            'p-block': 'p_block.json',
            'thermodynamics': 'thermodynamics.json',
            'gaseous-state': 'gaseous_state.json',
            'mole-concept': 'mole_concept.json',
        }
        
        # Load questions from each file
        question_bank_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            'question_bank'
        )
        
        total_loaded = 0
        
        for slug, filename in chapter_files.items():
            chapter = Chapter.objects.get(slug=slug)
            filepath = os.path.join(question_bank_dir, filename)
            
            if not os.path.exists(filepath):
                self.stdout.write(self.style.WARNING(f'File not found: {filepath}'))
                continue
            
            with open(filepath, 'r', encoding='utf-8') as f:
                questions_data = json.load(f)
            
            loaded_count = 0
            updated_count = 0
            
            for q_data in questions_data:
                # Validate data
                if len(q_data.get('options', [])) != 4:
                    self.stdout.write(self.style.WARNING(
                        f'Skipping question {q_data.get("external_id")}: must have exactly 4 options'
                    ))
                    continue
                
                if q_data.get('correct_option_index') not in [0, 1, 2, 3]:
                    self.stdout.write(self.style.WARNING(
                        f'Skipping question {q_data.get("external_id")}: invalid correct_option_index'
                    ))
                    continue
                
                if q_data.get('difficulty') not in ['easy', 'medium', 'hard']:
                    self.stdout.write(self.style.WARNING(
                        f'Skipping question {q_data.get("external_id")}: invalid difficulty'
                    ))
                    continue
                
                # Create or update question
                question, created = Question.objects.update_or_create(
                    chapter=chapter,
                    external_id=q_data.get('external_id'),
                    defaults={
                        'text': q_data['text'],
                        'options': q_data['options'],
                        'correct_option_index': q_data['correct_option_index'],
                        'explanation': q_data.get('explanation', ''),
                        'difficulty': q_data['difficulty'],
                        'is_active': True,
                    }
                )
                
                if created:
                    loaded_count += 1
                else:
                    updated_count += 1
            
            total_loaded += loaded_count
            self.stdout.write(self.style.SUCCESS(
                f'{chapter.name}: Loaded {loaded_count} new, updated {updated_count} existing questions'
            ))
        
        self.stdout.write(self.style.SUCCESS(
            f'\nTotal questions loaded: {total_loaded}'
        ))

