<div align="center">

# 🧠 ZeroMind

### *Zero Cost. Multiple Minds. Infinite Possibilities.*

**A Multi-Agent AI Platform for Autonomous Task Execution**

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Gemini](https://img.shields.io/badge/Gemini_2.0-Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br>

<img src="docs/assets/zeromind-banner.png" alt="ZeroMind Banner" width="800">

<br>

[🚀 Live Demo](https://zeromind.vercel.app) · [📖 Documentation](docs/) · [🐛 Report Bug](https://github.com/ayush-05-ad/zeromind/issues) · [💡 Request Feature](https://github.com/ayush-05-ad/zeromind/issues)

</div>

---

## 🤔 What is ZeroMind?

**ZeroMind** is a multi-agent AI platform where **multiple specialized AI agents collaborate autonomously** to complete complex tasks — just like a real team of experts working together.

Instead of one AI doing everything, ZeroMind deploys a **team of 6 specialized agents** that communicate, delegate, and build upon each other's work in **real-time**:

```
User: "Research top 5 budget smartphones under ₹20K and create a comparison report"

🎯 Orchestrator → Breaks task into subtasks
🔍 Researcher   → Searches web, gathers specs & prices
📊 Analyzer     → Compares features, ranks options
✍️ Writer       → Creates structured comparison report
✅ Reviewer     → Checks accuracy & formatting
📄 Final Output → Delivered to user in real-time
```

> **The best part?** The entire platform runs on **100% free AI models** — zero cost, zero paid APIs.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 Multi-Agent System
- **6 Specialized Agents** — Orchestrator, Researcher, Coder, Analyzer, Writer, Reviewer
- **Autonomous Collaboration** — Agents communicate via structured message protocol
- **Smart Task Decomposition** — Complex tasks auto-broken into subtasks
- **Tool Integration** — Web search, code execution, file parsing, data analysis

</td>
<td width="50%">

### 🎯 Supported Task Types
- 🔍 **Research & Reports** — Web research with structured output
- 💻 **Code Generation** — Write, debug, and optimize code
- 📊 **Data Analysis** — CSV analysis, comparisons, trend detection
- ✍️ **Content Creation** — Emails, articles, summaries
- 🧩 **Multi-step Complex** — Chain multiple task types together

</td>
</tr>
<tr>
<td width="50%">

### 🖥️ Real-Time Dashboard
- **Live Agent Visualization** — Watch agents collaborate in real-time
- **Agent Timeline** — Step-by-step execution tracking
- **Inter-Agent Messages** — See how agents communicate
- **Task Progress** — Live progress percentage updates

</td>
<td width="50%">

### 🔒 Enterprise-Grade Backend
- **JWT + OAuth2 Authentication** — Secure login with Google
- **Role-Based Access** — User and Admin roles
- **Rate Limiting & Caching** — Smart API management with Redis
- **WebSocket** — Real-time bi-directional communication

</td>
</tr>
</table>

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│         React.js + Tailwind CSS + Socket.io Client           │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐  │
│  │  Login/   │ │Dashboard │ │ Task View │ │ Admin Panel  │  │
│  │ Register  │ │          │ │ + Agents  │ │ + Analytics  │  │
│  └──────────┘ └──────────┘ └───────────┘ └──────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API + WebSocket
┌──────────────────────────▼──────────────────────────────────┐
│                       API LAYER                              │
│              FastAPI + Socket.io Server                       │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐  │
│  │Auth APIs │ │Task APIs │ │ WebSocket │ │ Admin APIs   │  │
│  │JWT+OAuth │ │  CRUD    │ │  Events   │ │   Stats      │  │
│  └──────────┘ └──────────┘ └───────────┘ └──────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     AGENT LAYER (Core)                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              🎯 ORCHESTRATOR AGENT                   │    │
│  │         Task Decomposition + Coordination            │    │
│  └──────┬──────┬──────┬──────┬──────┬──────────────────┘    │
│         │      │      │      │      │                        │
│  ┌──────▼┐ ┌──▼───┐ ┌▼─────┐ ┌▼────┐ ┌▼───────┐           │
│  │🔍     │ │💻    │ │📊    │ │✍️   │ │✅      │           │
│  │Research│ │Coder │ │Analyz│ │Writer│ │Reviewer│           │
│  │Agent  │ │Agent │ │Agent │ │Agent │ │Agent   │           │
│  └───┬───┘ └──┬───┘ └──┬───┘ └──┬──┘ └───┬────┘           │
│      │        │        │        │        │                   │
│  ┌───▼────────▼────────▼────────▼────────▼──────────────┐   │
│  │              🔧 TOOL REGISTRY                         │   │
│  │  Web Search │ URL Scraper │ Code Executor │ File      │   │
│  │  (DuckDuck) │ (httpx+BS4) │ (Subprocess)  │ Parser   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         🧠 LLM ROUTER (Smart Routing)                │   │
│  │  Gemini 2.0 Flash (primary) → Groq Llama (fallback)  │   │
│  │  + Rate Limiting + Response Caching + Auto-failover   │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌──────────────┐  ┌──────────┐  ┌───────────────────────┐  │
│  │ PostgreSQL   │  │  Redis   │  │    ChromaDB           │  │
│  │ Users, Tasks │  │ Cache,   │  │ Vector Embeddings     │  │
│  │ Agent Steps  │  │ Sessions │  │ (Document RAG)        │  │
│  │ Messages     │  │ Rate Lim │  │                       │  │
│  └──────────────┘  └──────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🆓 Free AI Models (Zero Cost Stack)

| Model | Role | Free Limits | Why We Use It |
|-------|------|-------------|---------------|
| **Google Gemini 2.0 Flash** | Primary LLM | 1,500 req/day, 15 RPM, 1M context | Fast, free, huge context window |
| **Groq (Llama 3.3 70B)** | Fallback LLM | 30 RPM, 14.4K tokens/min | Ultra-fast inference, free tier |
| **HuggingFace** | Embeddings | 1,000 req/day | Free sentence embeddings |
| **DuckDuckGo** | Web Search | Unlimited | No API key needed |
| **ChromaDB** | Vector DB | Unlimited (local) | Open-source, runs locally |

> **Smart Rate Limiting:** Agent queuing (max 1 LLM call/4s) + response caching (Redis) + auto-failover (Gemini → Groq) ensures smooth operation within free limits.

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br>React 18
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br>Tailwind
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=python" width="48" height="48" alt="Python" />
<br>Python 3.11
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=fastapi" width="48" height="48" alt="FastAPI" />
<br>FastAPI
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=postgres" width="48" height="48" alt="PostgreSQL" />
<br>PostgreSQL
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=redis" width="48" height="48" alt="Redis" />
<br>Redis
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=docker" width="48" height="48" alt="Docker" />
<br>Docker
</td>
</tr>
</table>

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Tailwind CSS, Socket.io Client, Recharts, React Router |
| **Backend** | FastAPI, Python-SocketIO, SQLAlchemy, Pydantic, Alembic |
| **AI/Agents** | Google Gemini API, Groq API, Custom Agent Framework, LLM Router |
| **Agent Tools** | DuckDuckGo Search, BeautifulSoup, Subprocess (code exec), Pandas |
| **Database** | PostgreSQL (primary), Redis (cache/sessions), ChromaDB (vectors) |
| **Auth** | JWT (PyJWT), Google OAuth2, bcrypt, Role-based access control |
| **DevOps** | Docker Compose, GitHub Actions CI/CD, Render, Vercel |

---

## 📁 Project Structure

```
zeromind/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI entry point
│   │   ├── config.py               # Environment configuration
│   │   ├── database.py             # SQLAlchemy connection
│   │   ├── agents/                 # 🧠 Core Agent System
│   │   │   ├── base_agent.py       # Abstract base agent
│   │   │   ├── orchestrator.py     # Task planner + coordinator
│   │   │   ├── researcher.py       # Web search + data gathering
│   │   │   ├── coder.py            # Code generation + debugging
│   │   │   ├── analyzer.py         # Data analysis + comparison
│   │   │   ├── writer.py           # Content creation + formatting
│   │   │   ├── reviewer.py         # Quality check + verification
│   │   │   ├── agent_registry.py   # Registry of all agents
│   │   │   └── message_bus.py      # Inter-agent communication
│   │   ├── llm/                    # 🤖 LLM Integration
│   │   │   ├── gemini_client.py    # Google Gemini API wrapper
│   │   │   ├── groq_client.py      # Groq API wrapper (fallback)
│   │   │   └── llm_router.py       # Smart routing + rate limiting
│   │   ├── tools/                  # 🔧 Agent Tools
│   │   │   ├── web_search.py       # DuckDuckGo search
│   │   │   ├── url_scraper.py      # Web content extraction
│   │   │   ├── code_executor.py    # Safe code execution
│   │   │   └── file_parser.py      # PDF, DOCX, CSV parsing
│   │   ├── routers/                # 🛣️ API Routes
│   │   │   ├── auth.py             # Authentication endpoints
│   │   │   ├── tasks.py            # Task CRUD endpoints
│   │   │   ├── admin.py            # Admin dashboard APIs
│   │   │   └── websocket.py        # WebSocket event handler
│   │   ├── models/                 # 📦 Database Models
│   │   ├── schemas/                # 📋 Pydantic Schemas
│   │   ├── services/               # ⚙️ Business Logic
│   │   └── middleware/             # 🛡️ Auth + Rate Limiting
│   ├── requirements.txt
│   ├── Dockerfile
│   └── alembic/                    # DB Migrations
├── frontend/
│   ├── src/
│   │   ├── pages/                  # Login, Dashboard, TaskView, Admin
│   │   ├── components/
│   │   │   ├── chat/               # ChatWindow, MessageBubble
│   │   │   ├── agents/             # AgentFlow, AgentCard, AgentTimeline
│   │   │   └── tasks/              # TaskCard, TaskList, TaskOutput
│   │   ├── hooks/                  # useAuth, useSocket, useTasks
│   │   ├── services/               # API client, Socket.io client
│   │   └── context/                # Auth context
│   ├── tailwind.config.js
│   └── package.json
├── docker-compose.yml              # Full stack: backend + postgres + redis
├── docs/                           # Architecture diagrams, API docs
├── README.md
├── LICENSE
└── .gitignore
```

---

## ⚡ Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Google Gemini API Key ([Get Free Key](https://aistudio.google.com/apikey))
- Groq API Key ([Get Free Key](https://console.groq.com)) *(optional, for fallback)*

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ayush-05-ad/zeromind.git
cd zeromind
```

### 2️⃣ Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your free API keys:

```env
# LLM APIs (FREE)
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here          # optional fallback

# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/zeromind
REDIS_URL=redis://redis:6379/0

# Auth
JWT_SECRET_KEY=your_super_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GOOGLE_CLIENT_ID=your_google_client_id        # for OAuth2
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

### 3️⃣ Run with Docker (Recommended)

```bash
docker-compose up --build
```

This starts:
- 🐍 **Backend** → `http://localhost:8000`
- ⚛️ **Frontend** → `http://localhost:5173`
- 🐘 **PostgreSQL** → `localhost:5432`
- 🔴 **Redis** → `localhost:6379`

### 4️⃣ Run Without Docker (Manual Setup)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head              # Run DB migrations
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 5️⃣ Open the App

Visit `http://localhost:5173` — Register, login, and start giving tasks to your AI agent team! 🎉

---

## 🎮 Usage Examples

### Research Task
```
Input:  "Research the latest AI trends in 2026 and create a summary report"
Agents: Orchestrator → Researcher → Analyzer → Writer → Reviewer
Output: Structured markdown report with sources
```

### Code Generation
```
Input:  "Write a Python FastAPI endpoint for user authentication with JWT"
Agents: Orchestrator → Coder → Reviewer
Output: Working Python code with comments and best practices
```

### Data Analysis
```
Input:  "Analyze this CSV file and find the top-selling products by region"
Agents: Orchestrator → Analyzer → Writer → Reviewer
Output: Analysis with insights, charts description, and recommendations
```

### Content Creation
```
Input:  "Draft a professional email to a client about project delay"
Agents: Orchestrator → Writer → Reviewer
Output: Polished email with appropriate tone and structure
```

---

## 📊 API Documentation

Once the backend is running, visit:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login (returns JWT) |
| `POST` | `/api/tasks` | Create new task (triggers agents) |
| `GET` | `/api/tasks` | List all user tasks |
| `GET` | `/api/tasks/{id}` | Task details + agent steps |
| `GET` | `/api/tasks/{id}/steps` | Agent execution steps |
| `WS` | `/ws/{task_id}` | Real-time agent updates |

---

## 🧪 Running Tests

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm run test
```

---

## 🚀 Deployment (Free)

| Service | Platform | Free Tier |
|---------|----------|-----------|
| Frontend | [Vercel](https://vercel.com) | Unlimited deploys, 100 GB bandwidth |
| Backend | [Render](https://render.com) | 750 hours/month |
| Database | [Supabase](https://supabase.com) | 500 MB PostgreSQL |
| Cache | [Upstash](https://upstash.com) | 10K commands/day Redis |
| LLM | [Google AI Studio](https://aistudio.google.com) | 1,500 req/day Gemini |

---

## 👥 Team

| Name | Role | Responsibilities |
|------|------|-----------------|
| **Ayush** | Project Lead + AI Engineer | Agent system, LLM integration, tool development |
| **Sneha Kumari** | Frontend Developer | React dashboard, agent visualization, WebSocket UI |
| **Annu Priya** | Backend Developer | FastAPI APIs, authentication, WebSocket handler |
| **Nikhil Kumar** | DevOps + DB Engineer | PostgreSQL, Redis, Docker, deployment, CI/CD |

---

## 🗺️ Roadmap

- [x] Project architecture & planning
- [ ] Core agent framework (base agent, message bus)
- [ ] All 6 agents (Orchestrator, Researcher, Coder, Analyzer, Writer, Reviewer)
- [ ] LLM integration with smart routing & caching
- [ ] Agent tools (web search, code executor, scraper, file parser)
- [ ] FastAPI backend with auth + task APIs
- [ ] React frontend with real-time agent dashboard
- [ ] WebSocket integration for live updates
- [ ] Docker setup + free cloud deployment
- [ ] Documentation + project report

---

## 🤝 Contributing

This is a final year B.Tech project. Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev) — Free LLM API
- [Groq](https://groq.com) — Ultra-fast free inference
- [FastAPI](https://fastapi.tiangolo.com) — Modern Python web framework
- [React](https://react.dev) — UI library
- [DuckDuckGo](https://duckduckgo.com) — Free search API

---

<div align="center">

**Built with ❤️ by Team ZeroMind | GEC Vaishali | B.Tech CSE (IoT) 2026**

*Zero Cost. Multiple Minds. Infinite Possibilities.*

⭐ Star this repo if you found it helpful!

</div>
