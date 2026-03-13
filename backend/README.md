# Backend API

FastAPI backend for the Todo Task application.

## Setup

### Using uv (Recommended)

1. Install dependencies:
```bash
cd backend
uv pip install -r requirements.txt
```

### Using pip (Alternative)

1. Create virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# The default DATABASE_URL is already configured for PostgreSQL
```

4. Make sure PostgreSQL is running and the database exists:
```bash
# Database: mb_assignment
# Default connection: postgresql://postgres:123456@localhost:5432/mb_assignment
```

5. Run the application:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Testing

Run tests with coverage:
```bash
pytest
```

## API Endpoints

- `GET /health` - Health check
- `GET /tasks/` - Get most recent incomplete tasks (default limit: 5)
- `POST /tasks/` - Create a new task
- `PATCH /tasks/{id}/complete` - Mark a task as completed

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI application
│   ├── config.py        # Configuration
│   ├── database.py      # Database connection
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── repository.py    # Data access layer
│   ├── service.py       # Business logic layer
│   └── routes.py        # API routes
├── tests/
│   ├── __init__.py
│   ├── conftest.py      # Test fixtures
│   ├── test_repository.py  # Unit tests
│   └── test_api.py      # Integration tests
└── requirements.txt
```
