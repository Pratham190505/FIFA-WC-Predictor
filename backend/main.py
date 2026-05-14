from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import connect_db, disconnect_db
from app.core.ml_loader import load_all_models

from app.routers import auth, predict, simulate, analytics, players, teams


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ───────────────────────────────────────────
    print("🚀 Starting FIFA Predictor API...")
    await connect_db()
    load_all_models()
    print("✅ Database + ML models ready")
    yield
    # ── Shutdown ──────────────────────────────────────────
    await disconnect_db()
    print("👋 Server shut down cleanly")


app = FastAPI(
    title="FIFA WC Prediction API",
    version="1.0.0",
    description="AI-powered FIFA World Cup prediction platform",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ── Routers ───────────────────────────────────────────────
app.include_router(auth.router,      prefix="/api/auth",      tags=["Auth"])
app.include_router(predict.router,   prefix="/api/predict",   tags=["Predictions"])
app.include_router(simulate.router,  prefix="/api/simulate",  tags=["Simulator"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(players.router,   prefix="/api/players",   tags=["Players"])
app.include_router(teams.router,     prefix="/api/teams",     tags=["Teams"])


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "FIFA WC Prediction API is running 🏆"}


@app.get("/api/health", tags=["Health"])
async def health():
    return {"status": "healthy", "version": "1.0.0"}