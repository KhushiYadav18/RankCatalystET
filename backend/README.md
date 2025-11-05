# RankCatalyst Backend

Django REST API backend for RankCatalyst - an ITS-aware JEE Chemistry quizzing platform.

## Setup Instructions

### 1. Create Virtual Environment

```bash
# Windows
python -m venv .venv
.\.venv\Scripts\activate

# Linux/macOS
python -m venv .venv
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure API Keys

Edit `backend/config.py` and update:
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `SECRET_KEY`: Change in production
- Other settings as needed

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Load Questions

```bash
python manage.py load_questions
```

This will:
- Create 4 chapters (P-Block, Thermodynamics, Gaseous State, Mole Concept)
- Load questions from JSON files in `apps/quizzes/question_bank/`

### 6. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 7. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login and get JWT tokens
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/me/` - Get current user info

### Quizzes
- `GET /api/quizzes/chapters/` - List all chapters
- `POST /api/quizzes/sessions/start/` - Start a new quiz session
- `POST /api/quizzes/sessions/{id}/answer/` - Submit answer and get next question
- `GET /api/quizzes/sessions/{id}/summary/` - Get quiz summary with LLM feedback
- `GET /api/quizzes/sessions/` - List user's quiz sessions
- `GET /api/quizzes/sessions/{id}/` - Get session details

## Project Structure

```
backend/
├── config/              # Django project settings
├── apps/
│   ├── users/          # User authentication
│   └── quizzes/        # Quiz logic
│       ├── models.py
│       ├── views.py
│       ├── serializers.py
│       ├── services/   # ITS logic, LLM, summary
│       └── question_bank/  # JSON question files
├── manage.py
└── requirements.txt
```

## Features

- **JWT Authentication**: Secure token-based authentication
- **ITS Logic**: Adaptive difficulty selection based on attention and performance
- **LLM Integration**: OpenRouter API for generating personalized feedback
- **Attention Tracking**: Stores gaze metrics for adaptive learning
- **Question Bank**: Pre-loaded questions for 4 JEE Chemistry chapters

## Development Notes

- Uses SQLite for development (easily switchable to PostgreSQL)
- CORS is enabled for local frontend (change in production)
- All configuration is in `config.py` (no .env file needed)

