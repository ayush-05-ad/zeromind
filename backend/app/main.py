from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base
from app.routers import auth, tasks, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    print(f"🧠 ZeroMind Backend is ready!")
    print(f"📖 API Docs: {settings.BACKEND_URL}/docs")
    yield
    print("👋 ZeroMind Backend shutting down...")


app = FastAPI(
    title="ZeroMind API",
    description="🧠 Multi-Agent AI Platform for Autonomous Task Execution. Zero Cost. Multiple Minds. Infinite Possibilities.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(admin.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "name": "ZeroMind API",
        "version": "1.0.0",
        "status": "running",
        "tagline": "Zero Cost. Multiple Minds. Infinite Possibilities.",
        "docs": f"{settings.BACKEND_URL}/docs",
        "agents": [
            "orchestrator", "researcher", "coder",
            "analyzer", "writer", "study_helper", "reviewer"
        ]
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "zeromind-backend"}
