#!/bin/bash

# Stop script for dresumeV2 Docker development environment

set -e

echo "🛑 Stopping dresumeV2 Docker Development Environment..."

# Stop DFX replica gracefully
echo "🔧 Stopping DFX replica..."
docker-compose -f docker-compose.dfx.yml exec dfx bash -c "dfx stop" 2>/dev/null || true

# Stop and remove containers
echo "🐳 Stopping Docker containers..."
docker-compose -f docker-compose.dfx.yml down

echo "✅ Docker environment stopped successfully!"

# Optionally remove volumes (uncomment if needed)
# echo "🧹 Removing Docker volumes..."
# docker-compose -f docker-compose.dfx.yml down -v
