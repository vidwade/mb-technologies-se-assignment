from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import router as tasks_router
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Todo Task API",
    description="REST API for managing todo tasks",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks_router)


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
