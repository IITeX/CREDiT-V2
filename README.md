# dResume V2 🎓

A decentralized resume platform built on the Internet Computer Protocol (ICP) that enables users to create, verify, and manage professional credentials as NFTs.

![image](https://github.com/user-attachments/assets/0f3c323f-d8c3-4ea3-90ea-55f3d5817bca)

## 🚀 Quick Start

**New to the project?** Start here: **[docs/QUICK_START.md](./docs/QUICK_START.md)** ⚡

**Setting up for development?** Follow: **[docs/DEVELOPER_SETUP.md](./docs/DEVELOPER_SETUP.md)** 👩‍💻

### Super Quick Test (30 seconds)
```bash
git clone <repository-url>
cd dresumeV2
npm install
npm run dev
```
Open http://localhost:3000/dashboard-direct to see the responsive dashboard! 🎉

### Full Setup Options

#### Docker Setup (Windows/WSL2)
```bash
npm run docker:setup && npm run dev
```

#### Native Setup (Linux/macOS)
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
dfx start --clean && dfx deploy && dfx generate && npm run dev
```

### Key URLs
- **Main App**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard-direct
- **Admin Setup**: http://localhost:3000/setup-admin
- **Admin Panel**: http://localhost:3000/admin

## 🏗️ Architecture

### Backend (Internet Computer)
- **User Management**: User registration, profiles, verification status
- **Credential NFT**: Credential creation, ownership, metadata
- **Verification**: Verification requests, approvals, rejections  
- **Storage**: Document storage, file management
- **Internet Identity**: Authentication and identity management

### Frontend (Next.js + React)
- **Authentication**: Internet Identity integration
- **Dashboard**: User credential management with responsive sidebar
- **Admin Panel**: User verification and system management
- **Error Handling**: Comprehensive error boundaries and loading states

## 📚 Documentation

**📋 [Documentation Index](./docs/DOCS_INDEX.md) - Find any guide quickly!**

### 🚀 Getting Started
- **[Quick Start Guide](./docs/QUICK_START.md)** - Get running in 5 minutes ⚡
- **[Developer Setup](./docs/DEVELOPER_SETUP.md)** - Complete development environment 👩‍💻
- **[Troubleshooting Guide](./docs/TROUBLESHOOTING.md)** - Common issues and solutions 🚨

### 🛠️ Setup & Deployment
- **[Docker Setup](./docs/DOCKER_SETUP.md)** - Containerized development (Windows/WSL2) 🐳
- **[Development Auth Setup](./docs/DEV_AUTH_SETUP.md)** - Quick authentication for testing 🔐
- **[Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md)** - Production deployment guide 🚀

### 📊 Project Status & Integration
- **[Integration Status](./docs/INTEGRATION_STATUS.md)** - Current progress and roadmap 📈
- **[Motoko Integration](./docs/MOTOKO_INTEGRATION.md)** - Backend canister details 🔧
- **[Internet Identity Integration](./docs/INTERNET_IDENTITY_INTEGRATION.md)** - Authentication setup 🆔

## 🎯 Key Features

### For Users
- ✅ **Decentralized Authentication** via Internet Identity
- ✅ **Credential Creation** as verifiable NFTs
- ✅ **Professional Dashboard** with responsive design
- ✅ **Public Profile** for sharing credentials
- ✅ **Verification Workflow** for credential authenticity

### For Admins
- ✅ **User Management** with approval workflow
- ✅ **Verification System** for reviewing credentials
- ✅ **Analytics Dashboard** for system monitoring
- ✅ **Bulk Operations** for efficient management

### For Developers
- ✅ **Comprehensive Error Handling** with recovery mechanisms
- ✅ **Real-time Integration Testing** tools
- ✅ **TypeScript Support** with generated declarations
- ✅ **Docker Environment** for consistent development

## 🛠️ Development Commands

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Backend Development
```bash
dfx start --clean    # Start IC replica
dfx deploy          # Deploy all canisters
dfx generate        # Generate TypeScript declarations
npm run test:backend # Run backend tests
```

### Docker Development
```bash
npm run docker:start   # Start Docker environment
npm run docker:deploy  # Deploy canisters in Docker
npm run docker:stop    # Stop Docker environment
```

### Testing
```bash
npm run test:integration  # Run integration tests
npm run test:backend     # Test backend functionality
```

## 🎨 User Interface

### Dashboard Features
- **Fixed Sidebar**: Always accessible navigation with user profile
- **Mobile Responsive**: Hamburger menu and touch-friendly design
- **Verification Status**: Clear indicators for account status
- **Credential Management**: Create, view, and manage credentials
- **Real-time Updates**: Live status updates and notifications

### Admin Interface
- **User Management**: Approve/reject user verifications
- **System Monitoring**: Track platform usage and performance
- **Bulk Operations**: Efficient management of multiple users
- **Analytics**: Insights into platform usage and trends

## 🔧 Configuration

### Environment Variables
Create `.env.local` with your canister IDs:
```bash
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID="your-canister-id"
NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID="your-canister-id"
NEXT_PUBLIC_VERIFICATION_CANISTER_ID="your-canister-id"
NEXT_PUBLIC_STORAGE_CANISTER_ID="your-canister-id"
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID="your-canister-id"
NEXT_PUBLIC_DFX_NETWORK="local"
```

### Admin Setup
1. Navigate to `/setup-admin`
2. Login with Internet Identity
3. Register as admin user
4. Access admin panel at `/admin`

## 🚨 Troubleshooting

### Common Issues
- **Development server won't start**: See [Troubleshooting Guide](./docs/TROUBLESHOOTING.md#development-server-wont-start)
- **Canister connection errors**: Check [Backend Issues](./docs/TROUBLESHOOTING.md#icp-replica-issues)
- **Authentication problems**: Review [Auth Issues](./docs/TROUBLESHOOTING.md#authentication-issues)

### Quick Fixes
```bash
# Reset everything
dfx stop && rm -rf .next node_modules .dfx
npm install && dfx start --clean && dfx deploy

# Fix permissions (WSL2)
sudo chown -R $USER:$USER .next

# Use Docker (recommended for Windows)
npm run docker:setup
```

## 📊 Project Status

### ✅ Completed
- Backend infrastructure (5 canisters deployed)
- Frontend with responsive dashboard
- Authentication system
- Error handling and loading states
- Admin user management
- Docker development environment

### 🔄 In Progress
- End-to-end testing
- Production deployment
- Advanced analytics

### 📋 Roadmap
- Mobile app development
- Advanced credential types
- Integration with external verification services
- Marketplace for credentials

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow setup instructions** in this README
4. **Run tests**: `npm run test:backend && npm run test:integration`
5. **Submit pull request**

### Development Workflow
1. Start with Docker setup for consistent environment
2. Use the integration testing tools in development mode
3. Test both frontend and backend changes
4. Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the linked guides above
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Community**: Join the DFINITY developer community

## 🎉 Acknowledgments

- Built on the Internet Computer Protocol
- Uses Internet Identity for authentication
- Powered by Motoko smart contracts
- Frontend built with Next.js and Tailwind CSS

---

**Ready to build the future of professional credentials? Start with the [Quick Start](#-quick-start) guide above!**
