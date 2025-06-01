# Documentation Index 📚

Quick navigation to all dResume V2 documentation. Find what you need fast!

## 🚀 Getting Started (Start Here!)

| Document | Purpose | Time | Audience |
|----------|---------|------|----------|
| **[QUICK_START.md](./QUICK_START.md)** | Get running in 5 minutes | ⚡ 5 min | Everyone |
| **[DEVELOPER_SETUP.md](./DEVELOPER_SETUP.md)** | Complete dev environment | 👩‍💻 15 min | Developers |
| **[README.md](../README.md)** | Project overview & links | 📖 10 min | Everyone |

## 🛠️ Setup & Configuration

| Document | Purpose | Best For |
|----------|---------|----------|
| **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** | Containerized development | Windows/WSL2 users |
| **[DEV_AUTH_SETUP.md](./DEV_AUTH_SETUP.md)** | Quick authentication testing | Testing without IC |
| **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** | Production deployment | Production deployment |

## 🚨 Help & Troubleshooting

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Common issues & solutions | When things break |
| **[INTEGRATION_STATUS.md](./INTEGRATION_STATUS.md)** | Current project status | Check what's working |
| **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** | Complete project overview | Understand the big picture |

## 🔧 Technical Details

| Document | Purpose | Audience |
|----------|---------|----------|
| **[MOTOKO_INTEGRATION.md](./MOTOKO_INTEGRATION.md)** | Backend canister details | Backend developers |
| **[INTERNET_IDENTITY_INTEGRATION.md](./INTERNET_IDENTITY_INTEGRATION.md)** | Authentication setup | Auth developers |

## 🎯 Quick Reference

### I want to...

#### 🚀 **Get the app running quickly**
→ [QUICK_START.md](./QUICK_START.md) - Choose your path and get running in minutes

#### 👩‍💻 **Set up for development**
→ [DEVELOPER_SETUP.md](./DEVELOPER_SETUP.md) - Complete development environment

#### 🐳 **Use Docker (Windows/WSL2)**
→ [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Containerized development

#### 🚨 **Fix a problem**
→ [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions

#### 📊 **Understand the project**
→ [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Complete project overview

#### 🚀 **Deploy to production**
→ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Production deployment

#### 🔐 **Set up authentication**
→ [DEV_AUTH_SETUP.md](./DEV_AUTH_SETUP.md) - Quick auth for testing

#### 📈 **Check project status**
→ [INTEGRATION_STATUS.md](./INTEGRATION_STATUS.md) - Current progress

## 📱 Application URLs

### Development (Local)
- **Main App**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard-direct
- **Admin Setup**: http://localhost:3000/setup-admin  
- **Admin Panel**: http://localhost:3000/admin

### Key Features to Test
- **Responsive Sidebar**: Fixed sidebar with mobile hamburger menu
- **Admin Workflow**: User registration and approval process
- **Credential Management**: Create and manage credentials
- **Error Handling**: Comprehensive error recovery

## 🛠️ Development Commands

### Quick Commands
```bash
# Super quick test (30 seconds)
npm install && npm run dev

# Docker setup (Windows/WSL2)
npm run docker:setup && npm run dev

# Native setup (Linux/macOS)
dfx start --clean && dfx deploy && npm run dev

# Run tests
npm run test:backend
npm run test:integration
```

### Troubleshooting Commands
```bash
# Fix permissions
sudo chown -R $USER:$USER .next

# Reset everything
rm -rf .next node_modules .dfx && npm install

# Docker reset
npm run docker:stop && npm run docker:start
```

## 📊 Project Structure

```
dresumeV2/
├── 📚 docs/
│   ├── QUICK_START.md              # 5-minute setup
│   ├── DEVELOPER_SETUP.md          # Full dev setup
│   ├── TROUBLESHOOTING.md          # Problem solving
│   ├── DOCS_INDEX.md               # This file
│   └── ...
├── 📖 README.md                    # Main overview
├── 🎨 Frontend/
│   ├── app/dashboard/              # Main dashboard
│   ├── app/admin/                  # Admin interface
│   ├── components/dashboard/       # Dashboard components
│   └── components/admin/           # Admin components
├── 🔧 Backend/
│   ├── src/backend/                # Motoko canisters
│   └── src/declarations/           # Generated types
└── 🛠️ Scripts/
    ├── deploy-docker.sh            # Docker deployment
    ├── setup-admin-user.js         # Admin setup
    └── test-*.js                   # Testing scripts
```

## 🎯 Success Checklist

### ✅ Basic Setup Working
- [ ] Development server starts (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Dashboard shows responsive sidebar
- [ ] No console errors in browser

### ✅ Backend Integration Working  
- [ ] Canisters deployed (`dfx deploy`)
- [ ] Environment variables set (`.env.local`)
- [ ] Can access admin setup page
- [ ] Backend tests pass (`npm run test:backend`)

### ✅ Full Functionality Working
- [ ] Can register as admin user
- [ ] Can access admin panel
- [ ] Dashboard shows user data
- [ ] Mobile responsiveness works

## 🆘 Emergency Help

### Something's Broken?
1. **Check**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) first
2. **Reset**: `rm -rf .next node_modules && npm install`
3. **Docker**: `npm run docker:stop && npm run docker:start`
4. **Ask**: Create GitHub issue with error details

### Need Quick Help?
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community help
- **Console Logs**: Check browser console for errors
- **Terminal Output**: Check terminal for error messages

## 🎉 Contributing

### Want to Contribute?
1. **Start**: [DEVELOPER_SETUP.md](./DEVELOPER_SETUP.md)
2. **Understand**: [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)  
3. **Code**: Make your changes
4. **Test**: `npm run test:backend && npm run test:integration`
5. **Submit**: Create pull request

### Documentation Updates
- **Found an issue?** Create GitHub issue
- **Want to improve docs?** Submit pull request
- **Have suggestions?** Use GitHub discussions

---

**Start with [QUICK_START.md](./QUICK_START.md) and you'll be running in 5 minutes! 🚀**
