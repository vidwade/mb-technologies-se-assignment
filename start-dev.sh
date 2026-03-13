#!/bin/bash

tmux kill-session -t todo-app 2>/dev/null

tmux new-session -d -s todo-app -n "backend-server"
tmux send-keys -t todo-app:backend-server "cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" C-m

tmux new-window -t todo-app -n "backend-tests"
tmux send-keys -t todo-app:backend-tests "cd backend && sleep 5 && uv run pytest --cov=app -v" C-m

tmux new-window -t todo-app -n "frontend-server"
tmux send-keys -t todo-app:frontend-server "cd frontend && npm run dev" C-m

tmux new-window -t todo-app -n "frontend-tests"
tmux send-keys -t todo-app:frontend-tests "cd frontend && sleep 10 && npm test" C-m

tmux select-window -t todo-app:backend-server
tmux attach-session -t todo-app
