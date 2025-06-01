#!/bin/bash

# dResume Testing Script
# This script tests the complete credential verification workflow

set -e

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

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║                     dResume Testing Workflow                        ║"
    echo "║                Complete Credential Verification                     ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

NETWORK=${1:-local}

print_header
print_info "Testing on network: $NETWORK"

# Test 1: Create University Identity
print_info "Test 1: Creating University identity..."
dfx identity new stanford --storage-mode=plaintext 2>/dev/null || true
dfx identity use stanford

print_info "Registering Stanford University..."
dfx canister call user_management registerUser '("admin@stanford.edu", variant { Educational }, opt "Stanford University")' --network $NETWORK

STANFORD_PRINCIPAL=$(dfx identity get-principal)
print_success "Stanford University registered with principal: $STANFORD_PRINCIPAL"

# Test 2: Create Student Identity  
print_info "Test 2: Creating Student identity..."
dfx identity new student --storage-mode=plaintext 2>/dev/null || true
dfx identity use student

print_info "Registering student..."
dfx canister call user_management registerUser '("john@student.stanford.edu", variant { Individual }, null)' --network $NETWORK

STUDENT_PRINCIPAL=$(dfx identity get-principal)
print_success "Student registered with principal: $STUDENT_PRINCIPAL"

# Test 3: Admin approves Stanford as verifier
print_info "Test 3: Admin approving Stanford as verifier..."
dfx identity use default

print_info "Updating Stanford verification status to Approved..."
dfx canister call user_management updateVerificationStatus "(principal \"$STANFORD_PRINCIPAL\", variant { Approved })" --network $NETWORK

print_success "Stanford approved as verifier"

# Test 4: Stanford creates credential for student
print_info "Test 4: Stanford issuing credential..."
dfx identity use stanford

print_info "Creating Computer Science degree credential..."
dfx canister call credential_nft createCredential '(
  variant { Academic },
  "Computer Science Degree", 
  "Bachelor of Science in Computer Science",
  "john@student.stanford.edu",
  "John Doe",
  null,
  vec { record { "GPA"; "3.8" }; record { "Major"; "Computer Science" }; record { "Graduation Year"; "2024" } },
  null
)' --network $NETWORK

print_success "Credential created successfully"

# Test 5: Verify credentials exist
print_info "Test 5: Verifying credentials..."

print_info "Getting all credentials..."
dfx canister call credential_nft getAllCredentials --network $NETWORK

print_info "Getting credentials by recipient..."
dfx canister call credential_nft getCredentialsByRecipient '("john@student.stanford.edu")' --network $NETWORK

print_info "Getting credentials by issuer..."
dfx canister call credential_nft getCredentialsByIssuer "(principal \"$STANFORD_PRINCIPAL\")" --network $NETWORK

print_success "Credential verification completed"

# Test 6: Test verification workflow
print_info "Test 6: Testing verification request workflow..."

dfx identity use student

print_info "Student submitting verification request..."
dfx canister call verification submitVerificationRequest '(
  variant { Individual },
  "John Doe - Student",
  vec { "document-hash-1"; "document-hash-2" }
)' --network $NETWORK

print_info "Getting student's verification requests..."
dfx canister call verification getMyVerificationRequests --network $NETWORK

print_info "Getting pending verification requests..."
dfx canister call verification getPendingVerificationRequests --network $NETWORK

print_success "Verification workflow tested"

# Test 7: Test storage functionality
print_info "Test 7: Testing storage functionality..."

print_info "Getting storage statistics..."
dfx canister call storage getStorageStats --network $NETWORK

print_info "Getting student's documents..."
dfx canister call storage getMyDocuments --network $NETWORK

print_success "Storage functionality tested"

# Test 8: User profile tests
print_info "Test 8: Testing user profiles..."

print_info "Getting student profile..."
dfx canister call user_management getMyProfile --network $NETWORK

dfx identity use stanford
print_info "Getting Stanford profile..."
dfx canister call user_management getMyProfile --network $NETWORK

dfx identity use default
print_info "Checking if Stanford is verified verifier..."
dfx canister call user_management isVerifiedVerifier "(principal \"$STANFORD_PRINCIPAL\")" --network $NETWORK

print_success "User profile tests completed"

# Summary
echo ""
print_success "🎉 All tests completed successfully!"
echo ""
print_info "Test Summary:"
echo "  ✅ University registration"
echo "  ✅ Student registration"  
echo "  ✅ Verifier approval"
echo "  ✅ Credential creation"
echo "  ✅ Credential verification"
echo "  ✅ Verification requests"
echo "  ✅ Storage functionality"
echo "  ✅ User profiles"
echo ""

print_info "Identities created:"
echo "  🏫 Stanford: $STANFORD_PRINCIPAL"
echo "  🎓 Student: $STUDENT_PRINCIPAL"
echo ""

print_info "You can now test the frontend with these identities!"
print_warning "Remember to switch back to default identity: dfx identity use default"
