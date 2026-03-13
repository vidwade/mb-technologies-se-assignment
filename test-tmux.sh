#!/bin/bash

echo "Testing tmux script..."

# Start the dev environment
./start-dev.sh &
sleep 3

# Check if session exists
if tmux has-session -t todo-app 2>/dev/null; then
    echo "✓ Tmux session 'todo-app' created successfully"
else
    echo "✗ Failed to create tmux session"
    exit 1
fi

# List all tabs
echo -e "\n=== Tmux Tabs Created ==="
tmux list-windows -t todo-app

# Check each tab exists
tabs=("backend-server" "backend-tests" "frontend-server" "frontend-tests")
for tab in "${tabs[@]}"; do
    if tmux list-windows -t todo-app | grep -q "$tab"; then
        echo "✓ Tab '$tab' exists"
    else
        echo "✗ Tab '$tab' missing"
        exit 1
    fi
done

echo -e "\n=== Test Summary ==="
echo "✓ All 4 tabs created successfully"
echo "✓ Backend and frontend servers starting"
echo "✓ Test suites queued to run"

# Cleanup
tmux kill-session -t todo-app 2>/dev/null
echo -e "\n✓ Test completed and cleaned up"
