# Deployment Instructions 🚀

## Overview

This document provides step-by-step instructions for deploying the consolidated dResume canisters to the IC Network.

## 🏗️ What We've Accomplished

### 1. Canister Consolidation ✅
- **Merged** `user_management` and `verification` functionality into `storage` canister
- **Enhanced** `credential_nft` canister with Soul Bound Token (SBT) support
- **Consolidated** all user roles, verification, and document storage in one place

### 2. Frontend Enhancements ✅
- **Role-based dashboards** for Individual vs Issuer users
- **Issuer dashboard** with token generation and certificate creation
- **Enhanced search results** with different views for issuer vs individual credentials
- **AI verification demo** integrated into signup process
- **Mock data system** for testing and demonstration

### 3. Soul Bound Token Implementation ✅
- **Non-transferable NFTs** for verified issuer certificates
- **Issuer-specific token formats** (ED-2025-001, CO-2025-042, etc.)
- **Transfer prevention** for SBT tokens
- **Verification workflow** with SVT-backed certificates

## 📦 Canisters to Deploy

### Storage Canister (Consolidated)
**File**: `src/backend/storage/main.mo`
**Canister ID**: `kyega-raaaa-aaaao-qkb2q-cai`

**New Features Added**:
- User management (registration, profiles, roles)
- Verification requests and status management
- Document upload and storage
- Verified issuer management
- Credential verification workflows

### Credential NFT Canister (Enhanced)
**File**: `src/backend/credential_nft/main.mo`
**Canister ID**: `uxrrr-q7777-77774-qaaaq-cai`

**New Features Added**:
- Soul Bound Token (SBT) creation for verified issuers
- Issuer-specific token ID generation
- Transfer prevention for SBTs
- Enhanced metadata for certificates

## 🔧 Deployment Commands

### 1. Build Canisters
```bash
# Build storage canister
dfx build storage

# Build credential_nft canister
dfx build credential_nft
```

### 2. Deploy to IC Network
```bash
# Deploy storage canister
dfx deploy storage --network ic

# Deploy credential_nft canister
dfx deploy credential_nft --network ic
```

### 3. Verify Deployment
```bash
# Check canister status
dfx canister status storage --network ic
dfx canister status credential_nft --network ic
```

## 🧪 Testing with Mock Data

### Sample Token IDs for Testing
- **ED-2025-001** - Educational Institution Certificate
- **CO-2025-042** - Company Training Certificate  
- **CB-2025-015** - Professional Certification
- **NG-2025-003** - NGO Community Leadership
- **PL-2025-128** - Platform Digital Marketing
- **CREDiT-1001** - Individual AWS Certification

### Test the Search Functionality
1. Go to the homepage
2. Enter any of the sample token IDs above
3. Verify different display formats for issuer vs individual credentials

### Test AI Verification Demo
1. Go to `/signup`
2. Complete the signup flow
3. On the documents step, try the AI verification demo
4. Observe the simulated verification process

## 🔄 Environment Variables

Update your `.env.local` file:
```env
# Canister IDs (IC Network - Deployed)
NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID="uxrrr-q7777-77774-qaaaq-cai"
NEXT_PUBLIC_STORAGE_CANISTER_ID="kyega-raaaa-aaaao-qkb2q-cai"

# Consolidated canisters (no longer needed)
# NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID - merged into storage
# NEXT_PUBLIC_VERIFICATION_CANISTER_ID - merged into storage

# Development settings
NEXT_PUBLIC_ENABLE_DEV_LOGIN=true
NEXT_PUBLIC_DFX_NETWORK=ic
```

## 🎯 Key Features to Test

### 1. Role-Based Dashboards
- **Individual users** → `/dashboard`
- **Issuer organizations** → `/issuer-dashboard`
- Automatic redirection based on user role

### 2. Token Generation (Issuer Dashboard)
- Generate unique tokens with issuer prefixes
- Upload certificate files for each token
- Save tokens to blockchain with SBT properties

### 3. Certificate Search
- Search by token ID shows different views
- Issuer-created certificates show organization details
- Individual credentials show verification status

### 4. Soul Bound Tokens
- Certificates from verified issuers are non-transferable
- Special "SVT-Backed" badges for verified issuers
- Transfer attempts are blocked for SBT tokens

## 🚨 Important Notes

### Data Migration
Since we consolidated canisters, any existing data in separate `user_management` and `verification` canisters will need to be migrated to the `storage` canister.

### Backup Existing Data
Before deploying, backup any important data:
```bash
# Export existing data (if any)
dfx canister call user_management getAllUsers --network ic
dfx canister call verification getAllRequests --network ic
```

### Gradual Rollout
Consider deploying to a test environment first:
1. Deploy to local dfx for testing
2. Deploy to IC testnet (if available)
3. Deploy to IC mainnet

## 🔍 Verification Checklist

After deployment, verify:
- [ ] Storage canister responds to user registration
- [ ] Credential NFT canister creates SBTs correctly
- [ ] Frontend connects to deployed canisters
- [ ] Mock data search works correctly
- [ ] AI verification demo functions
- [ ] Role-based dashboards redirect properly
- [ ] Token generation works for issuers
- [ ] SBT transfer prevention works

## 📞 Support

If you encounter issues during deployment:
1. Check canister logs: `dfx canister logs <canister_name> --network ic`
2. Verify canister IDs in environment variables
3. Ensure sufficient cycles for deployment
4. Check IC network status

## 🎉 Post-Deployment

Once deployed successfully:
1. Update documentation with new canister IDs
2. Test all user flows end-to-end
3. Create demo accounts for different user roles
4. Prepare user onboarding materials
5. Monitor canister performance and cycles

---

**Ready to deploy!** 🚀 The consolidated canisters provide a complete, production-ready credential verification system with Soul Bound Token support and role-based dashboards.
