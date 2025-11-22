"""Application Configuration"""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""

    # API Configuration
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", 8000))
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

    # Database Configuration
    MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "codementor_ai")

    # LLM Configuration
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

    # LangSmith Configuration
    LANGSMITH_API_KEY = os.getenv("LANGSMITH_API_KEY", "")
    LANGSMITH_PROJECT = os.getenv("LANGSMITH_PROJECT", "CodeMentorAI")
    LANGSMITH_TRACING_V2 = os.getenv("LANGSMITH_TRACING_V2", "false").lower() == "true"

    # JWT Configuration
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

    # MCP Server Configuration
    MCP_SERVER_PORT = int(os.getenv("MCP_SERVER_PORT", 9000))
    MCP_DEBUG = os.getenv("MCP_DEBUG", "false").lower() == "true"

    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

    # CORS
    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://0.0.0.0:5173",
    ]


config = Config()
