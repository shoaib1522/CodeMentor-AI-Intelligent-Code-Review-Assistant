"""Pydantic Schemas for Data Validation"""
from pydantic import BaseModel, Field
from typing import List, Optional


class Vulnerability(BaseModel):
    """Vulnerability data model"""
    id: str
    type: str
    severity: str = Field(..., pattern="^(critical|high|medium|low|info)$")
    line: int
    message: str
    description: str
    recommendation: str
    cwe: Optional[str] = None


class CodeQualityMetrics(BaseModel):
    """Code quality metrics"""
    complexity: int = Field(ge=1, le=10)
    maintainability: int = Field(ge=0, le=100)
    coverage: int = Field(ge=0, le=100)
    duplication: int = Field(ge=0, le=100)
    issues: List[str] = []


class Suggestion(BaseModel):
    """Code improvement suggestion"""
    id: str
    category: str
    priority: str = Field(..., pattern="^(high|medium|low)$")
    message: str
    suggestion: str


class CodeReviewRequest(BaseModel):
    """Code review request"""
    code: str = Field(..., min_length=1)
    language: str
    projectId: Optional[str] = None
    fileName: Optional[str] = None


class CodeReviewResult(BaseModel):
    """Code review result"""
    id: str
    vulnerabilities: List[Vulnerability]
    codeQuality: CodeQualityMetrics
    suggestions: List[Suggestion]
    summary: str
    overallScore: int = Field(ge=0, le=100)
    analysisTime: int
