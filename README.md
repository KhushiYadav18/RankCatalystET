# RankCatalyst

An Intelligent Tutoring System (ITS) for JEE Chemistry preparation with adaptive difficulty selection and real-time attention tracking.

## Overview

RankCatalyst is a full-stack web application that provides an adaptive quizzing experience for JEE Chemistry students. The system uses eye-tracking technology (WebGazer.js) to monitor attention levels and adjusts question difficulty dynamically based on performance and focus.

## Features

- **User Authentication**: Secure JWT-based authentication
- **Adaptive Learning**: ITS algorithm adjusts difficulty based on attention and correctness
- **Attention Tracking**: Real-time gaze tracking using WebGazer.js
- **Personalized Feedback**: LLM-generated performance summaries via OpenRouter
- **Performance Analytics**: Interactive charts showing accuracy, attention, and response times
- **Multiple Chapters**: P-Block, Thermodynamics, Gaseous State, Mole Concept

## Tech Stack

### Backend
- Django 5.x
- Django REST Framework
- JWT Authentication (djangorestframework-simplejwt)
- OpenRouter API (for LLM)
- SQLite (dev) / PostgreSQL (production-ready)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (data visualization)
- WebGazer.js (eye tracking)

## Project Structure

```
RankCatalyst/
├── backend/              # Django backend
│   ├── config/          # Django settings
│   ├── apps/
│   │   ├── users/       # Authentication
│   │   └── quizzes/     # Quiz logic, models, services
│   └── manage.py
├── frontend/            # Next.js frontend
│   ├── app/             # Pages and routes
│   ├── components/      # React components
│   └── lib/             # Utilities and API client
└── README.md
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
# Windows
python -m venv .venv
.\.venv\Scripts\activate

# Linux/macOS
python -m venv .venv
source .venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure API keys:
Edit `backend/config.py` and update:
- `OPENROUTER_API_KEY`: Your OpenRouter API key

5. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Load questions:
```bash
python manage.py load_questions
```

7. Run server:
```bash
python manage.py runserver
```

Backend will run at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL (if needed):
Edit `frontend/config.ts` to match your backend URL.

4. Run development server:
```bash
npm run dev
```

Frontend will run at `http://localhost:3000`

## Usage Flow

1. **Sign Up / Login**: Create an account or login
2. **Select Chapter**: Choose from available JEE Chemistry chapters
3. **Calibrate**: Complete WebGazer calibration (9-dot sequence)
4. **Take Quiz**: 
   - Answer questions while eye tracking monitors attention
   - System adapts difficulty based on performance and focus
   - Submit answers to proceed
5. **View Results**: 
   - See performance metrics and charts
   - Read personalized LLM-generated feedback
   - Review accuracy by difficulty level

## Configuration

### Backend Configuration (`backend/config.py`)

All environment variables are stored in `config.py`:
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `SECRET_KEY`: Django secret key (change in production)
- `DEBUG`: Debug mode (set to False in production)
- CORS settings

### Frontend Configuration (`frontend/config.ts`)

- `apiBaseUrl`: Backend API URL
- `webgazerSampleInterval`: Gaze sampling interval (ms)
- `defaultMaxQuestions`: Default questions per session

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/me/` - Get current user

### Quizzes
- `GET /api/quizzes/chapters/` - List chapters
- `POST /api/quizzes/sessions/start/` - Start quiz session
- `POST /api/quizzes/sessions/{id}/answer/` - Submit answer
- `GET /api/quizzes/sessions/{id}/summary/` - Get results summary

## ITS Algorithm

The Intelligent Tutoring System adjusts question difficulty based on:

1. **Correctness**: Was the answer correct?
2. **Attention**: How focused was the student? (attention_ratio)
3. **Response Time**: How quickly did they answer?

**Ability Adjustment Rules**:
- Correct + High attention (≥0.6) + Fast (<45s) → Increase difficulty
- Correct + Low attention → Keep same difficulty
- Incorrect + High attention → Decrease difficulty
- Incorrect + Very low attention (<0.3) → Ignore sample

**Difficulty Mapping**:
- Ability ≤ -1 → Easy
- Ability = 0 → Medium
- Ability ≥ 1 → Hard

## Development Notes

- WebGazer integration is currently a placeholder. In production, integrate with actual WebGazer.js library.
- All configuration is in Python/TypeScript files (no .env files needed).
- SQLite is used for development. Models are PostgreSQL-compatible.
- CORS is enabled for localhost in development.

## License

This project is for educational purposes.

## Contributing

This is a demonstration project. For production use, consider:
- Adding proper error handling and logging
- Implementing rate limiting
- Adding unit and integration tests
- Setting up CI/CD pipeline
- Configuring proper security headers
- Using environment variables in production
- Implementing WebGazer.js properly
- Adding question bank management UI

