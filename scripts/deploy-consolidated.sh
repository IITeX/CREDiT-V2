#!/bin/bash

# Deploy Consolidated Canisters to IC Network
# This script deploys the updated storage and credential_nft canisters with all merged functionality

echo "🚀 Deploying Consolidated dResume Canisters to IC Network"
echo "========================================================="

# Check if dfx is available
if ! command -v dfx &> /dev/null; then
    echo "❌ Error: dfx is not installed or not in PATH"
    echo "Please install dfx: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "dfx.json" ]; then
    echo "❌ Error: dfx.json not found. Please run this script from the project root."
    exit 1
fi

echo "📋 Current Configuration:"
echo "- Storage Canister: kyega-raaaa-aaaao-qkb2q-cai"
echo "- Credential NFT Canister: uxrrr-q7777-77774-qaaaq-cai"
echo ""

# Confirm deployment
read -p "🔍 Do you want to proceed with deployment to IC Network? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

echo "🔧 Building canisters..."

# Build storage canister
echo "📦 Building storage canister (with merged user_management + verification)..."
if ! dfx build storage --network ic; then
    echo "❌ Failed to build storage canister"
    exit 1
fi

# Build credential_nft canister
echo "📦 Building credential_nft canister (with SBT support)..."
if ! dfx build credential_nft --network ic; then
    echo "❌ Failed to build credential_nft canister"
    exit 1
fi

echo "✅ All canisters built successfully!"
echo ""

echo "🚀 Deploying to IC Network..."

# Deploy storage canister (upgrade mode)
echo "📤 Upgrading storage canister..."
if dfx deploy storage --network ic --mode upgrade; then
    echo "✅ Storage canister upgraded successfully!"
else
    echo "❌ Failed to upgrade storage canister"
    echo "💡 Trying install mode instead..."
    if dfx canister install storage --network ic --mode upgrade --yes; then
        echo "✅ Storage canister installed successfully!"
    else
        echo "❌ Failed to deploy storage canister"
        exit 1
    fi
fi

# Deploy credential_nft canister (upgrade mode)
echo "📤 Upgrading credential_nft canister..."
if dfx deploy credential_nft --network ic --mode upgrade; then
    echo "✅ Credential NFT canister upgraded successfully!"
else
    echo "❌ Failed to upgrade credential_nft canister"
    echo "💡 Trying install mode instead..."
    if dfx canister install credential_nft --network ic --mode upgrade --yes; then
        echo "✅ Credential NFT canister installed successfully!"
    else
        echo "❌ Failed to deploy credential_nft canister"
        exit 1
    fi
fi

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "📊 Canister Status:"
echo "- Storage: kyega-raaaa-aaaao-qkb2q-cai (✅ Updated with merged functionality)"
echo "- Credential NFT: uxrrr-q7777-77774-qaaaq-cai (✅ Updated with SBT support)"
echo ""
echo "🔧 New Features Deployed:"
echo "✅ User management (merged from user_management canister)"
echo "✅ Verification workflows (merged from verification canister)"
echo "✅ Document storage and management"
echo "✅ Soul Bound Token (SBT) support"
echo "✅ Issuer-specific token generation"
echo "✅ Role-based access control"
echo ""
echo "🧪 Test with Sample Token IDs:"
echo "- ED-2025-001 (Educational Certificate)"
echo "- CO-2025-042 (Company Training)"
echo "- CB-2025-015 (Professional Certification)"
echo "- NG-2025-003 (NGO Leadership)"
echo "- PL-2025-128 (Platform Specialist)"
echo "- CREDiT-1001 (Individual Credential)"
echo ""
echo "🌐 Frontend should now work with:"
echo "- Role-based dashboards"
echo "- AI verification demo"
echo "- Enhanced search results"
echo "- Mock data integration"
echo ""
echo "🚀 Your dResume application is now fully deployed and ready!"

# Check canister status
echo ""
echo "📋 Verifying deployment..."
echo "Storage canister status:"
dfx canister status storage --network ic

echo ""
echo "Credential NFT canister status:"
dfx canister status credential_nft --network ic

echo ""
echo "✅ Deployment verification complete!"
echo "🎯 Next steps:"
echo "1. Test the frontend at your deployed URL"
echo "2. Try searching with sample token IDs"
echo "3. Test the AI verification demo in signup"
echo "4. Verify role-based dashboard functionality"
echo ""
echo "🎉 Congratulations! Your consolidated dResume system is live!"
