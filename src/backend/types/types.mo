import Time "mo:base/Time";
import Principal "mo:base/Principal";

module {
    // User Types
    public type UserId = Principal;
    
    public type UserRole = {
        #Individual;
        #Educational;
        #Company;
        #CertificationBody;
        #NGO;
        #Platform;
    };
    
    public type VerificationStatus = {
        #Pending;
        #Approved;
        #Rejected;
        #UnderReview;
    };
    
    public type User = {
        id: UserId;
        role: UserRole;
        email: Text;
        organizationName: ?Text;
        verificationStatus: VerificationStatus;
        documentsSubmitted: [Text]; // Document hashes
        createdAt: Time.Time;
        updatedAt: Time.Time;
    };
    
    // Credential Types
    public type CredentialId = Text;
    public type TokenId = Text;
    
    public type CredentialType = {
        #Academic;
        #Professional;
        #WorkExperience;
        #Certification;
        #Achievement;
        #Skill;
        #Other: Text;
    };
    
    public type Credential = {
        id: CredentialId;
        tokenId: TokenId;
        credentialType: CredentialType;
        title: Text;
        description: Text;
        issuer: UserId;
        recipient: Text; // Email or identifier
        recipientName: Text;
        issuedAt: Time.Time;
        expiresAt: ?Time.Time;
        metadata: [(Text, Text)]; // Key-value pairs
        documentHash: ?Text;
        isRevoked: Bool;
        blockchainTxId: ?Text;
    };
    
    // NFT Types
    public type NFTMetadata = {
        name: Text;
        description: Text;
        image: Text;
        attributes: [(Text, Text)];
        credentialId: CredentialId;
        issuer: Text;
        recipient: Text;
        issuedAt: Time.Time;
    };
    
    public type NFT = {
        tokenId: TokenId;
        owner: Principal;
        metadata: NFTMetadata;
        createdAt: Time.Time;
    };
    
    // Verification Types
    public type VerificationRequest = {
        id: Text;
        userId: UserId;
        role: UserRole;
        organizationName: Text;
        documents: [Text]; // Document hashes
        submittedAt: Time.Time;
        status: VerificationStatus;
        reviewedBy: ?UserId;
        reviewedAt: ?Time.Time;
        notes: ?Text;
    };
    
    // Storage Types
    public type DocumentMetadata = {
        hash: Text;
        filename: Text;
        contentType: Text;
        size: Nat;
        uploadedBy: UserId;
        uploadedAt: Time.Time;
    };
    
    // API Response Types
    public type Result<T, E> = {
        #Ok: T;
        #Err: E;
    };
    
    public type ApiError = {
        #NotFound;
        #Unauthorized;
        #InvalidInput: Text;
        #InternalError: Text;
        #AlreadyExists;
    };
    
    // Search and Filter Types
    public type CredentialFilter = {
        credentialType: ?CredentialType;
        issuer: ?UserId;
        recipient: ?Text;
        isRevoked: ?Bool;
        fromDate: ?Time.Time;
        toDate: ?Time.Time;
    };
    
    public type UserFilter = {
        role: ?UserRole;
        verificationStatus: ?VerificationStatus;
        organizationName: ?Text;
    };
}
