#!/bin/bash

# dResume Deployment Script
# This script deploys all Motoko canisters for the dResume platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║                           dResume Deployment                         ║"
    echo "║                    Blockchain Credential Platform                    ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Check if dfx is installed
check_dfx() {
    if ! command -v dfx &> /dev/null; then
        print_error "DFX is not installed. Please install it first:"
        echo "sh -ci \"\$(curl -fsSL https://internetcomputer.org/install.sh)\""
        exit 1
    fi
    print_success "DFX is installed"
}

# Check if we're in the right directory
check_directory() {
    if [ ! -f "dfx.json" ]; then
        print_error "dfx.json not found. Please run this script from the project root."
        exit 1
    fi
    print_success "Found dfx.json"
}

# Get network parameter
NETWORK=${1:-local}

print_header

print_info "Deploying to network: $NETWORK"
print_info "Starting deployment process..."

# Check prerequisites
check_dfx
check_directory

# Start local replica if deploying locally
if [ "$NETWORK" = "local" ]; then
    print_info "Checking local replica status..."
    
    if ! dfx ping &> /dev/null; then
        print_info "Starting local Internet Computer replica..."
        dfx start --background --clean
        sleep 5
        
        # Wait for replica to be ready
        print_info "Waiting for replica to be ready..."
        timeout=60
        while [ $timeout -gt 0 ]; do
            if dfx ping &> /dev/null; then
                break
            fi
            sleep 2
            timeout=$((timeout-2))
        done
        
        if [ $timeout -le 0 ]; then
            print_error "Timeout waiting for replica to start"
            exit 1
        fi
        
        print_success "Local replica is running"
    else
        print_success "Local replica is already running"
    fi
fi

# Deploy Internet Identity first (for local development)
if [ "$NETWORK" = "local" ]; then
    print_info "Deploying Internet Identity..."
    dfx deploy internet_identity --network $NETWORK
    print_success "Internet Identity deployed"
fi

# Deploy backend canisters
print_info "Deploying backend canisters..."

print_info "Deploying User Management canister..."
dfx deploy user_management --network $NETWORK
print_success "User Management canister deployed"

print_info "Deploying Storage canister..."
dfx deploy storage --network $NETWORK
print_success "Storage canister deployed"

print_info "Deploying Verification canister..."
dfx deploy verification --network $NETWORK
print_success "Verification canister deployed"

print_info "Deploying Credential NFT canister..."
dfx deploy credential_nft --network $NETWORK
print_success "Credential NFT canister deployed"

# Generate declarations
print_info "Generating TypeScript declarations..."
dfx generate --network $NETWORK
print_success "TypeScript declarations generated"

# Create .env.local file with canister IDs
print_info "Creating environment configuration..."

ENV_FILE=".env.local"

cat > $ENV_FILE << EOF
# Generated by deploy.sh on $(date)
# dResume Motoko Backend Configuration

# Network Configuration
NEXT_PUBLIC_DFX_NETWORK="$NETWORK"
EOF

if [ "$NETWORK" = "local" ]; then
    cat >> $ENV_FILE << EOF
NEXT_PUBLIC_IC_HOST="http://localhost:4943"
EOF
else
    cat >> $ENV_FILE << EOF
NEXT_PUBLIC_IC_HOST="https://ic0.app"
EOF
fi

cat >> $ENV_FILE << EOF

# Canister IDs
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID="$(dfx canister id user_management --network $NETWORK)"
NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID="$(dfx canister id credential_nft --network $NETWORK)"
NEXT_PUBLIC_VERIFICATION_CANISTER_ID="$(dfx canister id verification --network $NETWORK)"
NEXT_PUBLIC_STORAGE_CANISTER_ID="$(dfx canister id storage --network $NETWORK)"

# Internet Identity Canister
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID="$(dfx canister id internet_identity --network $NETWORK)"

# Application Configuration
NEXT_PUBLIC_APP_NAME="dResume"
NEXT_PUBLIC_APP_URL="https://dresume.app"

# Testing Configuration
# Use this Principal ID for testing verified organization features
NEXT_PUBLIC_TEST_ORGANIZATION_PRINCIPAL="$(dfx identity get-principal)"
EOF

print_success "Environment configuration created: $ENV_FILE"

# Display canister URLs for local development
if [ "$NETWORK" = "local" ]; then
    print_info "Local development URLs:"
    echo ""
    echo "🌐 Internet Identity: http://localhost:4943/?canisterId=$(dfx canister id internet_identity --network $NETWORK)"
    echo "🔧 User Management: http://localhost:4943/?canisterId=$(dfx canister id user_management --network $NETWORK)"
    echo "🏆 Credential NFT: http://localhost:4943/?canisterId=$(dfx canister id credential_nft --network $NETWORK)"
    echo "✅ Verification: http://localhost:4943/?canisterId=$(dfx canister id verification --network $NETWORK)"
    echo "📁 Storage: http://localhost:4943/?canisterId=$(dfx canister id storage --network $NETWORK)"
    echo ""
fi

# Setup initial admin (for local development)
if [ "$NETWORK" = "local" ]; then
    print_info "Setting up initial admin user..."
    
    # Get current principal
    CURRENT_PRINCIPAL=$(dfx identity get-principal)
    
    # Add current user as admin
    dfx canister call user_management addAdmin "(principal \"$CURRENT_PRINCIPAL\")" --network $NETWORK
    
    print_success "Added $CURRENT_PRINCIPAL as admin"
fi

# Print summary
echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
print_info "Summary:"
echo "  Network: $NETWORK"
echo "  User Management: $(dfx canister id user_management --network $NETWORK)"
echo "  Credential NFT: $(dfx canister id credential_nft --network $NETWORK)"  
echo "  Verification: $(dfx canister id verification --network $NETWORK)"
echo "  Storage: $(dfx canister id storage --network $NETWORK)"
echo "  Internet Identity: $(dfx canister id internet_identity --network $NETWORK)"
echo ""
print_info "Next steps:"
echo "  1. Install frontend dependencies: npm install"
echo "  2. Start the development server: npm run dev"
echo "  3. Open your browser to: http://localhost:3000"
echo ""
print_info "For testing, use the verification guide: ./scripts/test-verification.sh"
print_info "For troubleshooting, check: ./scripts/verify-setup.sh"
