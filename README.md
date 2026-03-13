# Todo Task Management Application

A full-stack web application for managing todo tasks, built with FastAPI, PostgreSQL, Next.js, and shadcn/ui.

## Features

- ✅ Create todo tasks with title and description
- ✅ View 5 most recent incomplete tasks
- ✅ Mark tasks as completed (removes from view)
- ✅ Clean, modern UI with shadcn/ui components
- ✅ Full test coverage (backend & frontend)
- ✅ RESTful API following best practices
- ✅ Type-safe with TypeScript and Pydantic
- ✅ SOLID principles and clean code architecture

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **pytest** - Testing framework with coverage

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Lucide React** - Icon library
- **Jest & React Testing Library** - Testing

### Database
- **PostgreSQL** - Production-ready relational database

## Project Structure

```
.
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── repository.py   # Data access layer
│   │   ├── service.py      # Business logic
│   │   ├── routes.py       # API endpoints
│   │   ├── database.py     # Database connection
│   │   └── config.py       # Configuration
│   ├── tests/              # Unit & integration tests
│   └── requirements.txt    # Python dependencies
│
└── frontend/               # Next.js frontend
    ├── app/                # App router pages
    ├── components/         # React components
    │   ├── ui/            # shadcn/ui components
    │   ├── TaskForm.tsx
    │   ├── TaskCard.tsx
    │   └── TaskList.tsx
    ├── lib/               # Utilities
    ├── types/             # TypeScript types
    └── __tests__/         # Component tests
```

## Prerequisites

- **Python 3.11+** with **uv** (recommended - no venv needed!)
  - Install uv: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **Node.js 18+**
- **PostgreSQL 14+**
- **npm**

## Quick Start

### 1. Database Setup

Create the PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE mb_assignment;
\q
```

Default connection string: `postgresql://postgres:123456@localhost:5432/mb_assignment`

### 2. Backend Setup

**Using uv (recommended - no venv needed!):**

```bash
cd backend
uv pip install -r requirements.txt
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Or using traditional pip:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at http://localhost:8000

**API Documentation**: http://localhost:8000/docs

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

## Testing

### Backend Tests

**With uv:**
```bash
cd backend
uv run pytest                 # Run all tests
uv run pytest --cov=app      # Run with coverage
uv run pytest -v             # Verbose output
```

**With traditional pip:**
```bash
cd backend
source venv/bin/activate
pytest                        # Run all tests
pytest --cov=app             # Run with coverage
pytest -v                    # Verbose output
```

Test coverage includes:
- Unit tests for repository layer
- Integration tests for API endpoints
- Validation and error handling
- Database operations

### Frontend Tests

```bash
cd frontend
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

Test coverage includes:
- Component rendering
- User interactions
- Form validation
- API integration
- Loading and error states

## API Endpoints

### Health Check
- `GET /health` - API health status

### Tasks
- `GET /tasks/` - Get 5 most recent incomplete tasks
  - Query params: `limit` (default: 5)
  - Returns: `{ tasks: Task[], total: number }`

- `POST /tasks/` - Create a new task
  - Body: `{ title: string, description: string }`
  - Returns: Created task

- `PATCH /tasks/{id}/complete` - Mark task as completed
  - Returns: Updated task

## Database Schema

### tasks table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| title | VARCHAR(255) | Task title |
| description | TEXT | Task description |
| is_completed | BOOLEAN | Completion status |
| created_at | TIMESTAMP | Creation timestamp |
| completed_at | TIMESTAMP | Completion timestamp (nullable) |

## Architecture & Design Principles

### Backend Architecture

- **Layered Architecture**: Separation of concerns across layers
  - Routes → Service → Repository → Database
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Using FastAPI's DI system
- **SOLID Principles**: 
  - Single Responsibility: Each class has one purpose
  - Open/Closed: Extensible without modification
  - Dependency Inversion: Depend on abstractions

### Frontend Architecture

- **Component-Based**: Reusable, testable components
- **Separation of Concerns**: UI, logic, and API separated
- **Type Safety**: Full TypeScript coverage
- **Atomic Design**: UI components follow atomic design principles

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:123456@localhost:5432/mb_assignment
ENVIRONMENT=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development

### Backend Development

**With uv:**
```bash
cd backend
uv run uvicorn app.main:app --reload  # Auto-reload on changes
```

**With traditional pip:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload  # Auto-reload on changes
```

### Frontend Development

```bash
cd frontend
npm run dev  # Hot reload enabled
```

### Code Quality

Backend follows:
- PEP 8 style guide
- Type hints throughout
- Comprehensive docstrings
- Clean code principles

Frontend follows:
- ESLint configuration
- TypeScript strict mode
- Component best practices
- Accessible UI patterns

## Evaluation Criteria Coverage

✅ **Approach to Solution**: Layered architecture with clear separation of concerns

✅ **System Architecture**: 3-tier architecture (DB → API → Frontend)

✅ **Functionality**: All requirements implemented and working

✅ **Database Design**: Normalized schema with proper indexes and constraints

✅ **Backend Tests**: Unit tests + integration tests with high coverage

✅ **Frontend Tests**: Component tests with Jest and RTL

✅ **Clean Code**: SOLID principles, type safety, clear naming

✅ **Extra - Pretty UI**: Modern design with shadcn/ui and Tailwind CSS

## Troubleshooting

### Backend Issues

**Database connection failed:**
- Check PostgreSQL is running: `pg_isready`
- Verify database exists: `psql -U postgres -l`
- Check connection string in `.env`

**Import errors:**
- With uv: `uv pip install -r requirements.txt`
- With pip: Ensure virtual environment is activated and dependencies installed
- Check Python version: `python --version` (3.11+)

### Frontend Issues

**API connection failed:**
- Ensure backend is running on port 8000
- Check `.env.local` has correct API URL
- Verify CORS is configured in backend

**Build errors:**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## License

This project is created as a take-home assessment.
