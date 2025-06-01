#!/bin/bash

# Quick start script for dresumeV2 Docker development environment

set -e

echo "🐳 Starting dresumeV2 Docker Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Build and start the container
echo "🔧 Building and starting Docker container..."
docker-compose -f docker-compose.dfx.yml up -d --build

# Wait for container to be ready
echo "⏳ Waiting for container to be ready..."
sleep 5

# Check if container is running
if docker-compose -f docker-compose.dfx.yml ps | grep -q "Up"; then
    echo "✅ Docker container is running!"
    echo ""
    echo "🔧 Available commands:"
    echo "- Access container shell: docker-compose -f docker-compose.dfx.yml exec dfx bash"
    echo "- Deploy canisters: ./scripts/deploy-docker.sh"
    echo "- Stop container: docker-compose -f docker-compose.dfx.yml down"
    echo "- View logs: docker-compose -f docker-compose.dfx.yml logs -f"
    echo ""
    echo "🌐 Ports:"
    echo "- DFX Replica: http://127.0.0.1:4943"
    echo "- Next.js Dev Server: http://127.0.0.1:3000"
else
    echo "❌ Failed to start Docker container"
    docker-compose -f docker-compose.dfx.yml logs
    exit 1
fi
