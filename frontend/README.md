# RankCatalyst Frontend

Next.js frontend for RankCatalyst - an ITS-aware JEE Chemistry quizzing platform.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL

Edit `frontend/config.ts` and update:
- `apiBaseUrl`: Backend API URL (default: http://localhost:8000/api)

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Features

- **Authentication**: Login and signup with JWT tokens
- **Dashboard**: Chapter selection interface
- **Quiz Session**: 
  - WebGazer calibration (9-dot sequence)
  - Real-time attention tracking
  - Adaptive question difficulty
  - Timer and attention indicators
- **Results Page**:
  - Performance metrics (accuracy, attention, response time)
  - Interactive charts (Recharts)
  - LLM-generated feedback summary

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Login/Signup pages
│   ├── dashboard/         # Chapter selection
│   └── quiz/               # Quiz session and results
├── components/            # React components
│   ├── auth/              # Authentication forms
│   ├── charts/            # Chart components
│   ├── layout/            # Layout components
│   └── quiz/               # Quiz components
├── lib/                    # Utilities
│   ├── apiClient.ts        # API client with JWT handling
│   ├── types.ts            # TypeScript interfaces
│   └── attention/          # WebGazer integration
└── config.ts               # Configuration (replaces .env)
```

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **Recharts**: Data visualization
- **WebGazer.js**: Eye tracking (placeholder implementation)

## Development Notes

- WebGazer integration is currently a placeholder. In production, integrate with actual WebGazer.js library.
- All configuration is in `config.ts` (no .env file needed).
- JWT tokens are stored in localStorage.
- API client automatically handles token refresh on 401 errors.

