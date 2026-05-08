from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .models import User, Project, ProjectMember, Task
from .routers import auth, users, projects, tasks, dashboard
from .utils.seed import seed_database

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Team Task Manager API",
    description="A full-stack team collaboration tool with role-based access control.",
    version="1.0.0",
)

# CORS — allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your Railway frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(dashboard.router)


@app.on_event("startup")
def on_startup():
    """Seed demo data on first startup."""
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Team Task Manager API is running 🚀"}


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to Team Task Manager API",
        "docs": "/docs",
        "version": "1.0.0"
    }
