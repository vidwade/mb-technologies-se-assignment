#!/bin/bash

# Kill existing session if it exists
tmux kill-session -t todo-app 2>/dev/null

# Create new tmux session with first tab for backend server
tmux new-session -d -s todo-app -n "backend-server"
tmux send-keys -t todo-app:backend-server "cd backend" C-m
tmux send-keys -t todo-app:backend-server "echo '=== Backend Server ==='" C-m
tmux send-keys -t todo-app:backend-server "echo 'Installing dependencies...'" C-m
tmux send-keys -t todo-app:backend-server "uv pip install -r requirements.txt" C-m
tmux send-keys -t todo-app:backend-server "echo 'Starting backend server on http://localhost:8000'" C-m
tmux send-keys -t todo-app:backend-server "uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" C-m

# Create tab for backend tests
tmux new-window -t todo-app -n "backend-tests"
tmux send-keys -t todo-app:backend-tests "cd backend" C-m
tmux send-keys -t todo-app:backend-tests "echo '=== Backend Tests ==='" C-m
tmux send-keys -t todo-app:backend-tests "echo 'Waiting for dependencies...'" C-m
tmux send-keys -t todo-app:backend-tests "sleep 5" C-m
tmux send-keys -t todo-app:backend-tests "echo 'Running tests with coverage...'" C-m
tmux send-keys -t todo-app:backend-tests "uv run pytest --cov=app -v" C-m

# Create tab for frontend server
tmux new-window -t todo-app -n "frontend-server"
tmux send-keys -t todo-app:frontend-server "cd frontend" C-m
tmux send-keys -t todo-app:frontend-server "echo '=== Frontend Server ==='" C-m
tmux send-keys -t todo-app:frontend-server "echo 'Installing dependencies...'" C-m
tmux send-keys -t todo-app:frontend-server "npm install" C-m
tmux send-keys -t todo-app:frontend-server "echo 'Starting frontend dev server on http://localhost:3000'" C-m
tmux send-keys -t todo-app:frontend-server "npm run dev" C-m

# Create tab for frontend tests
tmux new-window -t todo-app -n "frontend-tests"
tmux send-keys -t todo-app:frontend-tests "cd frontend" C-m
tmux send-keys -t todo-app:frontend-tests "echo '=== Frontend Tests ==='" C-m
tmux send-keys -t todo-app:frontend-tests "echo 'Waiting for dependencies...'" C-m
tmux send-keys -t todo-app:frontend-tests "sleep 10" C-m
tmux send-keys -t todo-app:frontend-tests "echo 'Running tests...'" C-m
tmux send-keys -t todo-app:frontend-tests "npm test" C-m

# Select backend server tab by default
tmux select-window -t todo-app:backend-server

# Attach to session
tmux attach-session -t todo-app
