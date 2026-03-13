#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"
FRONTEND_DIR="${ROOT_DIR}/frontend"

log() {
  printf "\n[setup] %s\n" "$1"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    printf "[setup] Missing required command: %s\n" "$1" >&2
    exit 1
  fi
}

log "Checking Linux environment"
if [[ "$(uname -s)" != "Linux" ]]; then
  printf "[setup] Warning: this script is optimized for Linux, current OS is %s\n" "$(uname -s)"
fi

require_cmd bash
require_cmd git
require_cmd python3
require_cmd node
require_cmd npm
require_cmd curl

if ! command -v uv >/dev/null 2>&1; then
  log "Installing uv"
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="${HOME}/.local/bin:${PATH}"
fi

log "Preparing backend environment"
if [[ ! -f "${BACKEND_DIR}/.env" && -f "${BACKEND_DIR}/.env.example" ]]; then
  cp "${BACKEND_DIR}/.env.example" "${BACKEND_DIR}/.env"
fi

log "Syncing backend dependencies with uv"
uv sync --project "${BACKEND_DIR}"

if command -v psql >/dev/null 2>&1; then
  log "Ensuring PostgreSQL database exists"
  PGPASSWORD=123456 psql -h localhost -U postgres -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='mb_assignment';" | grep -q 1 || \
    PGPASSWORD=123456 psql -h localhost -U postgres -d postgres -c "CREATE DATABASE mb_assignment;" || true
else
  log "Skipping database creation (psql not found)"
fi

log "Installing frontend dependencies"
npm install --prefix "${FRONTEND_DIR}"

log "Generating OpenAPI and Zod client"
npm run --prefix "${FRONTEND_DIR}" generate:api

if command -v uvx >/dev/null 2>&1; then
  log "Installing pre-commit hooks"
  (cd "${ROOT_DIR}" && uvx pre-commit install)
fi

log "Running verification checks"
(cd "${ROOT_DIR}" && uvx pre-commit run --all-files)
(cd "${FRONTEND_DIR}" && npm run build)

log "Setup complete"
printf "[setup] Start development with: ./start-dev.sh\n"
