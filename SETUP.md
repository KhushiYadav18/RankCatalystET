# RankCatalyst - Complete Setup Guide

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn
- OpenRouter API key (for LLM features)

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure API key
# Edit backend/config.py and set OPENROUTER_API_KEY to your key

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Load questions
python manage.py load_questions

# Create superuser (optional)
python manage.py createsuperuser

# Run server
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Configure API URL (if backend is not on localhost:8000)
# Edit frontend/config.ts

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 3. Testing the Application

1. Open `http://localhost:3000` in your browser
2. Click "Sign Up" and create an account
3. Log in with your credentials
4. Select a chapter from the dashboard
5. Complete the WebGazer calibration (9-dot sequence)
6. Answer quiz questions
7. View your results and performance summary

## Troubleshooting

### Backend Issues

- **Import errors**: Make sure virtual environment is activated
- **Database errors**: Run `python manage.py migrate` again
- **API key errors**: Check `backend/config.py` has correct OpenRouter API key

### Frontend Issues

- **API connection errors**: Verify backend is running on port 8000
- **Build errors**: Delete `node_modules` and `.next`, then run `npm install` again
- **CORS errors**: Check backend CORS settings in `backend/config.py`

### WebGazer Issues

- The current implementation uses a placeholder for WebGazer.js
- For production, install WebGazer.js: `npm install webgazer`
- Update `frontend/lib/attention/webgazerClient.ts` with actual WebGazer.js integration

## Production Deployment

1. Set `DEBUG = False` in `backend/config.py`
2. Change `SECRET_KEY` to a secure random value
3. Update `ALLOWED_HOSTS` with your domain
4. Configure production database (PostgreSQL recommended)
5. Set up environment variables properly (or keep using config files)
6. Configure CORS for production domain
7. Build frontend: `npm run build`
8. Use production server (Gunicorn, etc.) for Django

## Next Steps

- Integrate actual WebGazer.js library
- Add more questions to question bank
- Implement question bank management UI
- Add user progress tracking
- Add social features (leaderboards, etc.)
- Implement advanced analytics

