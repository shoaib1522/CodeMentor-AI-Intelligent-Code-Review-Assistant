# 🚀 CodeMentor AI - Commands Reference

## ⚡ Quick Commands

### Start Everything (Recommended)
```bash
cd d:\Projects\CodeMentorAI
docker-compose up -d
```

### Stop Everything
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

---

## 🐳 Docker Commands

### Start Services
```bash
# Start all services in background
docker-compose up -d

# Start with logs visible
docker-compose up

# Rebuild and start
docker-compose up -d --build

# Start specific service
docker-compose up -d backend
```

### Stop Services
```bash
# Stop all services
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove everything including volumes
docker-compose down -v
```

### Check Status
```bash
# List running containers
docker-compose ps

# View resource usage
docker-compose stats

# Check service health
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Last 50 lines
docker-compose logs --tail 50

# With timestamps
docker-compose logs --timestamps -f
```

### Access Container
```bash
# Enter backend container
docker-compose exec backend /bin/bash

# Enter frontend container
docker-compose exec frontend sh

# Enter MongoDB container
docker-compose exec mongodb mongosh
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific
docker-compose restart backend
docker-compose restart frontend
```

---

## 🖥️ Local Development (Without Docker)

### Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r ../requirements.txt

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Backend Commands
```bash
# Run with auto-reload
uvicorn app.main:app --reload

# Run with custom port
uvicorn app.main:app --port 9000

# Run production server
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

### Frontend Commands
```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type checking
npm run type-check

# Format code
npx prettier --write src/
```

---

## 📡 API Commands

### Test Backend Health
```bash
# Using curl
curl http://localhost:8000/health

# Using PowerShell
Invoke-WebRequest -Uri http://localhost:8000/health

# Using Python
curl http://localhost:8000/health | python -m json.tool
```

### Submit Code Review
```bash
# Using curl (standard review)
curl -X POST http://localhost:8000/api/review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def hello(): pass",
    "language": "python"
  }'

# Using PowerShell
$body = @{
    code = "def hello(): pass"
    language = "python"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:8000/api/review `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Stream Code Review
```bash
# Using curl (streaming)
curl -N http://localhost:8000/api/review/stream \
  -d "code=def%20hello():%20pass&language=python"

# Using Python
import requests

response = requests.post('http://localhost:8000/api/review', json={
    'code': 'def hello(): pass',
    'language': 'python'
})
print(response.json())
```

---

## 🧪 Testing Commands

### Run Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test

# With coverage
pytest --cov=app
```

### Code Quality
```bash
# Python linting
flake8 backend/

# Python formatting
black backend/

# Python type checking
mypy backend/

# Frontend linting
npm run lint

# Frontend formatting
npx prettier --write frontend/src/
```

---

## 📦 Dependency Management

### Python
```bash
# Install all requirements
pip install -r requirements.txt

# Upgrade pip
python -m pip install --upgrade pip

# Generate requirements from environment
pip freeze > requirements.txt

# Update specific package
pip install --upgrade groq
```

### Node
```bash
# Install dependencies
npm install

# Install specific package
npm install axios

# Update packages
npm update

# Check outdated packages
npm outdated

# Clean cache
npm cache clean --force
```

---

## 🔧 Environment Setup

### Create .env File
```bash
# Copy template
cp .env.example .env

# Edit with your API keys
# On Windows: notepad .env
# On macOS: nano .env
# On Linux: vim .env
```

### Environment Variables
```bash
# View env variables (backend)
echo $GROQ_API_KEY

# Set temporary env variable (Windows)
$env:GROQ_API_KEY = "your-key-here"

# Set temporary env variable (Linux/macOS)
export GROQ_API_KEY="your-key-here"
```

---

## 🌐 Access Points

### When Services Are Running

```bash
# Frontend
http://localhost:5173

# Backend API
http://localhost:8000

# API Documentation (Swagger)
http://localhost:8000/docs

# API Documentation (ReDoc)
http://localhost:8000/redoc

# MongoDB (local)
mongodb://localhost:27017
```

---

## 🔄 Common Workflows

### Development Workflow
```bash
# 1. Start services
docker-compose up -d

# 2. Make code changes in frontend/src or backend/app

# 3. View logs
docker-compose logs -f

# 4. Test at http://localhost:5173

# 5. When done
docker-compose down
```

### Local Testing
```bash
# 1. Backend only
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate
pip install -r ../requirements.txt
uvicorn app.main:app --reload

# 2. Frontend only (new terminal)
cd frontend
npm install
npm run dev

# 3. MongoDB locally
# Install MongoDB Community Edition first
mongod
```

### Production Deployment
```bash
# 1. Build images
docker-compose build

# 2. Push to registry (optional)
docker tag codementor-ai-backend registry.example.com/backend
docker push registry.example.com/backend

# 3. Run on server
docker-compose -f docker-compose.yml up -d
```

---

## 🐛 Debugging Commands

### Check Service Health
```bash
# Docker health
docker-compose ps

# Backend health
curl http://localhost:8000/health

# Frontend status
curl http://localhost:5173

# MongoDB connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### View Detailed Logs
```bash
# All services with timestamps
docker-compose logs --timestamps

# Backend errors only
docker-compose logs backend 2>&1 | grep -i error

# Follow logs (Ctrl+C to stop)
docker-compose logs -f backend
```

### Port Checking
```bash
# Check what's using a port (Windows)
netstat -ano | findstr :8000

# Check what's using a port (Linux/macOS)
lsof -i :8000

# Kill process using port (Windows)
taskkill /PID <pid> /F

# Kill process using port (Linux/macOS)
kill -9 <pid>
```

### Container Inspection
```bash
# Get container details
docker-compose exec backend env

# Check running processes
docker-compose exec backend ps aux

# View container stats
docker stats codementor_backend

# Get container IP
docker inspect codementor_backend | grep IPAddress
```

---

## 🧹 Cleanup Commands

### Remove Old Containers
```bash
# Remove all stopped containers
docker-compose down

# Remove unused resources
docker system prune

# Remove all (careful!)
docker system prune -a
```

### Reset Everything
```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose down -v --rmi all

# Clean node_modules
rm -rf frontend/node_modules
rm -rf frontend/dist
```

### Clear Cache
```bash
# NPM cache
npm cache clean --force

# Docker build cache
docker builder prune

# Python cache
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete
```

---

## 📊 Monitoring Commands

### Real-time Monitoring
```bash
# Watch logs
docker-compose logs -f

# Watch resources
watch docker stats

# Watch processes
watch "docker-compose ps"
```

### Database Monitoring
```bash
# Connect to MongoDB
docker-compose exec mongodb mongosh

# Inside MongoDB shell:
# Show databases
show databases

# Use database
use codementor_ai

# List collections
show collections

# Query data
db.reviews.find()

# Count documents
db.reviews.countDocuments()
```

---

## 🚀 Deployment Commands

### Build for Production
```bash
# Build Docker images
docker-compose build

# Build with no cache
docker-compose build --no-cache

# Frontend build only
docker build -f frontend/Dockerfile -t codementor-frontend:latest frontend/

# Backend build only
docker build -f backend/Dockerfile -t codementor-backend:latest backend/
```

### Push to Registry
```bash
# Tag images
docker tag codementor-ai-backend:latest registry.io/backend:latest
docker tag codementor-ai-frontend:latest registry.io/frontend:latest

# Push images
docker push registry.io/backend:latest
docker push registry.io/frontend:latest
```

### Scale Services (with Swarm/Kubernetes)
```bash
# Scale with Docker Compose
docker-compose up -d --scale backend=3

# Using docker stack (Swarm)
docker stack deploy -c docker-compose.yml codementor

# Using kubectl (Kubernetes)
kubectl apply -f k8s-deployment.yaml
```

---

## 🔑 Environment Management

### Production Environment Setup
```bash
# Create production .env
cat > .env.production << EOF
ENVIRONMENT=production
GROQ_API_KEY=your-key-here
LOG_LEVEL=WARNING
SECRET_KEY=generate-strong-key-here
EOF

# Export environment
export $(cat .env.production | xargs)

# Verify
echo $ENVIRONMENT
```

---

## 📝 Useful Aliases (Optional)

Add to your shell profile (.bashrc, .zshrc, etc.):

```bash
# Docker aliases
alias start="docker-compose up -d"
alias stop="docker-compose down"
alias logs="docker-compose logs -f"
alias ps="docker-compose ps"
alias restart="docker-compose restart"

# Development
alias dev-backend="cd backend && python -m venv venv && source venv/bin/activate && pip install -r ../requirements.txt && uvicorn app.main:app --reload"
alias dev-frontend="cd frontend && npm install && npm run dev"

# Cleanup
alias clean="docker system prune -a && npm cache clean --force"

# Status
alias health="curl http://localhost:8000/health"
```

---

## 🎯 Command Cheatsheet

| Task | Command |
|------|---------|
| Start everything | `docker-compose up -d` |
| Stop everything | `docker-compose down` |
| View logs | `docker-compose logs -f` |
| Restart service | `docker-compose restart backend` |
| Enter backend | `docker-compose exec backend /bin/bash` |
| Check health | `curl http://localhost:8000/health` |
| Test API | `curl -X POST http://localhost:8000/api/review` |
| View API docs | http://localhost:8000/docs |
| Clean everything | `docker-compose down -v` |
| Run tests | `pytest backend/` |
| Format code | `npm run lint` |

---

## ⚠️ Common Issues & Commands

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <pid> /F

# Linux/macOS
lsof -i :8000
kill -9 <pid>
```

### MongoDB Connection Failed
```bash
# Restart MongoDB
docker-compose restart mongodb

# Check status
docker-compose logs mongodb
```

### Module Not Found (Python)
```bash
# Reinstall requirements
pip install -r requirements.txt

# Verify installation
pip list | grep groq
```

### Node Modules Issues
```bash
# Clear and reinstall
rm -rf frontend/node_modules package-lock.json
npm install
```

---

## 📞 When You're Stuck

1. **Check logs first**
   ```bash
   docker-compose logs -f
   ```

2. **Check if services are running**
   ```bash
   docker-compose ps
   ```

3. **Check health endpoint**
   ```bash
   curl http://localhost:8000/health
   ```

4. **Restart services**
   ```bash
   docker-compose restart
   ```

5. **Read documentation**
   - QUICK_START.md
   - SETUP_GUIDE.md
   - ARCHITECTURE.md

6. **Clean and rebuild**
   ```bash
   docker-compose down -v
   docker-compose build --no-cache
   docker-compose up -d
   ```

---

**Need more help? Check the documentation files or view logs with `docker-compose logs -f`**
