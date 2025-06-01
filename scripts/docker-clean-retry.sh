#!/bin/bash

# Clean up Docker and retry setup for dresumeV2

set -e

echo "🧹 Cleaning up Docker environment..."

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.dfx.yml down 2>/dev/null || true

# Remove the container if it exists
echo "🗑️ Removing existing container..."
docker rm -f dresumeV2-dfx 2>/dev/null || true

# Remove the image to force rebuild
echo "🔄 Removing existing image..."
docker rmi dresumeV2-dfx 2>/dev/null || true

# Clean up Docker system
echo "🧽 Cleaning Docker system..."
docker system prune -f

# Check Docker status
echo "🔍 Checking Docker status..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker cleanup completed!"

# Try to build with the slim dockerfile if the main one fails
echo "🐳 Attempting to build with main Dockerfile..."
if ! docker-compose -f docker-compose.dfx.yml build; then
    echo "⚠️ Main Dockerfile failed, trying slim version..."
    
    # Update docker-compose to use slim dockerfile
    sed -i 's/dockerfile: Dockerfile.dfx/dockerfile: Dockerfile.dfx.slim/' docker-compose.dfx.yml
    
    echo "🔄 Building with slim Dockerfile..."
    docker-compose -f docker-compose.dfx.yml build
    
    # Restore original dockerfile reference
    sed -i 's/dockerfile: Dockerfile.dfx.slim/dockerfile: Dockerfile.dfx/' docker-compose.dfx.yml
fi

# Start the container
echo "🚀 Starting Docker container..."
docker-compose -f docker-compose.dfx.yml up -d

# Wait and check if container is running
echo "⏳ Waiting for container to be ready..."
sleep 5

if docker-compose -f docker-compose.dfx.yml ps | grep -q "Up"; then
    echo "✅ Docker container is running!"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Deploy canisters: ./scripts/deploy-docker.sh"
    echo "2. Access container: docker-compose -f docker-compose.dfx.yml exec dfx bash"
    echo "3. View logs: docker-compose -f docker-compose.dfx.yml logs -f"
else
    echo "❌ Failed to start Docker container"
    echo "📋 Container logs:"
    docker-compose -f docker-compose.dfx.yml logs
    exit 1
fi
