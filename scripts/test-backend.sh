#!/bin/bash

echo "Testing Credential Creation"

# Test simple credential creation
echo "Creating credential..."
dfx canister call credential_nft createCredential \
  '(variant { Professional }, "Test Certificate", "Test Description", "test@example.com", "Test User", null, vec {}, null)'

echo "Getting credentials..."
dfx canister call credential_nft getCredentials

echo "Testing user management..."
dfx canister call user_management register '("test@example.com", variant { Student })'

echo "Getting user profile..."
dfx canister call user_management getMyProfile
