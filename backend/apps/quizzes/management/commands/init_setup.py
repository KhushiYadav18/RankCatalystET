"""
Django management command to run initial setup
Can be called via HTTP endpoint or auto-run on startup
"""
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = 'Run initial setup: migrations, create superuser (if none), load questions'

    def add_arguments(self, parser):
        parser.add_argument(
            '--skip-superuser',
            action='store_true',
            help='Skip creating superuser',
        )
        parser.add_argument(
            '--skip-questions',
            action='store_true',
            help='Skip loading questions',
        )

    def handle(self, *args, **options):
        self.stdout.write('Starting initial setup...')
        
        # Run migrations
        self.stdout.write('Running migrations...')
        try:
            call_command('migrate', verbosity=0)
            self.stdout.write(self.style.SUCCESS('✓ Migrations completed'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Migration error: {e}'))
            return
        
        # Create superuser if none exists
        if not options['skip_superuser']:
            from apps.users.models import User
            if not User.objects.filter(is_superuser=True).exists():
                self.stdout.write('No superuser found. Creating one...')
                try:
                    # Create default superuser
                    User.objects.create_superuser(
                        email='admin@rankcatalyst.com',
                        password='admin123',  # Change this after first login!
                    )
                    self.stdout.write(self.style.SUCCESS('✓ Superuser created: admin@rankcatalyst.com / admin123'))
                    self.stdout.write(self.style.WARNING('⚠️ PLEASE CHANGE THE PASSWORD AFTER FIRST LOGIN!'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'✗ Superuser creation error: {e}'))
            else:
                self.stdout.write('Superuser already exists, skipping...')
        
        # Load questions
        if not options['skip_questions']:
            self.stdout.write('Loading questions...')
            try:
                call_command('load_questions', verbosity=0)
                self.stdout.write(self.style.SUCCESS('✓ Questions loaded'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'✗ Question loading error: {e}'))
        
        self.stdout.write(self.style.SUCCESS('\n✓ Initial setup completed!'))

