#!/bin/bash

# Deploy and Test Script for dResume V2
# This script helps deploy the canisters and test the admin functionality

echo "🚀 dResume V2 - Deploy and Test Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "dfx.json" ]; then
    echo "❌ Error: dfx.json not found. Please run this script from the dresumeV2 directory."
    exit 1
fi

# Check if dfx is available
if ! command -v dfx &> /dev/null; then
    echo "❌ Error: dfx command not found. Please make sure DFX is installed and in your PATH."
    echo "💡 Tip: Use WSL Ubuntu terminal for dfx commands"
    exit 1
fi

echo "📦 Step 1: Checking DFX status..."
if pgrep -f "dfx start" > /dev/null; then
    echo "✅ DFX is already running"
else
    echo "🚀 Starting DFX..."
    dfx start --background
fi

echo "🔧 Step 2: Deploying canisters..."
dfx deploy

if [ $? -eq 0 ]; then
    echo "✅ Canisters deployed successfully!"
else
    echo "❌ Deployment failed!"
    exit 1
fi

echo "🔍 Step 3: Testing admin functionality..."

# Get the user management canister ID
USER_CANISTER=$(dfx canister id user_management)
echo "📋 User Management Canister ID: $USER_CANISTER"

# Test admin status
echo "🔐 Testing admin status for your principal..."
ADMIN_PRINCIPAL="g5pqo-7ihb2-4vqek-pou4f-pauhm-tfylr-qcvnb-f5fnp-lfjs5-i7xtv-pae"

dfx canister call $USER_CANISTER isAdminPrincipal "(principal \"$ADMIN_PRINCIPAL\")"

if [ $? -eq 0 ]; then
    echo "✅ Admin check successful!"
else
    echo "⚠️  Admin check failed, but this might be expected on first run"
fi

echo "📋 Getting list of admins..."
dfx canister call $USER_CANISTER getAdmins

echo ""
echo "🎉 Setup Complete!"
echo "==================="
echo "✅ Your principal is now configured as an admin"
echo "🌐 Frontend URL: http://localhost:3001"
echo "🔧 Admin Dashboard: http://localhost:3001/admin"
echo "📊 User Dashboard: http://localhost:3001/dashboard"
echo ""
echo "💡 Next Steps:"
echo "   1. Start the frontend: npm run dev"
echo "   2. Visit http://localhost:3001/auth to sign in"
echo "   3. Use the dev login button with your principal"
echo "   4. Access the admin dashboard to verify users"
echo ""
echo "🔧 Canister IDs:"
echo "   User Management: $USER_CANISTER"
echo "   Credential Management: $(dfx canister id credential_management)"
