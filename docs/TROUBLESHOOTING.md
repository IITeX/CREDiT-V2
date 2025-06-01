# dresumeV2 Troubleshooting Guide

## Common Issues and Solutions

### 1. Development Server Won't Start

#### Issue: `.next` directory permission errors
```bash
Error: EACCES: permission denied, mkdir '.next'
```

**Solutions:**
```bash
# Option 1: Remove and recreate .next directory
rm -rf .next
mkdir .next

# Option 2: Fix permissions
sudo chown -R $USER:$USER .next
chmod -R 755 .next

# Option 3: Clean install
rm -rf node_modules .next
npm install
npm run dev
```

#### Issue: Port already in use
```bash
Error: Port 3000 is already in use
```

**Solutions:**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### 2. ICP Replica Issues

#### Issue: Replica crashes or becomes unresponsive
```bash
Critical error mr_non_increasing_batch_time occurred
```

**Solutions:**
```bash
# Stop and restart with clean state
dfx stop
dfx start --clean

# Redeploy all canisters
dfx deploy
dfx generate
```

#### Issue: Canister not found
```bash
Error: Cannot find canister id
```

**Solutions:**
```bash
# Check if replica is running
dfx ping

# Check canister status
dfx canister status --all

# Redeploy if needed
dfx deploy [canister_name]
```

### 3. Frontend Integration Issues

#### Issue: Canister IDs not found
```bash
Error: Canister ID is empty
```

**Solutions:**
1. Check `.env.local` file exists and has correct values:
```bash
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID="uzt4z-lp777-77774-qaabq-cai"
NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID="ucwa4-rx777-77774-qaada-cai"
NEXT_PUBLIC_VERIFICATION_CANISTER_ID="ulvla-h7777-77774-qaacq-cai"
NEXT_PUBLIC_STORAGE_CANISTER_ID="umunu-kh777-77774-qaaca-cai"
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID="uxrrr-q7777-77774-qaaaq-cai"
```

2. Restart development server after changing environment variables

#### Issue: TypeScript declaration errors
```bash
Module '"../src/declarations/..."' not found
```

**Solutions:**
```bash
# Regenerate declarations
dfx generate

# Check if declarations exist
ls -la src/declarations/

# If missing, redeploy canisters
dfx deploy
dfx generate
```

### 4. Authentication Issues

#### Issue: Internet Identity login fails
```bash
Error: Failed to authenticate with Internet Identity
```

**Solutions:**
1. Check if Internet Identity canister is running:
```bash
dfx canister status internet_identity
```

2. Clear browser cache and cookies

3. Try different browser or incognito mode

4. Check network connectivity to IC replica

### 5. Backend Method Call Failures

#### Issue: Canister calls hang or timeout
```bash
dfx canister call user_management getAllUsers
# (hangs indefinitely)
```

**Solutions:**
```bash
# Check replica status
dfx ping

# Restart replica if unhealthy
dfx stop
dfx start --clean
dfx deploy

# Try with timeout
timeout 30s dfx canister call user_management getAllUsers
```

#### Issue: Method not found errors
```bash
Error: Method does not exist
```

**Solutions:**
1. Check method name spelling in `.did` files
2. Regenerate declarations:
```bash
dfx generate
```
3. Redeploy canister:
```bash
dfx deploy [canister_name]
```

### 6. Build and Compilation Issues

#### Issue: TypeScript compilation errors
```bash
Type error: Cannot find module '@/components/...'
```

**Solutions:**
1. Check `tsconfig.json` path mapping
2. Verify file exists at correct location
3. Restart TypeScript server in VS Code

#### Issue: Module resolution errors
```bash
Error: Cannot resolve module '@dfinity/agent'
```

**Solutions:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or install specific package
npm install @dfinity/agent @dfinity/auth-client @dfinity/candid @dfinity/identity @dfinity/principal
```

### 7. Network and Performance Issues

#### Issue: Slow canister responses
**Solutions:**
1. Check replica performance:
```bash
dfx ping
```

2. Use query methods instead of update methods when possible
3. Implement caching in frontend
4. Add loading states for better UX

#### Issue: Connection errors
```bash
Error: fetch failed
```

**Solutions:**
1. Check IC replica is running: `dfx ping`
2. Verify network connectivity
3. Check firewall settings
4. Try different network/VPN

## Diagnostic Commands

### Check System Status
```bash
# Check dfx version
dfx --version

# Check replica health
dfx ping

# Check all canister statuses
dfx canister status user_management
dfx canister status credential_nft
dfx canister status verification
dfx canister status storage
dfx canister status internet_identity

# Check canister IDs
dfx canister id user_management
dfx canister id credential_nft
dfx canister id verification
dfx canister id storage
dfx canister id internet_identity
```

### Check Frontend
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Next.js build
npm run build

# Check TypeScript compilation
npx tsc --noEmit
```

### Environment Verification
```bash
# Check environment variables
env | grep NEXT_PUBLIC

# Check declarations
ls -la src/declarations/

# Check .env.local
cat .env.local
```

## Getting Help

1. **Check logs:** Look at browser console and terminal output
2. **Enable debug mode:** Set `DEBUG=true` in environment
3. **Use development tools:** Access the ICIntegrationTester in dashboard
4. **Run test scripts:** Use `npm run test:backend` for backend testing
5. **Community resources:** 
   - [DFINITY Developer Forum](https://forum.dfinity.org/)
   - [IC Developer Discord](https://discord.gg/jnjVVQe)
   - [DFINITY Documentation](https://internetcomputer.org/docs/)

## Emergency Recovery

If everything breaks and you need to start fresh:

```bash
# Stop all processes
dfx stop
pkill -f "next"

# Clean everything
rm -rf .next node_modules .dfx
npm install

# Restart from scratch
dfx start --clean
dfx deploy
dfx generate
npm run dev
```

This will give you a completely clean environment to work with.
