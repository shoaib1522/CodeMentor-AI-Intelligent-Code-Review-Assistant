"""API Routes for CodeMentor AI"""
from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid

router = APIRouter(prefix="/api", tags=["reviews"])


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
    }


@router.get("/reviews/history")
async def get_review_history(limit: int = 20):
    """Get review history"""
    return []


@router.get("/projects")
async def get_projects():
    """Get all projects"""
    return []


@router.post("/projects")
async def create_project(name: str, description: str):
    """Create a new project"""
    return {"id": str(uuid.uuid4()), "name": name, "description": description}


@router.get("/stats")
async def get_statistics():
    """Get analytics statistics"""
    return {
        "totalReviews": 0,
        "totalVulnerabilities": 0,
        "averageScore": 0,
        "criticalIssues": 0
    }
