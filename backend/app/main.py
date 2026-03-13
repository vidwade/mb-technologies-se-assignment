from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes import router as tasks_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="Todo Task API",
        description="REST API for managing todo tasks",
        version="1.0.0",
        openapi_version="3.0.3",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(tasks_router)
    return app


app = create_app()


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
