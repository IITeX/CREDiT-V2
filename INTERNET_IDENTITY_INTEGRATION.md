# Internet Identity Integration Guide

This document provides a comprehensive guide to the Internet Identity integration in the dResume project.

## 🔧 Setup and Configuration

### Environment Variables

The following environment variables are required for proper Internet Identity integration:

```bash
# Frontend Environment Variables for Next.js
NEXT_PUBLIC_DFX_NETWORK='local'
NEXT_PUBLIC_IC_HOST='http://localhost:4943'

# Canister IDs for Frontend
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID='u6s2n-gx777-77774-qaaba-cai'
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID='umunu-kh777-77774-qaaca-cai'
NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID='uxrrr-q7777-77774-qaaaq-cai'
NEXT_PUBLIC_VERIFICATION_CANISTER_ID='ulvla-h7777-77774-qaacq-cai'
NEXT_PUBLIC_STORAGE_CANISTER_ID='uzt4z-lp777-77774-qaabq-cai'

# Authentication Configuration
NEXT_PUBLIC_AUTH_TIMEOUT=1800000
NEXT_PUBLIC_ENABLE_DEV_LOGIN=true
NEXT_PUBLIC_SIMULATION_MODE=false
```

### Dependencies

The following packages are required and already installed:

- `@dfinity/agent` - Core IC agent functionality
- `@dfinity/auth-client` - Internet Identity authentication
- `@dfinity/candid` - Candid interface definitions
- `@dfinity/identity` - Identity management
- `@dfinity/principal` - Principal handling

## 🏗️ Architecture

### Core Components

1. **Authentication Library** (`lib/auth.ts`)
   - Enhanced authentication functions with error handling
   - Support for both Internet Identity and development login
   - Automatic session management and refresh

2. **Authentication Context** (`contexts/auth-context.tsx`)
   - React context for managing authentication state
   - Automatic authentication checking and refresh
   - Error handling and loading states

3. **UI Components**
   - `LoginButton` - Enhanced login button with error handling
   - `UserMenu` - User menu with authentication status
   - `AuthGuard` - Route protection component
   - `AuthStatus` - Authentication status display

### Authentication Flow

```mermaid
graph TD
    A[User clicks Login] --> B[AuthClient.login()]
    B --> C{Internet Identity}
    C -->|Success| D[Get Identity & Principal]
    C -->|Error| E[Show Error Message]
    D --> F[Update Auth Context]
    F --> G[Redirect to Protected Route]
    E --> H[Allow Retry]
```

## 🔐 Authentication Features

### Internet Identity Login
- Secure, privacy-preserving authentication
- No passwords or personal information required
- Cryptographic identity verification

### Development Login
- Bypass Internet Identity for development
- Use any valid principal ID for testing
- Enabled via `NEXT_PUBLIC_ENABLE_DEV_LOGIN=true`

### Session Management
- Automatic session refresh every 5 minutes
- Configurable session timeout (default: 30 minutes)
- Persistent authentication across browser sessions

### Error Handling
- Comprehensive error types and messages
- User-friendly error display
- Automatic retry mechanisms

## 🛠️ Usage Examples

### Basic Authentication Check

```tsx
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { isAuthenticated, principal, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please log in</div>
  
  return <div>Welcome, {principal?.toString()}</div>
}
```

### Protected Route

```tsx
import { AuthGuard } from '@/components/auth/auth-guard'

function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This content requires authentication</div>
    </AuthGuard>
  )
}
```

### Login Button

```tsx
import { LoginButton } from '@/components/auth/login-button'

function LoginPage() {
  return (
    <div>
      <h1>Welcome to dResume</h1>
      <LoginButton 
        onSuccess={() => console.log('Login successful!')}
        onError={(error) => console.error('Login failed:', error)}
      />
    </div>
  )
}
```

### User Menu

```tsx
import { UserMenu } from '@/components/auth/user-menu'

function Header() {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <UserMenu />
      </nav>
    </header>
  )
}
```

## 🧪 Testing

### Run Integration Tests

```bash
# Test the complete integration
node scripts/test-auth-integration.js

# Test authentication in development
npm run dev
```

### Development Login

For testing purposes, you can enable development login:

1. Set `NEXT_PUBLIC_ENABLE_DEV_LOGIN=true` in your `.env` file
2. In the browser console, run:
   ```javascript
   localStorage.setItem('dev_principal', 'your-test-principal-id')
   ```
3. Refresh the page to activate dev login

### Manual Testing Checklist

- [ ] Login button appears when not authenticated
- [ ] Login process opens Internet Identity window
- [ ] Successful login updates authentication state
- [ ] User menu shows correct principal ID
- [ ] Logout clears authentication state
- [ ] Protected routes redirect to login when not authenticated
- [ ] Authentication persists across page refreshes
- [ ] Error messages display correctly for failed logins

## 🔍 Troubleshooting

### Common Issues

1. **"Failed to fetch root key"**
   - Ensure local dfx replica is running
   - Check `NEXT_PUBLIC_IC_HOST` environment variable

2. **"Canister not found"**
   - Verify canister IDs in environment variables
   - Run `dfx deploy` to deploy canisters

3. **"Authentication timeout"**
   - Check internet connection
   - Verify Internet Identity canister is accessible

4. **"Invalid principal"**
   - Ensure principal format is correct
   - Check for typos in environment variables

### Debug Mode

Enable debug logging by setting:
```bash
NEXT_PUBLIC_LOG_LEVEL=debug
```

### Network Issues

For local development, ensure:
- DFX replica is running on port 4943
- Internet Identity canister is deployed
- CORS is properly configured

## 🚀 Production Deployment

### Environment Variables for Production

```bash
NEXT_PUBLIC_DFX_NETWORK='ic'
NEXT_PUBLIC_IC_HOST='https://ic0.app'
NEXT_PUBLIC_ENABLE_DEV_LOGIN=false
NEXT_PUBLIC_SIMULATION_MODE=false

# Update with production canister IDs
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID='rdmx6-jaaaa-aaaah-qdrha-cai'
# ... other production canister IDs
```

### Security Considerations

- Never expose private keys or sensitive data
- Use HTTPS in production
- Validate all user inputs
- Implement proper CORS policies
- Monitor authentication logs

## 📚 Additional Resources

- [Internet Identity Documentation](https://internetcomputer.org/docs/current/tokenomics/identity-auth/what-is-ic-identity)
- [DFINITY Agent Documentation](https://agent-js.icp.xyz/)
- [IC Development Guide](https://internetcomputer.org/docs/current/developer-docs/getting-started/overview-of-icp)

## 🤝 Contributing

When contributing to the authentication system:

1. Test all authentication flows
2. Update documentation for any changes
3. Ensure backward compatibility
4. Add appropriate error handling
5. Follow the existing code patterns
