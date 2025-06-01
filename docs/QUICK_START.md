# Quick Start Guide ⚡

Get dResume V2 running in under 5 minutes! Choose your path based on your role and operating system.

## 🎯 Choose Your Path

### 👩‍💻 I'm a Developer
**Goal**: Set up full development environment

#### Windows/WSL2 Users (Recommended: Docker)
```bash
git clone <repository-url>
cd dresumeV2
npm install
npm run docker:setup
npm run dev
```
✅ **Done!** Open http://localhost:3000

#### Linux/macOS Users (Native Setup)
```bash
# Install DFX
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Setup project
git clone <repository-url>
cd dresumeV2
npm install
dfx start --clean
dfx deploy
dfx generate
npm run dev
```
✅ **Done!** Open http://localhost:3000

### 🧪 I Want to Test the App
**Goal**: Just see the app working

```bash
git clone <repository-url>
cd dresumeV2
npm install
npm run dev
```

Then visit:
- **Main App**: http://localhost:3000
- **Dashboard Demo**: http://localhost:3000/dashboard-direct
- **Admin Setup**: http://localhost:3000/setup-admin

### 🚀 I Want to Deploy to Production
**Goal**: Deploy to Internet Computer mainnet

1. **Complete development setup** (see Developer path above)
2. **Follow deployment guide**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
3. **Configure production environment**

## 🎮 Testing the Application

### 1. Basic Functionality Test
```bash
# Start the app
npm run dev

# Open browser to http://localhost:3000
# Click around the interface
# Test navigation and basic features
```

### 2. Admin Setup Test
```bash
# Navigate to http://localhost:3000/setup-admin
# Login with Internet Identity
# Register as admin user
# Access admin panel at /admin
```

### 3. Dashboard Test
```bash
# Go to http://localhost:3000/dashboard-direct
# See the new responsive sidebar layout
# Test mobile responsiveness (F12 -> device toolbar)
# Try creating credentials (if verified)
```

## 🔧 Quick Fixes

### Development Server Won't Start
```bash
# Fix permissions
sudo chown -R $USER:$USER .next
rm -rf .next node_modules
npm install
npm run dev
```

### Backend Connection Issues
```bash
# Docker users
npm run docker:stop
npm run docker:start

# Native users
dfx stop
dfx start --clean
dfx deploy
```

### Environment Issues
```bash
# Check environment file
cat .env.local

# Should contain canister IDs like:
# NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID="uzt4z-lp777-77774-qaabq-cai"
```

## 📱 What You'll See

### Main Dashboard
- **Fixed sidebar** with user profile and navigation
- **Mobile responsive** with hamburger menu
- **Verification status** clearly displayed
- **Credential management** interface

### Admin Panel
- **User management** with approval workflow
- **System monitoring** and analytics
- **Bulk operations** for efficiency

### Key Features Working
- ✅ Internet Identity authentication
- ✅ Responsive design (mobile + desktop)
- ✅ Real-time status updates
- ✅ Error handling and recovery
- ✅ Admin user management

## 🎯 Next Steps

### After Quick Start
1. **Explore the interface** - Try all the features
2. **Read the documentation** - Check [README.md](../README.md)
3. **Set up development environment** - Follow [DEVELOPER_SETUP.md](./DEVELOPER_SETUP.md)
4. **Report issues** - Create GitHub issues for bugs

### For Developers
1. **Review the codebase** - Start with `app/dashboard/page.tsx`
2. **Test backend integration** - Use the ICIntegrationTester
3. **Make changes** - Try modifying components
4. **Run tests** - `npm run test:backend`

### For Testers
1. **Test user flows** - Registration, credential creation, verification
2. **Test responsive design** - Mobile, tablet, desktop
3. **Test error scenarios** - Network issues, invalid inputs
4. **Provide feedback** - Document any issues found

## 🆘 Need Help?

### Quick Resources
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[Docker Setup](./DOCKER_SETUP.md)** - Detailed Docker instructions
- **[Integration Status](./INTEGRATION_STATUS.md)** - Current project status

### Common Questions

**Q: The app shows "Choose Your Role" instead of dashboard**
A: This means you need to register as a user. Go to `/setup-admin` to register as admin.

**Q: I get canister connection errors**
A: Check if the backend is running. For Docker: `npm run docker:start`. For native: `dfx start --clean`.

**Q: The sidebar doesn't show on mobile**
A: Click the hamburger menu (☰) in the top-left corner on mobile devices.

**Q: I can't create credentials**
A: You need to be a verified user. Use `/setup-admin` to register and approve yourself.

### Getting Support
- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and help
- **Documentation** - Check all the linked guides

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ Development server starts without errors
- ✅ You can access http://localhost:3000
- ✅ Dashboard shows responsive sidebar layout
- ✅ Admin panel is accessible (after setup)
- ✅ No console errors in browser
- ✅ Backend integration tests pass

## ⚡ Super Quick Test (30 seconds)

Just want to see if it works?

```bash
git clone <repository-url>
cd dresumeV2
npm install
npm run dev
```

Open http://localhost:3000/dashboard-direct

You should see a professional dashboard with a fixed sidebar! 🎉

---

**Choose your path above and get started in minutes!**
