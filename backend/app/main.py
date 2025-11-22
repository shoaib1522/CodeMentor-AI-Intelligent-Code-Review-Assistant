"""Main FastAPI Application"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json
import logging
from datetime import datetime
import uuid

from app.config import config
from groq import Groq

# Configure logging
logging.basicConfig(level=config.LOG_LEVEL)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="CodeMentor AI",
    description="Intelligent Code Review Assistant",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_client = Groq(api_key=config.GROQ_API_KEY)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "environment": config.ENVIRONMENT
    }


@app.post("/api/review")
async def submit_code_review(request: dict):
    """Submit code for review (non-streaming)"""
    try:
        code = request.get("code", "")
        language = request.get("language", "python")

        if not code.strip():
            raise HTTPException(status_code=400, detail="Code cannot be empty")

        # Create review prompt
        prompt = f"""Review the following {language} code for security vulnerabilities, code quality issues, and best practices.

Code:
```{language}
{code}
```

Provide a comprehensive review in JSON format with the following structure:
{{
    "vulnerabilities": [
        {{
            "type": "vulnerability type",
            "severity": "critical|high|medium|low|info",
            "line": 1,
            "message": "brief message",
            "description": "detailed description",
            "recommendation": "how to fix it",
            "cwe": "CWE-XXX"
        }}
    ],
    "codeQuality": {{
        "complexity": 1-10,
        "maintainability": 0-100,
        "coverage": 0-100,
        "duplication": 0-100,
        "issues": ["issue1", "issue2"]
    }},
    "suggestions": [
        {{
            "category": "category",
            "priority": "high|medium|low",
            "message": "message",
            "suggestion": "suggestion"
        }}
    ],
    "summary": "overall summary of the review",
    "overallScore": 0-100
}}"""

        # Call Groq API
        response = groq_client.chat.completions.create(
            model=config.GROQ_MODEL,
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2048,
            top_p=1,
        )

        result_text = response.choices[0].message.content

        # Parse the response
        try:
            result = json.loads(result_text)
        except json.JSONDecodeError:
            # Extract JSON from response if it contains other text
            import re
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
            else:
                result = {
                    "vulnerabilities": [],
                    "codeQuality": {"complexity": 5, "maintainability": 70, "coverage": 50, "duplication": 0, "issues": []},
                    "suggestions": [],
                    "summary": result_text,
                    "overallScore": 70
                }

        # Add metadata
        result["id"] = str(uuid.uuid4())
        result["analysisTime"] = 1000  # Placeholder

        return result

    except Exception as e:
        logger.error(f"Error during code review: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/review/stream")
async def stream_code_review(code: str, language: str = "python"):
    """Stream code review results"""
    try:
        if not code.strip():
            raise HTTPException(status_code=400, detail="Code cannot be empty")

        async def generate():
            # Create review prompt
            prompt = f"""Review the following {language} code for security vulnerabilities, code quality issues, and best practices.

Code:
```{language}
{code}
```

Provide a comprehensive review in JSON format with the following structure:
{{
    "vulnerabilities": [
        {{
            "type": "vulnerability type",
            "severity": "critical|high|medium|low|info",
            "line": 1,
            "message": "brief message",
            "description": "detailed description",
            "recommendation": "how to fix it",
            "cwe": "CWE-XXX"
        }}
    ],
    "codeQuality": {{
        "complexity": 1-10,
        "maintainability": 0-100,
        "coverage": 0-100,
        "duplication": 0-100,
        "issues": ["issue1", "issue2"]
    }},
    "suggestions": [
        {{
            "category": "category",
            "priority": "high|medium|low",
            "message": "message",
            "suggestion": "suggestion"
        }}
    ],
    "summary": "overall summary of the review",
    "overallScore": 0-100
}}"""

            yield f"data: {json.dumps({'type': 'start'})}\n\n"

            try:
                # Stream from Groq API
                stream = groq_client.chat.completions.create(
                    model=config.GROQ_MODEL,
                    messages=[
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=2048,
                    top_p=1,
                    stream=True,
                )

                full_response = ""
                for chunk in stream:
                    if chunk.choices[0].delta.content:
                        full_response += chunk.choices[0].delta.content
                        yield f"data: {json.dumps({'type': 'chunk', 'content': chunk.choices[0].delta.content})}\n\n"

                # Parse and yield complete result
                try:
                    result = json.loads(full_response)
                except json.JSONDecodeError:
                    import re
                    json_match = re.search(r'\{.*\}', full_response, re.DOTALL)
                    if json_match:
                        result = json.loads(json_match.group())
                    else:
                        result = {
                            "vulnerabilities": [],
                            "codeQuality": {"complexity": 5, "maintainability": 70, "coverage": 50, "duplication": 0, "issues": []},
                            "suggestions": [],
                            "summary": full_response,
                            "overallScore": 70
                        }

                result["id"] = str(uuid.uuid4())
                result["analysisTime"] = 1000

                yield f"data: {json.dumps({'type': 'complete', 'data': result})}\n\n"

            except Exception as e:
                logger.error(f"Error during streaming review: {str(e)}")
                yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:
        logger.error(f"Error setting up stream: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/reviews/history")
async def get_review_history(limit: int = 20):
    """Get review history"""
    # TODO: Implement MongoDB integration
    return []


@app.get("/api/projects")
async def get_projects():
    """Get all projects"""
    # TODO: Implement MongoDB integration
    return []


@app.post("/api/projects")
async def create_project(name: str, description: str):
    """Create a new project"""
    # TODO: Implement MongoDB integration
    return {"id": str(uuid.uuid4()), "name": name, "description": description}


@app.get("/api/stats")
async def get_statistics():
    """Get analytics statistics"""
    # TODO: Implement MongoDB integration
    return {
        "totalReviews": 0,
        "totalVulnerabilities": 0,
        "averageScore": 0,
        "criticalIssues": 0
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=config.API_HOST,
        port=config.API_PORT,
        reload=config.ENVIRONMENT == "development"
    )
