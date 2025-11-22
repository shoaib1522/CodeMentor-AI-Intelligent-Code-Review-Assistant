# CodeMentor AI - Setup Guide

Complete step-by-step guide to set up CodeMentor AI locally or in production.

## Prerequisites

- Node.js 16+ with npm
- Python 3.9 or higher
- Git
- Docker & Docker Compose (optional, for containerized setup)
- Groq API Key (free from https://console.groq.com)

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/shoaib1522/CodeMentor-AI-Intelligent-Code-Review-Assistant.git
cd CodeMentorAI
```

### Step 2: Backend Setup

#### 2.1 Create Python Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

#### 2.2 Install Python Dependencies

```bash
pip install -r ../requirements.txt
```

#### 2.3 Configure Environment Variables

```bash
# Create .env file in backend directory
cat > .env << 'ENVFILE'
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=codementor
API_HOST=0.0.0.0
API_PORT=8000
FRONTEND_URL=http://localhost:5173
ENVFILE
```

Replace `your_groq_api_key_here` with your actual Groq API key.

#### 2.4 Start Backend Server

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
Uvicorn running on http://0.0.0.0:8000
Application startup complete
```

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory (new terminal)

```bash
cd frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

#### 3.3 Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v4.x.x ready in xxx ms

➜ Local: http://localhost:5173/
```

### Step 4: Access Application

Open your browser and go to: **http://localhost:5173**

You should see the CodeMentor AI interface with:
- Code editor on the left
- Settings panel
- Results panel on the right

## Docker Setup (Recommended for Production)

### Step 1: Prepare Environment

```bash
# From project root
cp .env.example .env

# Edit .env with your Groq API key
nano .env  # or use your preferred editor
```

### Step 2: Start Services

```bash
docker-compose up -d
```

### Step 3: Verify Services

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# Test backend API
curl http://localhost:8000/health
```

### Step 4: Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Step 5: Stop Services

```bash
docker-compose down

# To remove volumes (database):
docker-compose down -v
```

## Testing the Application

### Test Example 1: SQL Injection Detection

1. Open http://localhost:5173
2. Select language: **Python**
3. Paste this code:
```python
def get_user_by_id(user_id):
    import sqlite3
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE id = " + str(user_id)
    cursor.execute(query)
    return cursor.fetchone()
```
4. Click "Analyze"
5. Results should show SQL Injection vulnerability

### Test Example 2: Hardcoded Credentials

1. Language: **Python**
2. Paste:
```python
class Config:
    DB_PASSWORD = "SuperSecret123!"
    API_KEY = "sk_live_abcd1234"
```
3. Click "Analyze"
4. Should detect hardcoded credentials

### Test Example 3: XSS Vulnerability

1. Language: **JavaScript**
2. Paste:
```javascript
function displayComment(comment) {
    document.getElementById('comments').innerHTML = `<p>${comment}</p>`;
}
```
3. Click "Analyze"
4. Should detect XSS vulnerability

## Environment Variables Explained

| Variable | Description | Default |
|----------|-------------|---------|
| GROQ_API_KEY | API key from Groq console | Required |
| MONGODB_URL | MongoDB connection string | mongodb://localhost:27017 |
| DATABASE_NAME | Database name in MongoDB | codementor |
| API_HOST | Backend server host | 0.0.0.0 |
| API_PORT | Backend server port | 8000 |
| FRONTEND_URL | Frontend application URL | http://localhost:5173 |

## Troubleshooting

### Issue: "GROQ_API_KEY not found"

**Solution:** Ensure .env file exists in backend directory with correct API key.

```bash
cd backend
cat .env  # Check file contents
```

### Issue: "Connection refused" on MongoDB

**Solution:** MongoDB is not running. Either:
- Start MongoDB locally
- Use Docker: `docker-compose up -d`
- Remove MongoDB requirement from code

### Issue: "Port 5173 already in use"

**Solution:** Change port in frontend:
```bash
npm run dev -- --port 3000
```

### Issue: "Module not found" in Python

**Solution:** Reinstall dependencies:
```bash
cd backend
pip install -r ../requirements.txt --force-reinstall
```

### Issue: "Cannot find module" in npm

**Solution:** Clear and reinstall:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Backend returns 502 Bad Gateway

**Solution:** 
- Check backend is running: `curl http://localhost:8000/health`
- Check API server logs
- Restart backend server

## API Documentation

### Swagger UI

Once backend is running, visit: **http://localhost:8000/docs**

### ReDoc

Alternative docs: **http://localhost:8000/redoc**

## Production Deployment

### Using Heroku

See `DEPLOYMENT.md` for detailed instructions.

### Using DigitalOcean App Platform

1. Connect GitHub repository
2. Configure environment variables
3. Set build commands
4. Deploy

### Using AWS EC2

1. Launch Ubuntu instance
2. Install Docker and Docker Compose
3. Clone repository
4. Configure .env
5. Run `docker-compose up -d`

## Performance Optimization

### Frontend Optimization
```bash
# Build optimized bundle
cd frontend
npm run build

# Preview production build
npm run preview
```

### Backend Optimization
- Enable caching for repeated analyses
- Implement rate limiting
- Use connection pooling for MongoDB

## Monitoring and Logging

### Backend Logs
```bash
# View real-time logs
docker-compose logs -f backend

# View specific service
docker-compose logs -f frontend
```

### Database Monitoring
```bash
# Connect to MongoDB
docker-compose exec mongodb mongosh

# View databases
show databases

# Use codementor database
use codementor

# View collections
show collections
```

## Next Steps

1. Read [README.md](README.md) for project overview
2. Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
3. Explore API docs at http://localhost:8000/docs
4. Create issues or PRs for improvements

## Getting Help

- Check [FAQ in README.md](README.md#faq)
- Open an issue on GitHub
- Review existing issues and discussions
- Contact maintainers

---

**Happy coding! 🚀**
