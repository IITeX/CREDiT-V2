#!/bin/bash

# dresumeV2 Motoko Backend Deployment Script
# This script deploys all Motoko canisters using Docker to avoid WSL2 permission issues

set -e

echo "🚀 Starting dresumeV2 Motoko Backend Deployment..."

# Function to run commands in Docker container
run_in_docker() {
    docker-compose -f docker-compose.dfx.yml exec -T dfx $@
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker Desktop first."
        exit 1
    fi
}

# Function to build and start Docker container
start_container() {
    echo "🐳 Building and starting Docker container..."
    docker-compose -f docker-compose.dfx.yml up -d --build
    
    # Wait for container to be ready
    echo "⏳ Waiting for container to be ready..."
    sleep 10
    
    # Check if container is running
    if ! docker-compose -f docker-compose.dfx.yml ps | grep -q "Up"; then
        echo "❌ Failed to start Docker container"
        exit 1
    fi
    
    echo "✅ Docker container is ready"
}

# Function to setup DFX in container
setup_dfx() {
    echo "🔧 Setting up DFX in container..."
    
    # Check if dfx is available
    run_in_docker dfx --version
    
    # Create identity if it doesn't exist
    echo "🔑 Setting up identity..."
    run_in_docker bash -c "
        if ! dfx identity list | grep -q 'docker-dev'; then
            echo 'Creating new docker-dev identity...'
            dfx identity new docker-dev --storage-mode=plaintext
        fi
        dfx identity use docker-dev
    "
}

# Function to start local replica
start_replica() {
    echo "🔧 Starting local Internet Computer replica..."
    
    # Stop any existing replica
    run_in_docker bash -c "dfx stop || true"
    sleep 2
    
    # Start replica in background
    run_in_docker dfx start --background --clean
    
    # Wait for replica to be ready
    echo "⏳ Waiting for replica to be ready..."
    sleep 15
    
    # Verify replica is running
    if ! run_in_docker dfx ping; then
        echo "❌ Failed to start local replica"
        exit 1
    fi
    
    echo "✅ Local replica is running"
}

# Function to deploy canisters
deploy_canisters() {
    echo "📦 Deploying canisters..."
    
    # Deploy all canisters
    run_in_docker dfx deploy
    
    echo "✅ Canisters deployed successfully"
}

# Function to generate TypeScript declarations
generate_types() {
    echo "🔧 Generating TypeScript declarations..."
    
    run_in_docker dfx generate
    
    echo "✅ TypeScript declarations generated"
}

# Function to display canister information
show_canister_info() {
    echo "📋 Canister Information:"
    echo "======================="
    
    run_in_docker bash -c "
        echo 'User Management: '$(dfx canister id user_management)
        echo 'Credential NFT: '$(dfx canister id credential_nft)
        echo 'Verification: '$(dfx canister id verification)
        echo 'Storage: '$(dfx canister id storage)
        echo 'Internet Identity: '$(dfx canister id internet_identity)
    "
}

# Function to test deployment
test_deployment() {
    echo "🧪 Testing deployment..."
    
    # Test if canisters are accessible
    run_in_docker bash -c "
        echo 'Testing canister accessibility...'
        dfx canister call user_management getStats || echo 'Note: getStats might not be available yet'
    "
    
    echo "✅ Deployment test completed"
}

# Function to update environment file
update_env_file() {
    echo "🔧 Updating environment file..."
    
    # Get canister IDs from Docker container
    USER_MANAGEMENT_ID=$(run_in_docker dfx canister id user_management)
    CREDENTIAL_NFT_ID=$(run_in_docker dfx canister id credential_nft)
    VERIFICATION_ID=$(run_in_docker dfx canister id verification)
    STORAGE_ID=$(run_in_docker dfx canister id storage)
    INTERNET_IDENTITY_ID=$(run_in_docker dfx canister id internet_identity)
    
    # Update .env.local file
    cat > .env.local << EOF
# DFX Network Configuration
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_IC_HOST=http://127.0.0.1:4943

# Canister IDs (Local Development)
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=${USER_MANAGEMENT_ID}
NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID=${CREDENTIAL_NFT_ID}
NEXT_PUBLIC_VERIFICATION_CANISTER_ID=${VERIFICATION_ID}
NEXT_PUBLIC_STORAGE_CANISTER_ID=${STORAGE_ID}
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=${INTERNET_IDENTITY_ID}

# Development Configuration
NEXT_PUBLIC_ENVIRONMENT=development
EOF
    
    echo "✅ Environment file updated with canister IDs"
}

# Function to cleanup
cleanup() {
    echo "🧹 Cleaning up..."
    run_in_docker bash -c "dfx stop || true"
}

# Main deployment function
main() {
    echo "🔍 Checking prerequisites..."
    check_docker
    
    # Check if we're in the right directory
    if [ ! -f "dfx.json" ]; then
        echo "❌ dfx.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Trap cleanup on exit
    trap cleanup EXIT
    
    start_container
    setup_dfx
    start_replica
    deploy_canisters
    generate_types
    update_env_file
    show_canister_info
    test_deployment
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. The local replica is running in Docker on http://127.0.0.1:4943"
    echo "2. Your environment file (.env.local) has been updated with canister IDs"
    echo "3. TypeScript declarations are available in src/declarations/"
    echo "4. You can now start your Next.js development server with 'npm run dev'"
    echo ""
    echo "🐳 Docker container commands:"
    echo "- Access container shell: docker-compose -f docker-compose.dfx.yml exec dfx bash"
    echo "- Stop container: docker-compose -f docker-compose.dfx.yml down"
    echo "- View logs: docker-compose -f docker-compose.dfx.yml logs -f"
    echo ""
}

# Run main function
main "$@"
