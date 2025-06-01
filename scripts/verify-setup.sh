#!/bin/bash

# dResume Setup Verification Script
# This script verifies that all components are properly set up

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ((ERRORS++))
    fi
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║                    dResume Setup Verification                       ║"
    echo "║                 Checking System Requirements                        ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

ERRORS=0

print_header

echo ""
echo "🔧 Checking System Requirements..."
echo ""

# Check DFX installation
if command -v dfx &> /dev/null; then
    DFX_VERSION=$(dfx --version 2>/dev/null | head -n1)
    print_status 0 "DFX is installed: $DFX_VERSION"
else
    print_status 1 "DFX is not installed"
    print_info "Install with: sh -ci \"\$(curl -fsSL https://internetcomputer.org/install.sh)\""
fi

# Check Node.js installation
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status 0 "Node.js is installed: $NODE_VERSION"
else
    print_status 1 "Node.js is not installed"
fi

# Check npm installation
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status 0 "npm is installed: $NPM_VERSION"
else
    print_status 1 "npm is not installed"
fi

echo ""
echo "📁 Checking Project Structure..."
echo ""

# Check if we're in the right directory
if [ -f "dfx.json" ]; then
    print_status 0 "dfx.json found"
else
    print_status 1 "dfx.json not found - are you in the project root?"
fi

if [ -f "package.json" ]; then
    print_status 0 "package.json found"
else
    print_status 1 "package.json not found"
fi

if [ -f "next.config.mjs" ]; then
    print_status 0 "next.config.mjs found"
else
    print_status 1 "next.config.mjs not found"
fi

# Check environment file
if [ -f ".env.local" ]; then
    print_status 0 ".env.local found"
    print_info "Environment configuration is set up"
else
    print_warning ".env.local not found"
    print_info "This will be created automatically during deployment"
fi

# Check Motoko backend files
echo ""
echo "🏗️  Checking Backend Structure..."
echo ""

BACKEND_DIRS=("src/backend/user_management" "src/backend/credential_nft" "src/backend/verification" "src/backend/storage" "src/backend/types")

for dir in "${BACKEND_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_status 0 "$dir directory exists"
    else
        print_status 1 "$dir directory not found"
    fi
done

# Check main Motoko files
MOTOKO_FILES=("src/backend/user_management/main.mo" "src/backend/credential_nft/main.mo" "src/backend/verification/main.mo" "src/backend/storage/main.mo" "src/backend/types/types.mo")

for file in "${MOTOKO_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$file exists"
    else
        print_status 1 "$file not found"
    fi
done

echo ""
echo "🎯 Checking Frontend Structure..."
echo ""

# Check frontend directories
FRONTEND_DIRS=("app" "components" "contexts" "hooks" "lib")

for dir in "${FRONTEND_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_status 0 "$dir directory exists"
    else
        print_status 1 "$dir directory not found"
    fi
done

# Check key frontend files
FRONTEND_FILES=("app/layout.tsx" "app/page.tsx" "contexts/auth-context.tsx" "hooks/useIC.ts" "lib/auth.ts")

for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$file exists"
    else
        print_status 1 "$file not found"
    fi
done

echo ""
echo "🚀 Checking Deployment Scripts..."
echo ""

# Check scripts
SCRIPTS=("scripts/deploy.sh" "scripts/test-verification.sh")

for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        print_status 0 "$script exists"
        if [ -x "$script" ]; then
            print_status 0 "$script is executable"
        else
            print_status 1 "$script is not executable"
            print_info "Run: chmod +x $script"
        fi
    else
        print_status 1 "$script not found"
    fi
done

echo ""
echo "🔌 Checking DFX Status..."
echo ""

# Check if DFX is running
if dfx ping &> /dev/null; then
    print_status 0 "DFX replica is running"
    
    # Check deployed canisters
    if dfx canister status user_management &> /dev/null; then
        print_status 0 "user_management canister is deployed"
    else
        print_warning "user_management canister not deployed"
    fi
    
    if dfx canister status credential_nft &> /dev/null; then
        print_status 0 "credential_nft canister is deployed"
    else
        print_warning "credential_nft canister not deployed"
    fi
    
    if dfx canister status verification &> /dev/null; then
        print_status 0 "verification canister is deployed"
    else
        print_warning "verification canister not deployed"
    fi
    
    if dfx canister status storage &> /dev/null; then
        print_status 0 "storage canister is deployed"
    else
        print_warning "storage canister not deployed"
    fi
    
    if dfx canister status internet_identity &> /dev/null; then
        print_status 0 "internet_identity canister is deployed"
    else
        print_warning "internet_identity canister not deployed"
    fi
else
    print_warning "DFX replica is not running"
    print_info "Start with: dfx start --background"
fi

echo ""
echo "📊 Summary..."
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your dResume setup is ready.${NC}"
    echo ""
    print_info "Next steps:"
    echo "  1. If canisters are not deployed, run: ./scripts/deploy.sh"
    echo "  2. Install dependencies: npm install"
    echo "  3. Start development server: npm run dev"
    echo "  4. Test the workflow: ./scripts/test-verification.sh"
else
    echo -e "${RED}⚠️  Found $ERRORS issue(s) that need attention.${NC}"
    echo ""
    print_info "Common solutions:"
    echo "  • Install DFX: sh -ci \"\$(curl -fsSL https://internetcomputer.org/install.sh)\""
    echo "  • Install Node.js: https://nodejs.org/"
    echo "  • Make scripts executable: chmod +x scripts/*.sh"
    echo "  • Deploy canisters: ./scripts/deploy.sh"
fi

echo ""
