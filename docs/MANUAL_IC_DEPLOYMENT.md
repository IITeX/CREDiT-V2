# Manual IC Network Deployment Guide

## Quick Fix for Your IC Deployment Issue

Since you need to run this from your WSL terminal where dfx is available, here are the exact commands to run:

### Step 1: Switch to WSL Terminal and Navigate to Project

```bash
# In your WSL terminal (where dfx works)
cd /mnt/c/Users/Captain/Desktop/Codes/IITeX/dresumeV2
```

### Step 2: Backup and Use Simplified Configuration

```bash
# Backup your original dfx.json
cp dfx.json dfx.json.backup

# Use the simplified IC-only configuration
cp dfx-ic-only.json dfx.json
```

### Step 3: Build Your Canisters

```bash
# Build only the canisters you have deployed
dfx build --network ic
```

### Step 4: Install WASM Modules to Your Existing Canisters

```bash
# Install credential_nft WASM module
dfx canister --network ic install credential_nft --mode reinstall

# Install storage WASM module  
dfx canister --network ic install storage --mode reinstall
```

**Note:** If `reinstall` fails, try `upgrade` mode:
```bash
dfx canister --network ic install credential_nft --mode upgrade
dfx canister --network ic install storage --mode upgrade
```

### Step 5: Test Your Canisters

```bash
# Test credential_nft canister
dfx canister --network ic call credential_nft getName

# Test storage canister
dfx canister --network ic call storage getName

# Test credential_nft stats
dfx canister --network ic call credential_nft getStats

# Test storage stats
dfx canister --network ic call storage getStorageStats
```

### Step 6: Generate TypeScript Declarations

```bash
# Generate declarations for your frontend
dfx generate --network ic
```

### Step 7: Restore Original Configuration

```bash
# Restore your original dfx.json
cp dfx.json.backup dfx.json
rm dfx.json.backup
```

### Step 8: Update Environment Configuration

Create/update your `.env.local` file:

```bash
cat > .env.local << 'EOF'
# Network Configuration
NEXT_PUBLIC_DFX_NETWORK="ic"
NEXT_PUBLIC_IC_HOST="https://ic0.app"

# Canister IDs (IC Network - DEPLOYED & WORKING)
NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID="k7fau-4yaaa-aaaao-qkb2a-cai"
NEXT_PUBLIC_STORAGE_CANISTER_ID="kyega-raaaa-aaaao-qkb2q-cai"

# Internet Identity Canister (Production)
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID="rdmx6-jaaaa-aaaah-qdrha-cai"

# Application Configuration
NEXT_PUBLIC_APP_NAME="dResume"
NEXT_PUBLIC_APP_URL="https://dresume.app"

# Development Settings
NEXT_PUBLIC_ENABLE_DEV_LOGIN=true
EOF
```

## Expected Results

After running these commands, you should see:

1. **Build Success**: Canisters compile without errors
2. **Install Success**: WASM modules installed to your canister IDs
3. **Test Success**: 
   - `getName()` returns "CredentialNFT" and "Storage"
   - `getStats()` returns credential statistics
   - `getStorageStats()` returns storage statistics

## Troubleshooting

### If you get authentication errors:
```bash
# Check your identity
dfx identity whoami

# Make sure you're using the identity that owns the canisters
```

### If installation fails with permission errors:
```bash
# Try using the controller identity
dfx identity use default  # or whatever identity owns the canisters
```

### If build fails:
```bash
# Check for syntax errors in your Motoko code
dfx build credential_nft --network ic
dfx build storage --network ic
```

## Verification

Once complete, verify your deployment:

1. **Check IC Dashboard**: 
   - [Credential NFT](https://dashboard.internetcomputer.org/canister/k7fau-4yaaa-aaaao-qkb2a-cai)
   - [Storage](https://dashboard.internetcomputer.org/canister/kyega-raaaa-aaaao-qkb2q-cai)

2. **Test Frontend Connection**: 
   ```bash
   npm run dev
   ```
   Your app should now connect to IC network properly.

## All-in-One Command Sequence

Here's the complete sequence you can copy-paste:

```bash
cd /mnt/c/Users/Captain/Desktop/Codes/IITeX/dresumeV2
cp dfx.json dfx.json.backup
cp dfx-ic-only.json dfx.json
dfx build --network ic
dfx canister --network ic install credential_nft --mode reinstall
dfx canister --network ic install storage --mode reinstall
dfx canister --network ic call credential_nft getName
dfx canister --network ic call storage getName
dfx generate --network ic
cp dfx.json.backup dfx.json
rm dfx.json.backup
echo "✅ IC Deployment Fixed!"
```

Run this sequence in your WSL terminal and your IC deployment should be working!
