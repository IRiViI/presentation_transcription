from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.api import router
from models.config import settings
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="Presentation Translation API",
    description="API for real-time transcription, translation, and text-to-speech",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api", tags=["api"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Presentation Translation API",
        "version": "1.0.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True,  # Enable auto-reload during development
    )
