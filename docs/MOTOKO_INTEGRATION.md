# dResume V2 - Internet Computer Protocol Integration

This document provides a comprehensive guide for the Motoko backend integration and ICP functionality in dResume V2.

## 🏗️ Architecture Overview

The dResume V2 platform uses a multi-canister architecture on the Internet Computer:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  User Management │    │  Credential NFT │
│   (Frontend)    │◄──►│    Canister     │◄──►│    Canister     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐    ┌─────────────────┐
         └─────────────►│  Verification   │    │     Storage     │
                        │    Canister     │◄──►│    Canister     │
                        └─────────────────┘    └─────────────────┘
```

## 📦 Canisters

### 1. User Management Canister
**File**: `src/backend/user_management/main.mo`

**Purpose**: Handles user registration, authentication, and role management.

**Key Features**:
- User registration with role-based access
- Profile management
- Verifier approval system
- Admin functions

**Main Functions**:
- `registerUser(email, role, organizationName)` - Register new user
- `getMyProfile()` - Get current user profile
- `updateProfile(email, organizationName)` - Update user information
- `isVerifiedVerifier(userId)` - Check if user is approved verifier

### 2. Credential NFT Canister
**File**: `src/backend/credential_nft/main.mo`

**Purpose**: Manages credential creation, storage, and NFT minting.

**Key Features**:
- Credential creation as NFTs
- Metadata management
- Ownership tracking
- Credential revocation
- Search and filtering

**Main Functions**:
- `createCredential(...)` - Create new credential and mint NFT
- `getCredential(credentialId)` - Retrieve credential by ID
- `getCredentialsByRecipient(recipient)` - Get user's credentials
- `revokeCredential(credentialId)` - Revoke a credential

### 3. Verification Canister
**File**: `src/backend/verification/main.mo`

**Purpose**: Handles verifier approval workflow and document verification.

**Key Features**:
- Verification request submission
- Admin review process
- Status tracking
- Document validation

**Main Functions**:
- `submitVerificationRequest(...)` - Submit verification request
- `reviewVerificationRequest(...)` - Admin review function
- `getMyVerificationRequests()` - Get user's requests
- `getPendingVerificationRequests()` - Get pending reviews

### 4. Storage Canister
**File**: `src/backend/storage/main.mo`

**Purpose**: Manages document uploads and file storage.

**Key Features**:
- Document upload/download
- File type validation
- Size limits (10MB max)
- Metadata tracking

**Main Functions**:
- `uploadDocument(filename, contentType, content)` - Upload file
- `downloadDocument(hash)` - Download file by hash
- `getDocumentMetadata(hash)` - Get file information

## 🔧 Setup and Deployment

### Prerequisites

1. **Install DFINITY SDK**:
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

### Local Development

1. **Verify setup**:
   ```bash
   ./scripts/verify-setup.sh
   ```

2. **Start local Internet Computer replica**:
   ```bash
   dfx start --background --clean
   ```

3. **Deploy canisters locally**:
   ```bash
   ./scripts/deploy.sh local
   ```

4. **Start frontend**:
   ```bash
   npm run dev
   ```

### Production Deployment

1. **Deploy to Internet Computer mainnet**:
   ```bash
   ./scripts/deploy.sh ic
   ```

2. **Update environment variables** with production canister IDs

## 🔌 Frontend Integration

### Authentication

The authentication system uses Internet Identity for secure, privacy-preserving login:

```typescript
import { useAuth } from '@/contexts/auth-context';

function MyComponent() {
  const { isAuthenticated, login, logout, principal } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={login}>Login with Internet Identity</button>
      )}
    </div>
  );
}
```

### User Management

```typescript
import { useUserManagement } from '@/hooks/useIC';

function ProfileComponent() {
  const { registerUser, getMyProfile } = useUserManagement();
  
  const handleRegister = async () => {
    await registerUser(
      'user@example.com',
      { Educational: null },
      'University Name'
    );
  };
  
  return <div>{/* Profile UI */}</div>;
}
```

### Credential Creation

```typescript
import { useCredentials } from '@/hooks/useIC';

function CreateCredentialComponent() {
  const { createCredential } = useCredentials();
  
  const handleCreate = async () => {
    await createCredential(
      { Academic: null },
      'Bachelor of Science',
      'Computer Science degree',
      'recipient@example.com',
      'John Doe'
    );
  };
  
  return <div>{/* Credential form */}</div>;
}
```

## 🔐 Security Features

### Access Control
- **Role-based permissions**: Only verified verifiers can issue credentials
- **Owner-only operations**: Users can only modify their own data
- **Admin functions**: Restricted to designated admin principals

### Data Integrity
- **Immutable credentials**: Once created, credentials cannot be modified
- **Cryptographic hashes**: Document integrity verification
- **Blockchain audit trail**: All operations recorded on-chain

### Privacy
- **Selective disclosure**: Users control credential sharing
- **Decentralized storage**: No central authority controls data
- **Internet Identity**: Privacy-preserving authentication

## 📊 Data Types

### User
```motoko
type User = {
  id: Principal;
  role: UserRole;
  email: Text;
  organizationName: ?Text;
  verificationStatus: VerificationStatus;
  documentsSubmitted: [Text];
  createdAt: Time.Time;
  updatedAt: Time.Time;
};
```

### Credential
```motoko
type Credential = {
  id: Text;
  tokenId: Text;
  credentialType: CredentialType;
  title: Text;
  description: Text;
  issuer: Principal;
  recipient: Text;
  recipientName: Text;
  issuedAt: Time.Time;
  expiresAt: ?Time.Time;
  metadata: [(Text, Text)];
  documentHash: ?Text;
  isRevoked: Bool;
  blockchainTxId: ?Text;
};
```

## 🧪 Testing

### Setup Verification
```bash
./scripts/verify-setup.sh
```

### Complete Workflow Test
```bash
./scripts/test-verification.sh
```

### Manual Testing Scenarios

1. **User Registration Flow**
   - Register as individual user
   - Register as educational institution
   - Submit verification documents
   - Admin approval process

2. **Credential Creation**
   - Create academic credential
   - Create professional certificate
   - Add metadata and expiration
   - Verify NFT minting

3. **Verification Process**
   - Submit verification request
   - Admin review workflow
   - Status updates
   - Document validation

## 🚀 Production Considerations

### Cycles Management
- Monitor canister cycle consumption
- Set up automatic top-up for production
- Optimize code for cycle efficiency

### Scalability
- Consider canister splitting for large datasets
- Implement pagination for large queries
- Use stable memory for persistent storage

### Monitoring
- Set up canister monitoring
- Track error rates and performance
- Monitor storage usage

## 🛠️ Development Tools

### Scripts
- `./scripts/deploy.sh` - Deploy all canisters
- `./scripts/verify-setup.sh` - Verify installation
- `./scripts/test-verification.sh` - Test complete workflow

### Environment Variables
```bash
# Local Development
NEXT_PUBLIC_DFX_NETWORK="local"
NEXT_PUBLIC_IC_HOST="http://localhost:4943"

# Production
NEXT_PUBLIC_DFX_NETWORK="ic"
NEXT_PUBLIC_IC_HOST="https://ic0.app"

# Canister IDs (auto-generated)
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID="..."
NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID="..."
NEXT_PUBLIC_VERIFICATION_CANISTER_ID="..."
NEXT_PUBLIC_STORAGE_CANISTER_ID="..."
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID="..."
```

## 🔄 Workflow Examples

### Complete University-Student Scenario

1. **University Registration**
   ```bash
   dfx identity new university
   dfx identity use university
   dfx canister call user_management registerUser '("admin@university.edu", variant { Educational }, opt "University Name")'
   ```

2. **Admin Approval**
   ```bash
   dfx identity use default
   dfx canister call user_management updateVerificationStatus "(principal \"$UNIVERSITY_PRINCIPAL\", variant { Approved })"
   ```

3. **Student Registration**
   ```bash
   dfx identity new student
   dfx identity use student
   dfx canister call user_management registerUser '("student@email.com", variant { Individual }, null)'
   ```

4. **Credential Issuance**
   ```bash
   dfx identity use university
   dfx canister call credential_nft createCredential '(variant { Academic }, "Degree Title", "Description", "student@email.com", "Student Name", null, [], null)'
   ```

## 📚 Additional Resources

- [Internet Computer Documentation](https://internetcomputer.org/docs)
- [Motoko Programming Language](https://internetcomputer.org/docs/current/motoko/intro)
- [DFINITY SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Internet Identity](https://internetcomputer.org/internet-identity)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with `./scripts/test-verification.sh`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the decentralized future of credentials**
