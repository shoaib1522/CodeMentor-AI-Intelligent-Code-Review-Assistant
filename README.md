# CodeMentor AI - Intelligent Code Review Assistant

AI-powered code review system that analyzes code for security vulnerabilities, code quality issues, and best practice violations using Groq's fastest LLM inference.

## Overview

CodeMentor AI is a full-stack application that leverages artificial intelligence to provide instant, comprehensive code reviews. It detects security vulnerabilities (SQL injection, XSS, command injection), analyzes code quality metrics, and provides actionable recommendations for improvement.

**Key Features:**
- ✅ Real-time code analysis with AI-powered insights
- ✅ Multi-language support (Python, JavaScript, Java, TypeScript, Go, Ruby, PHP, C++, etc.)
- ✅ OWASP Top 10 vulnerability detection
- ✅ Code quality scoring and metrics
- ✅ Server-Sent Events (SSE) streaming for real-time results
- ✅ Review history and analytics dashboard
- ✅ Beautiful, responsive React UI
- ✅ Docker Compose for easy deployment

## Tech Stack

### Backend
- **Framework:** FastAPI (Python)
- **LLM API:** Groq API (gpt-oss-20b model)
- **Code Analysis:** Custom AST parser and vulnerability detector
- **Database:** MongoDB with Motor (async driver)
- **Server:** Uvicorn
- **Streaming:** Server-Sent Events (SSE)

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **State Management:** Zustand
- **Editor:** Monaco Editor
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.9+
- Groq API Key (free from https://console.groq.com)

### Local Development

1. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export GROQ_API_KEY=your_api_key_here
python -m uvicorn app.main:app --reload
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

3. **Access**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## API Endpoints

### Code Review (Streaming)
```
GET /api/review/stream?code=<code>&language=<language>
```

## Project Structure

```
CodeMentorAI/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/routes.py
│   │   └── models/schemas.py
│   ├── mcp_server/
│   │   ├── server.py
│   │   └── tools/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
└── docker-compose.yml
```

## Features

- Real-time code analysis with streaming results
- Multi-language support (10+ languages)
- OWASP vulnerability detection
- Code quality metrics and scoring
- Review history tracking
- Analytics dashboard
- Beautiful responsive UI

## Security

CodeMentor AI detects:
- SQL Injection attacks
- Cross-Site Scripting (XSS)
- Command Injection
- Hardcoded credentials
- Insecure deserialization
- Missing input validation
- And more OWASP Top 10 vulnerabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Author

**Shoaib** - Full Stack Developer
GitHub: [@shoaib1522](https://github.com/shoaib1522)
Email: sa1670001@gmail.com

---

**Star ⭐ this repository if you find it helpful!**
