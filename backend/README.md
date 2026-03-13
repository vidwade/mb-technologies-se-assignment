# Backend API

FastAPI backend for the Todo Task application.

## Setup

```bash
cd backend

# Install dependencies directly with uv
uv pip install -r requirements.txt

# Set up environment (optional, defaults are pre-configured)
cp .env.example .env

# Run the application
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Using traditional pip (Alternative)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env

# Run the application
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Database**: PostgreSQL must be running with database `mb_assignment`

- Connection: `postgresql://postgres:123456@localhost:5432/mb_assignment`

## Testing

### With uv

```bash
uv run pytest                 # Run all tests
uv run pytest --cov=app      # With coverage
uv run pytest -v             # Verbose
```

### With traditional pip

```bash
pytest                        # Run all tests
pytest --cov=app             # With coverage
pytest -v                    # Verbose
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
