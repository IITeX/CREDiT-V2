# Developer Setup Guide 👩‍💻

Complete step-by-step guide for setting up dResume V2 in your local development environment.

## 🎯 Prerequisites

### Required Software
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/) (recommended for Windows/WSL2)

### Optional (for native setup)
- **DFX SDK** - Internet Computer development kit
- **VS Code** - Recommended editor with extensions

## 🚀 Setup Methods

Choose the method that works best for your operating system:

### Method 1: Docker Setup (Recommended for Windows/WSL2)

#### Step 1: Clone Repository
```bash
git clone <repository-url>
cd dresumeV2
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Start Docker Environment
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Start Docker and deploy backend
npm run docker:setup
```

#### Step 4: Start Frontend Development
```bash
npm run dev
```

#### Step 5: Verify Setup
- Frontend: http://localhost:3000
- Admin Setup: http://localhost:3000/setup-admin

### Method 2: Native Setup (Linux/macOS)

#### Step 1: Install DFX SDK
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

#### Step 2: Clone and Install
```bash
git clone <repository-url>
cd dresumeV2
npm install
```

#### Step 3: Start IC Replica
```bash
dfx start --clean
```

#### Step 4: Deploy Backend
```bash
dfx deploy
dfx generate
```

#### Step 5: Start Frontend
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables
The setup scripts automatically create `.env.local` with canister IDs. Verify it contains:

```bash
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID="uzt4z-lp777-77774-qaabq-cai"
NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID="ucwa4-rx777-77774-qaada-cai"
NEXT_PUBLIC_VERIFICATION_CANISTER_ID="ulvla-h7777-77774-qaacq-cai"
NEXT_PUBLIC_STORAGE_CANISTER_ID="umunu-kh777-77774-qaaca-cai"
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID="uxrrr-q7777-77774-qaaaq-cai"
NEXT_PUBLIC_DFX_NETWORK="local"
```

### VS Code Setup (Optional)
Install recommended extensions:
```bash
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
```

## 🧪 Testing Your Setup

### 1. Backend Health Check
```bash
# Test canister connectivity
npm run test:backend

# Or manually test
dfx ping
dfx canister status user_management
```

### 2. Frontend Integration Test
1. Open http://localhost:3000
2. Navigate to `/setup-admin`
3. Login with Internet Identity
4. Register as admin user
5. Access dashboard at `/dashboard`

### 3. Admin Functionality Test
1. Go to http://localhost:3000/admin
2. Navigate to `/admin/users`
3. Test user management features

## 🎨 Development Workflow

### Daily Development
```bash
# Start your development session
npm run docker:start  # or dfx start --clean
npm run dev

# Make changes to code
# Frontend auto-reloads on changes

# Test backend changes
dfx deploy [canister_name]
dfx generate
```

### Testing Changes
```bash
# Run integration tests
npm run test:integration

# Test specific backend functionality
npm run test:backend

# Manual testing via browser
# Use the ICIntegrationTester in development mode
```

### Debugging
```bash
# Check logs
docker-compose -f docker-compose.dfx.yml logs -f  # Docker setup
dfx logs                                          # Native setup

# Reset environment if needed
npm run docker:stop && npm run docker:start      # Docker
dfx stop && dfx start --clean && dfx deploy      # Native
```

## 📁 Project Structure

```
dresumeV2/
├── 📁 app/                    # Next.js app directory
│   ├── dashboard/             # Main user dashboard
│   ├── admin/                 # Admin interface
│   ├── setup-admin/           # Admin setup page
│   └── ...
├── 📁 components/             # React components
│   ├── dashboard/             # Dashboard-specific components
│   ├── admin/                 # Admin-specific components
│   ├── auth/                  # Authentication components
│   └── ui/                    # Reusable UI components
├── 📁 src/backend/            # Motoko backend code
├── 📁 scripts/                # Development and deployment scripts
├── 📁 docs/                   # Documentation files
├── 🔧 dfx.json               # IC project configuration
├── 🔧 docker-compose.dfx.yml # Docker setup
└── 📚 README.md              # Main documentation
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev              # Start Next.js development server
npm run build            # Build for production
npm run lint             # Run ESLint
```

### Backend (Docker)
```bash
npm run docker:start    # Start Docker environment
npm run docker:deploy   # Deploy canisters in Docker
npm run docker:stop     # Stop Docker environment
npm run docker:setup    # Complete Docker setup
```

### Backend (Native)
```bash
dfx start --clean       # Start IC replica
dfx deploy              # Deploy all canisters
dfx generate            # Generate TypeScript declarations
dfx stop                # Stop IC replica
```

### Testing
```bash
npm run test:integration # Run integration tests
npm run test:backend    # Test backend functionality
```

## 🚨 Common Issues & Solutions

### Issue: Development server won't start
```bash
# Solution 1: Fix permissions
sudo chown -R $USER:$USER .next
chmod -R 755 .next

# Solution 2: Clean install
rm -rf node_modules .next
npm install
```

### Issue: Canister connection errors
```bash
# Check if replica is running
dfx ping

# Restart replica
dfx stop && dfx start --clean
dfx deploy
```

### Issue: Docker container won't start
```bash
# Check Docker status
docker info

# Restart Docker environment
npm run docker:stop
npm run docker:start
```

### Issue: Environment variables not loaded
```bash
# Check .env.local exists
cat .env.local

# Restart development server
# Environment variables are loaded on server start
```

## 🎯 Next Steps

### After Setup
1. **Explore the codebase** - Start with `app/dashboard/page.tsx`
2. **Test admin features** - Use `/setup-admin` to become admin
3. **Review documentation** - Check linked guides in README
4. **Make your first change** - Try modifying the dashboard

### Development Best Practices
1. **Use TypeScript** - All new code should be typed
2. **Follow component structure** - Keep components small and focused
3. **Test your changes** - Use the integration testing tools
4. **Update documentation** - Keep docs current with changes

### Contributing
1. **Create feature branch** - `git checkout -b feature/your-feature`
2. **Test thoroughly** - Both frontend and backend
3. **Update documentation** - If you add new features
4. **Submit PR** - With clear description of changes

## 📞 Getting Help

### Documentation
- **[Main README](../README.md)** - Project overview
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues
- **[Docker Setup](./DOCKER_SETUP.md)** - Detailed Docker guide

### Community
- **GitHub Issues** - Report bugs or request features
- **GitHub Discussions** - Ask questions
- **DFINITY Forum** - IC-specific questions

### Development Tools
- **ICIntegrationTester** - Available in development mode
- **Browser DevTools** - Check console for errors
- **VS Code Debugger** - Set breakpoints in TypeScript

---

**Ready to start developing? Choose your setup method above and follow the step-by-step instructions!**
