#!/bin/bash

echo "🧪 Comprehensive Backend Testing for dresumeV2"
echo "=============================================="

echo ""
echo "📍 Step 1: Testing Basic Connectivity"
echo "--------------------------------------"

# Test if all canisters are running
echo "Testing canister connectivity..."

echo "✅ user_management canister:"
dfx canister id user_management

echo "✅ credential_nft canister:"
dfx canister id credential_nft

echo "✅ verification canister:"
dfx canister id verification

echo "✅ storage canister:"
dfx canister id storage

echo ""
echo "📍 Step 2: Testing User Management"
echo "----------------------------------"

echo "Getting all users (should be empty initially):"
dfx canister call user_management getAllUsers

echo ""
echo "Getting admin list:"
dfx canister call user_management getAdmins

echo ""
echo "📍 Step 3: Testing Registration"
echo "-------------------------------"

echo "Registering a new user:"
dfx canister call user_management registerUser \
  '("test@example.com", variant { Individual }, null)'

echo ""
echo "Getting my profile after registration:"
dfx canister call user_management getMyProfile

echo ""
echo "📍 Step 4: Testing Credential Creation"
echo "--------------------------------------"

echo "Creating a credential:"
dfx canister call credential_nft mintCredential \
  '("Test Certificate", "This is a test credential", "Test Issuer", "test@example.com")'

echo ""
echo "Getting user credentials:"
dfx canister call credential_nft getUserCredentials \
  '(principal "$(dfx identity get-principal)")'

echo ""
echo "📍 Step 5: Testing Verification System"
echo "--------------------------------------"

echo "Getting verification requests:"
dfx canister call verification getVerificationRequests

echo ""
echo "📍 Step 6: Testing Storage System"
echo "---------------------------------"

echo "Testing file storage:"
dfx canister call storage uploadFile \
  '("test.txt", "text/plain", blob "Hello World")'

echo ""
echo "Getting stored files:"
dfx canister call storage getFiles

echo ""
echo "🎉 Backend Testing Complete!"
echo "============================"
