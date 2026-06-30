# FIFA WC Predictor

FIFA WC Predictor is a full-stack football intelligence web app for exploring international teams, predicting match outcomes, and simulating a FIFA World Cup tournament. The app combines a React/Vite frontend, a FastAPI backend, MongoDB authentication/history storage, and PyTorch-based prediction models trained from football results, squad, valuation, and ELO data.

The frontend is branded as **FootyVerse** and includes an interactive prediction dashboard, tournament simulator, analytics views, team pages, authentication screens, 3D/animated visuals, and a penalty shootout mini-game.

## Features

- **Match prediction**: Select two national teams and get win/draw/loss probabilities, predicted scoreline, confidence, ELO values, and key match factors.
- **Tournament simulation**: Run 50, 75, or 100 Monte Carlo simulations to generate group standings, knockout brackets, finalists, champion probabilities, and a sample tournament path.
- **Analytics dashboard**: Explore attack rankings, defense rankings, top scorers, team form, head-to-head records, prediction accuracy, and confederation statistics.
- **Team intelligence**: Browse all teams, inspect team details, and compare two teams side by side.
- **Player data**: Search players, view top-valued players, and list players by national team.
- **Authentication**: Register, log in, refresh JWT tokens, view profile data, change password, and keep user-specific prediction history.
- **Interactive frontend**: Built with React, TanStack Router, Tailwind CSS, Radix UI, Framer Motion, Recharts, Three.js, and lucide icons.
- **Penalty shootout mini-game**: Includes shot physics, AI goalkeeper logic, power meter, scoreboard, commentary, difficulty controls, animations, and sound effects.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Tailwind CSS
- Radix UI components
- Framer Motion
- Recharts
- Three.js / React Three Fiber
- Axios
- Howler.js

### Backend

- FastAPI
- Python 3.11
- MongoDB Atlas via Motor
- JWT authentication with `python-jose`
- Passlib/bcrypt password hashing
- PyTorch prediction models
- pandas, NumPy, scikit-learn, joblib

## Project Structure

```text
.
|-- backend/
|   |-- app/
|   |   |-- controllers/       # Business logic for auth, predictions, simulation, analytics, players, teams
|   |   |-- core/              # Config, database, security, ML model loading
|   |   |-- models/            # Pydantic request/response models
|   |   `-- routers/           # FastAPI route definitions
|   |-- data/
|   |   |-- raw/               # Source CSV datasets
|   |   |-- processed/         # Generated features and processed datasets
|   |   `-- training/          # ELO, feature engineering, analytics, and training scripts
|   |-- models/                # Trained model artifacts and scalers
|   |-- main.py                # FastAPI app entry point
|   |-- requirements.txt
|   `-- Dockerfile
|
|-- frontend/
|   |-- public/                # Static assets
|   |-- src/
|   |   |-- components/        # UI, layout, cards, charts, pages, and Three.js components
|   |   |-- data/              # Mock/team/flag data used by the UI
|   |   |-- features/          # Penalty shootout feature
|   |   |-- hooks/             # API hooks and UI hooks
|   |   |-- lib/               # Axios client, API wrappers, simulation helpers, utilities
|   |   |-- routes/            # TanStack route files
|   |   |-- store/             # App context
|   |   `-- main.tsx
|   |-- package.json
|   `-- vite.config.ts
|
`-- README.md
```

## Prerequisites

- Node.js 20 or newer
- npm, or Bun if you prefer
- Python 3.11
- MongoDB Atlas database or another MongoDB-compatible connection string
- Optional: Docker for backend container builds

## Environment Variables

Create a backend environment file at `backend/.env`:

```env
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=fifa_predictor
SECRET_KEY=replace_with_a_long_random_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
APP_ENV=development
FRONTEND_URL=http://localhost:5173
```

Create a frontend environment file at `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Do not commit real database credentials or production secrets.

## Local Setup

### 1. Clone and enter the project

```bash
git clone <repository-url>
cd FIFA-WC-Predictor
```

### 2. Start the backend

```bash
cd backend

# Build the Docker image
docker buildx build --load -t fifa-backend:latest .

# Run the backend container
docker run -p 8000:8000 --env-file .env fifa-backend:latest

Once the container starts successfully, the backend API will be available at:

http://localhost:8000
http://localhost:8000/docs
http://localhost:8000/api/health

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will usually run at:

```text
http://localhost:5173
```

## Available Scripts

### Frontend

Run these from `frontend/`:

```bash
npm run dev        # Start Vite dev server
npm run build      # Build production frontend
npm run build:dev  # Build in development mode
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run format     # Format files with Prettier
```

### Backend

Run these from `backend/`:

```bash
uvicorn main:app --reload --port 8000
python data/training/compute_elo.py
python data/training/build_squad_features.py
python data/training/feature_engineering.py
python data/training/train_match_model.py
python data/training/build_analytics.py
```

## API Overview

All application endpoints are mounted under `/api`.

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `PUT /api/auth/change-password`
- `POST /api/auth/logout`

### Predictions

- `POST /api/predict/match`
- `GET /api/predict/history`

Guest users can predict matches. Authenticated users also get saved prediction history.

### Tournament Simulation

- `POST /api/simulate/tournament`

Accepted simulation counts are `50`, `75`, and `100`.

### Analytics

- `GET /api/analytics/dashboard`
- `GET /api/analytics/attack-rankings`
- `GET /api/analytics/defense-rankings`
- `GET /api/analytics/top-scorers`
- `GET /api/analytics/team-form`
- `GET /api/analytics/h2h`
- `GET /api/analytics/prediction-accuracy`
- `GET /api/analytics/confederation-stats`

### Teams

- `GET /api/teams/`
- `GET /api/teams/{team_name}`
- `GET /api/teams/compare`

### Players

- `GET /api/players/top-valued`
- `GET /api/players/search`
- `GET /api/players/team/{team_name}`

## Machine Learning Pipeline

The backend loads trained model artifacts from `backend/models/` during startup:

- `match_predictor.pt`
- `score_predictor.pt`
- `scaler.pkl`
- `feature_cols.pkl`
- `elo_ratings.pkl`
- `analytics_data.pkl`

The match predictor uses engineered team features such as:

- ELO rating
- FIFA rank
- squad market value
- top-player value
- average age
- average caps
- star/elite player counts
- win rate
- goal difference average
- recent form
- neutral venue flag
- penalty-related indicators

The training flow is:

1. Compute current and historical ELO ratings.
2. Build squad-level features from player and valuation data.
3. Engineer match-level training features.
4. Train the PyTorch match outcome and scoreline models.
5. Build analytics artifacts for dashboard endpoints.

Raw datasets live in `backend/data/raw/`, processed datasets live in `backend/data/processed/`, and trained artifacts live in `backend/models/`.

## Docker Backend

You can build and run the backend with Docker:

```bash
cd backend
docker build -t fifa-wc-predictor-api .
docker run -p 8000:8000 --env-file .env fifa-wc-predictor-api
```

## Frontend Pages

- `/` - Home page with top teams and 3D visual background
- `/predict` - Match prediction workflow
- `/tournament` - World Cup tournament simulator
- `/analytics` - Analytics dashboard
- `/teams` - Team browsing and comparison
- `/login` - Login screen
- `/signup` - Registration screen

## Notes for Development

- The frontend API client reads `VITE_API_URL` and sends requests to `${VITE_API_URL}/api`.
- Access tokens and refresh tokens are stored in browser local storage.
- The backend allows local development CORS origins such as `localhost` and `127.0.0.1`.
- The backend creates indexes for `users.email`, `users.username`, `predictions.user_id`, and `predictions.created_at` on startup.
- If model files are missing, run the training scripts before starting the API.

## License

No license file is currently included. Add one before publishing or distributing the project.
