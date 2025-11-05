# RankCatalyst - ITS-Aware JEE Chemistry Quiz Platform

An intelligent tutoring system that adapts quiz difficulty based on student attention and performance, using eye-tracking technology and LLM-generated feedback.

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # Linux/Mac

pip install -r requirements.txt

# Create .env file
echo OPENROUTER_API_KEY=your-key-here > .env

python manage.py migrate
python manage.py createsuperuser
python manage.py load_questions
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📚 Documentation

- **Deployment Guide:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for step-by-step deployment instructions
- **API Documentation:** See [API_DOCS.md](./API_DOCS.md) (if exists)

## 🛠️ Tech Stack

- **Backend:** Django 5.0 + Django REST Framework
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Database:** SQLite (dev) / PostgreSQL (production)
- **Authentication:** JWT (SimpleJWT)
- **Eye Tracking:** WebGazer.js
- **LLM:** OpenRouter API (GPT-4o-mini)

## 📝 Features

- ✅ Adaptive quiz difficulty based on attention & performance
- ✅ Real-time eye-tracking with WebGazer.js
- ✅ LLM-generated personalized feedback
- ✅ JWT-based authentication
- ✅ Responsive UI with Tailwind CSS

## 🌐 Deployment

Deployed on:
- **Backend:** Render (Free Tier)
- **Frontend:** Vercel (Free Tier)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📄 License

MIT License
