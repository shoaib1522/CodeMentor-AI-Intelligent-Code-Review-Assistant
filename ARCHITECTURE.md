# 🏗️ CodeMentor AI - Architecture & System Design

## 📐 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                     │
│                    (http://localhost:5173)                               │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                    HTTP + WebSocket + Server-Sent Events
                                   │
┌──────────────────────────────────▼──────────────────────────────────────┐
│                        REACT FRONTEND (SPA)                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Components:                                                    │   │
│  │  • Header (Navigation)                                          │   │
│  │  • CodeEditor (Monaco Editor)                                   │   │
│  │  • ReviewPanel (Results Display)                                │   │
│  │  • History (Review Table)                                       │   │
│  │  • Analytics (Dashboard)                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  State Management (Zustand):                                    │   │
│  │  • currentCode                                                  │   │
│  │  • currentLanguage                                              │   │
│  │  • currentResult                                                │   │
│  │  • isLoading / isStreaming                                      │   │
│  │  • history                                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Services:                                                      │   │
│  │  • apiClient (Axios + EventSource)                              │   │
│  │  • useReview Hook (Business Logic)                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
            REST API (POST /api/review)
            SSE Stream (GET /api/review/stream)
            GET requests for history/stats
                                   │
┌──────────────────────────────────▼──────────────────────────────────────┐
│                    FASTAPI BACKEND SERVER                                │
│                  (http://localhost:8000)                                 │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  API Routes:                                                    │   │
│  │  ├─ POST /api/review (Standard review)                          │   │
│  │  ├─ GET /api/review/stream (Streaming review)                   │   │
│  │  ├─ GET /api/reviews/history (Get history)                      │   │
│  │  ├─ GET /api/projects (List projects)                           │   │
│  │  ├─ POST /api/projects (Create project)                         │   │
│  │  ├─ GET /api/stats (Get statistics)                             │   │
│  │  └─ GET /health (Health check)                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Middleware:                                                    │   │
│  │  • CORS Handler                                                 │   │
│  │  • Error Handler                                                │   │
│  │  • Logging                                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────┘
              ┌────────────────────┼────────────────────┐
              │                    │                    │
         HTTP │              HTTP  │             MongoDB│
              ▼                    ▼                    ▼
    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
    │  GROQ API        │  │  MCP Server      │  │  MongoDB         │
    │  (gpt-oss-20b)   │  │  (Future)        │  │  (localhost:27017)
    │                  │  │                  │  │                  │
    │ • Code Analysis  │  │ • Code Parser    │  │ • Reviews        │
    │ • Vulnerability  │  │ • AST Analysis   │  │ • Projects       │
    │   Detection      │  │ • Quality Metrics│  │ • User Data      │
    │ • Streaming      │  │ • Rule Engine    │  │ • History        │
    │   Responses      │  │                  │  │                  │
    └──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 🔄 Request/Response Flow

### Standard Code Review Flow

```
1. USER SUBMITS CODE
   └─ User pastes code into Monaco Editor
   └─ Selects language
   └─ Clicks "Review Code" button

2. FRONTEND PROCESSING
   └─ Zustand store updates (setCode, setLanguage)
   └─ useReview hook validates input
   └─ Creates CodeReviewRequest object:
      {
        code: "user's code...",
        language: "python"
      }

3. API REQUEST
   └─ axios.post('/api/review', request)
   └─ Frontend shows loading state
   └─ Sets isLoading = true

4. BACKEND PROCESSING
   └─ FastAPI receives POST request
   └─ Validates code is not empty
   └─ Creates Groq API prompt:
      "Review this Python code for vulnerabilities..."
   └─ Calls Groq API with prompt
   └─ Groq returns JSON analysis

5. RESPONSE PARSING
   └─ Backend parses Groq JSON response
   └─ Adds metadata (id, analysisTime)
   └─ Returns to frontend

6. FRONTEND DISPLAY
   └─ Zustand store updates with result
   └─ ReviewPanel renders:
      ├─ Overall score
      ├─ Vulnerabilities list
      ├─ Code quality metrics
      └─ Suggestions
   └─ History is updated
   └─ isLoading = false

7. USER SEES RESULTS
   └─ Beautiful formatted review displayed
   └─ User can click "History" to see past reviews
   └─ User can click "Analytics" for trends
```

### Streaming Code Review Flow

```
1. USER SUBMITS CODE (same as above)

2. FRONTEND PROCESSING (same as above)

3. STREAMING REQUEST
   └─ Zustand updates (setStreaming = true)
   └─ apiClient.submitCodeReviewStream(request)
   └─ Creates EventSource for SSE
   └─ Opens connection to /api/review/stream

4. BACKEND STREAMING
   └─ FastAPI creates async generator
   └─ Yields: { type: "start" }
   └─ Calls Groq API with stream=True
   └─ For each chunk from Groq:
      └─ Yields: { type: "chunk", content: "..." }
   └─ After complete response:
      └─ Parses complete JSON
      └─ Yields: { type: "complete", data: {...} }

5. FRONTEND STREAMING
   └─ EventSource listens for messages
   └─ For each message:
      └─ type: "start" → shows loading spinner
      └─ type: "chunk" → accumulates text
      └─ type: "vulnerability" → shows progress
      └─ type: "quality" → shows progress
      └─ type: "suggestion" → shows progress
      └─ type: "complete" → displays final result
      └─ type: "error" → shows error message

6. USER SEES REAL-TIME FEEDBACK
   └─ Loading animation with progress message
   └─ Results appear as they're ready
   └─ Smooth transition to final display
```

---

## 🗂️ Component Hierarchy

```
App
├─ Header
│  └─ Navigation Tabs (Editor, History, Analytics)
│
└─ Main Content (based on active tab)
   │
   ├─ [EDITOR TAB]
   │  ├─ CodeEditor
   │  │  ├─ Language Selector
   │  │  ├─ Monaco Editor
   │  │  └─ Code Statistics
   │  │
   │  └─ ReviewPanel
   │     ├─ Summary Card
   │     ├─ Metrics Grid
   │     ├─ Vulnerabilities List
   │     │  └─ VulnerabilityCard (multiple)
   │     └─ Suggestions List
   │
   ├─ [HISTORY TAB]
   │  └─ History
   │     └─ Review History Table
   │        └─ TableRow (multiple)
   │
   └─ [ANALYTICS TAB]
      └─ Analytics
         ├─ Overview Cards
         ├─ Language Distribution
         ├─ Severity Distribution
         └─ Score Trend

Footer (static)
└─ Footer Content
```

---

## 💾 Data Structures

### Frontend State (Zustand Store)

```typescript
interface ReviewState {
  // Input
  currentCode: string;
  currentLanguage: string;

  // Loading
  isLoading: boolean;
  isStreaming: boolean;

  // Output
  currentResult: CodeReviewResult | null;
  error: string | null;
  streamingProgress: string;

  // History
  history: ReviewHistory[];

  // Actions
  setCode, setLanguage, setLoading, setStreaming,
  setResult, setError, setStreamingProgress,
  setHistory, addToHistory, reset
}
```

### API Response (CodeReviewResult)

```typescript
interface CodeReviewResult {
  id: string;
  overallScore: number;
  vulnerabilities: Vulnerability[];
  codeQuality: CodeQualityMetrics;
  suggestions: Suggestion[];
  summary: string;
  analysisTime: number;
}

interface Vulnerability {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  line: number;
  message: string;
  description: string;
  recommendation: string;
  cwe?: string;
}

interface CodeQualityMetrics {
  complexity: number;
  maintainability: number;
  coverage: number;
  duplication: number;
  issues: string[];
}

interface Suggestion {
  id: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  message: string;
  suggestion: string;
}
```

---

## 🔌 API Specifications

### POST /api/review
**Non-streaming code review**

```
Request:
POST /api/review
Content-Type: application/json

{
  "code": "def vulnerable(): pass",
  "language": "python",
  "projectId?": "uuid",
  "fileName?": "test.py"
}

Response:
200 OK
Content-Type: application/json

{
  "id": "uuid",
  "vulnerabilities": [...],
  "codeQuality": {...},
  "suggestions": [...],
  "summary": "string",
  "overallScore": 0-100,
  "analysisTime": milliseconds
}
```

### GET /api/review/stream
**Streaming code review**

```
Request:
GET /api/review/stream?code=...&language=python

Response:
200 OK
Content-Type: text/event-stream
Transfer-Encoding: chunked

data: {"type":"start"}
data: {"type":"chunk","content":"..."}
data: {"type":"vulnerability",...}
data: {"type":"quality",...}
data: {"type":"suggestion",...}
data: {"type":"complete","data":{...}}
```

---

## 🗄️ Database Schema (MongoDB)

### reviews Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  project_id: ObjectId,
  code: String,
  language: String,
  fileName: String,
  result: {
    vulnerabilities: Array,
    codeQuality: Object,
    suggestions: Array,
    summary: String,
    overallScore: Number,
    analysisTime: Number
  },
  createdAt: Date,
  updatedAt: Date,
  tags: [String]
}
```

### projects Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  user_id: ObjectId,
  reviewCount: Number,
  averageScore: Number,
  createdAt: Date,
  updatedAt: Date,
  tags: [String]
}
```

### users Collection (Future)
```javascript
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  name: String,
  avatar: String,
  createdAt: Date,
  settings: Object
}
```

---

## 🚀 Deployment Architecture

### Development
```
Docker Desktop
├─ Backend Container (FastAPI)
├─ Frontend Container (React Dev Server)
└─ MongoDB Container
```

### Production
```
Cloud Provider (AWS/GCP/Azure)
├─ Load Balancer
│  ├─ SSL/TLS Termination
│  └─ Auto-scaling
├─ Frontend
│  ├─ CDN (CloudFront/Cloudflare)
│  └─ Static hosting
├─ Backend
│  ├─ Auto-scaling groups
│  ├─ Load balancing
│  └─ Health checks
├─ Database
│  ├─ MongoDB Atlas (Managed)
│  ├─ Backup & Replication
│  └─ Read replicas
├─ Cache Layer (Redis)
└─ Monitoring
   ├─ CloudWatch
   ├─ DataDog
   └─ PagerDuty
```

---

## 🔐 Security Layers

```
Frontend (React)
├─ Input validation
├─ XSS prevention
├─ CSRF tokens (future)
└─ Secure storage (localStorage)

Network
├─ HTTPS/TLS
├─ CORS whitelist
├─ Rate limiting
└─ DDoS protection (CloudFlare)

Backend (FastAPI)
├─ Input validation
├─ SQL injection prevention (ORM)
├─ JWT authentication
├─ Password hashing
├─ CORS configuration
├─ API key rotation
└─ Audit logging

Database (MongoDB)
├─ Encrypted at rest
├─ Encrypted in transit
├─ User authentication
├─ Role-based access
├─ Backup encryption
└─ Audit logs
```

---

## 📊 Performance Optimization

### Frontend
```
React
├─ Code splitting (React.lazy)
├─ Memoization (React.memo, useMemo)
├─ Virtual scrolling (large lists)
├─ Bundle optimization (Vite)
└─ Lazy loading

Styling
├─ Tailwind CSS purging
├─ CSS-in-JS optimization
└─ Image optimization

Caching
├─ HTTP caching headers
├─ LocalStorage for results
└─ Service Workers (future)
```

### Backend
```
FastAPI
├─ Async request handling
├─ Connection pooling (MongoDB)
├─ Caching (Redis)
├─ Compression (gzip)
└─ Query optimization

API Design
├─ Pagination for large results
├─ Streaming for large responses
└─ Efficient JSON serialization

Database
├─ Indexing
├─ Query optimization
├─ Aggregation pipelines
└─ Sharding (at scale)
```

---

## 🔄 Scaling Strategy

### Horizontal Scaling
```
Load Balancer
├─ Backend Instance 1
├─ Backend Instance 2
├─ Backend Instance 3
└─ Backend Instance N

Database Replication
├─ Primary MongoDB
├─ Secondary Replica 1
├─ Secondary Replica 2
└─ Secondary Replica N

Cache Distribution
├─ Redis Cluster Node 1
├─ Redis Cluster Node 2
└─ Redis Cluster Node N
```

### Vertical Scaling
```
Increase per instance:
├─ CPU cores
├─ Memory (RAM)
├─ Storage
└─ Network bandwidth
```

---

## 📡 Communication Protocols

### HTTP/REST
```
Client ↔ Server (stateless)
- GET /api/reviews/history
- POST /api/review
- PUT /api/projects/{id}
- DELETE /api/reviews/{id}
```

### Server-Sent Events (SSE)
```
Server → Client (one-way streaming)
- Real-time review results
- Live progress updates
- Notification streaming
```

### WebSocket (Future)
```
Client ↔ Server (bidirectional streaming)
- Real-time collaboration
- Live team reviews
- Chat messaging
```

---

## 🎯 Key Architecture Decisions

1. **React + TypeScript Frontend**
   - ✓ Type safety
   - ✓ Component reusability
   - ✓ State management with Zustand
   - ✓ Minimal bundle size

2. **FastAPI Backend**
   - ✓ Async/await native
   - ✓ Auto API documentation
   - ✓ Fast development
   - ✓ Built-in validation

3. **MongoDB**
   - ✓ Flexible schema (reviews have varying structure)
   - ✓ Scalability
   - ✓ JSON-native format
   - ✓ Managed service available

4. **Groq API**
   - ✓ Fast inference (gpt-oss-20b)
   - ✓ Streaming support
   - ✓ Cost-effective
   - ✓ No self-hosting required

5. **Docker Containerization**
   - ✓ Environment consistency
   - ✓ Easy deployment
   - ✓ Scaling with orchestration
   - ✓ Isolation and security

---

**This architecture is designed to be:**
- ✅ Scalable (horizontal & vertical)
- ✅ Maintainable (clear separation of concerns)
- ✅ Performant (async, caching, optimization)
- ✅ Secure (validation, auth, encryption)
- ✅ Extensible (plugin architecture ready)
