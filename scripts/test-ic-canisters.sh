#!/bin/bash

# Test IC Network Canisters
# This script tests the functionality of your deployed IC canisters

echo "🧪 Testing IC Network Canisters"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Your canister IDs
CREDENTIAL_NFT_ID="k7fau-4yaaa-aaaao-qkb2a-cai"
STORAGE_ID="kyega-raaaa-aaaao-qkb2q-cai"

echo ""
print_info "Testing Credential NFT Canister ($CREDENTIAL_NFT_ID)..."

# Test getName function
print_info "Testing getName()..."
dfx canister --network ic call credential_nft getName

# Test getStats function
print_info "Testing getStats()..."
dfx canister --network ic call credential_nft getStats

# Test getAllCredentials function
print_info "Testing getAllCredentials()..."
dfx canister --network ic call credential_nft getAllCredentials

echo ""
print_info "Testing Storage Canister ($STORAGE_ID)..."

# Test getName function
print_info "Testing getName()..."
dfx canister --network ic call storage getName

# Test getStorageStats function
print_info "Testing getStorageStats()..."
dfx canister --network ic call storage getStorageStats

# Test getRecentDocuments function
print_info "Testing getRecentDocuments()..."
dfx canister --network ic call storage getRecentDocuments '(5)'

echo ""
print_success "🎉 IC Canister Testing Complete!"
echo ""
print_info "If all tests passed, your canisters are working correctly!"
print_info "You can now use them in your frontend application."
