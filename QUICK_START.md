# 🚀 CodeMentor AI - Quick Start Guide

## 5-Minute Setup

### Step 1: Prepare Environment
```bash
# Navigate to project
cd d:\Projects\CodeMentorAI

# Verify .env file exists with API keys
cat .env
# Should show:
# GROQ_API_KEY=your_groq_api_key_here
# LANGSMITH_API_KEY=your_langsmith_key_here
```

### Step 2: Start Services with Docker
```bash
# Start all services (MongoDB, FastAPI, React)
docker-compose up -d

# Wait 30 seconds for services to start
# Check status
docker-compose ps
```

### Step 3: Verify Services
```
✓ Frontend: http://localhost:5173
✓ API: http://localhost:8000
✓ API Docs: http://localhost:8000/docs
✓ MongoDB: localhost:27017
```

### Step 4: Test the Application
1. Open http://localhost:5173 in browser
2. Paste code into editor:
```python
def get_user_data(user_id):
    query = "SELECT * FROM users WHERE id = " + str(user_id)
    return db.execute(query)
```
3. Click "Review Code"
4. Wait for results to stream in

---

## 📊 Application Tour

### 1. Code Editor Tab
- **Code Editor**: Monaco Editor with syntax highlighting
- **Language Selector**: 10+ programming languages
- **Tools**: Copy, Clear, Line counter
- **Submit Button**: Triggers code review

### 2. Review Results
Shows:
- **Overall Score**: 0-100%
- **Vulnerabilities**: Security issues with severity levels
- **Code Quality Metrics**:
  - Complexity (1-10)
  - Maintainability (0-100%)
  - Code duplication
  - Coverage metrics
- **Suggestions**: Best practices and improvements

### 3. History Tab
- Table of all past reviews
- Language filter
- Severity indicators
- Delete individual reviews

### 4. Analytics Tab
- Total reviews count
- Vulnerability statistics
- Language distribution
- Severity breakdown
- Score trends

---

## 🎯 API Usage Examples

### Using cURL
```bash
# Quick Review
curl -X POST http://localhost:8000/api/review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def hello(): pass",
    "language": "python"
  }'

# Streaming Review
curl -N http://localhost:8000/api/review/stream \
  -d "code=def%20hello():%20pass&language=python"
```

### Using Python
```python
import requests

response = requests.post(
    'http://localhost:8000/api/review',
    json={
        'code': 'def hello(): pass',
        'language': 'python'
    }
)

result = response.json()
print(f"Score: {result['overallScore']}")
print(f"Issues: {len(result['vulnerabilities'])}")
```

### Using JavaScript
```javascript
const response = await fetch('http://localhost:8000/api/review', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'def hello(): pass',
    language: 'python'
  })
});

const result = await response.json();
console.log(`Score: ${result.overallScore}`);
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000 (Backend)
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5173 (Frontend)
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or restart Docker
docker-compose down
docker-compose up -d
```

### MongoDB Connection Error
```bash
# Check MongoDB is running
docker ps | grep mongodb

# View logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Frontend Won't Connect to API
1. Check API is running: `docker-compose logs backend`
2. Check frontend environment:
   ```bash
   # Should show correct API URL
   cat frontend/.env
   ```
3. Clear browser cache and reload

### Groq API Error
- Verify API key in `.env`: `GROQ_API_KEY=gsk_...`
- Check API key is valid at console.groq.com
- Verify API rate limits haven't been exceeded

---

## 📦 What's Included

### Backend (FastAPI)
- ✅ Groq API integration
- ✅ Streaming responses (SSE)
- ✅ API endpoints
- ✅ Error handling
- ✅ CORS configuration
- ⏳ MongoDB integration (ready for setup)
- ⏳ User authentication (ready for setup)

### Frontend (React)
- ✅ Single-page application
- ✅ Code editor (Monaco)
- ✅ Real-time results display
- ✅ Responsive design
- ✅ Analytics dashboard
- ✅ Review history
- ✅ Dark mode ready

### Infrastructure
- ✅ Docker support
- ✅ Docker Compose orchestration
- ✅ MongoDB containerization
- ✅ Environment configuration

---

## 🎓 Understanding the Flow

```
User submits code
    ↓
Frontend sends to /api/review
    ↓
FastAPI receives request
    ↓
Creates Groq API prompt
    ↓
Groq API processes (gpt-oss-20b)
    ↓
Response streamed back as SSE events
    ↓
Frontend displays results in real-time
    ↓
Results stored in memory (MongoDB ready)
```

---

## 🔍 Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just frontend
docker-compose logs -f frontend

# Just MongoDB
docker-compose logs -f mongodb
```

### Check Service Health
```bash
# Backend health check
curl http://localhost:8000/health

# Frontend status
curl http://localhost:5173
```

---

## 🛑 Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v

# Stop specific service
docker-compose stop backend
```

---

## 🎨 Customization

### Change API Port
Edit `docker-compose.yml`:
```yaml
backend:
  ports:
    - "8080:8000"  # Changed from 8000:8000
```

### Change Frontend Port
Edit `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "3000:5173"  # Changed from 5173:5173
```

### Change Database
Edit `.env`:
```
MONGODB_URL=mongodb://your-mongo-host:27017
MONGODB_DATABASE=your_database_name
```

---

## 📱 Response Example

When you submit code:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "overallScore": 45,
  "vulnerabilities": [
    {
      "type": "SQL Injection",
      "severity": "critical",
      "line": 2,
      "message": "User input directly concatenated to SQL",
      "description": "This is vulnerable to SQL injection attacks",
      "recommendation": "Use parameterized queries or prepared statements",
      "cwe": "CWE-89"
    }
  ],
  "codeQuality": {
    "complexity": 6,
    "maintainability": 55,
    "coverage": 0,
    "duplication": 0,
    "issues": ["Missing error handling", "No input validation"]
  },
  "suggestions": [
    {
      "category": "Security",
      "priority": "high",
      "message": "Implement input validation",
      "suggestion": "Validate all user inputs before database operations"
    }
  ],
  "summary": "The code has 1 critical vulnerability related to SQL injection...",
  "analysisTime": 1245
}
```

---

## 🚢 Next Steps

After exploring the app:

1. **Integrate with Your Project**
   - Add code review to CI/CD pipeline
   - Use API for automated reviews

2. **Customize Analysis**
   - Add custom vulnerability rules
   - Integrate additional analyzers

3. **Deploy to Production**
   - Use cloud database (MongoDB Atlas)
   - Deploy backend to AWS/GCP
   - Deploy frontend to Vercel/Netlify

4. **Add Advanced Features**
   - User authentication
   - Team collaboration
   - Integration with GitHub/GitLab
   - Custom webhooks

---

## 📞 Need Help?

- **API Documentation**: http://localhost:8000/docs
- **Groq API Docs**: https://console.groq.com/docs
- **GitHub Issues**: [Report an issue]()
- **Email Support**: support@codementor.ai

---

## ✨ Tips & Tricks

### Disable Auto-Reload (Production)
Edit `docker-compose.yml`:
```yaml
backend:
  environment:
    API_RELOAD: "false"
```

### Increase API Timeout
Edit `.env`:
```
API_TIMEOUT=60000  # milliseconds
```

### Verbose Logging
Edit `.env`:
```
LOG_LEVEL=DEBUG
```

### Test with Sample Code
JavaScript:
```javascript
const x = 1;
eval(userInput);  // Dangerous!
```

Python:
```python
import os
os.system(user_command)  # Dangerous!
```

---

**You're all set! Happy reviewing! 🎉**

Start with http://localhost:5173 and submit your first code review!
