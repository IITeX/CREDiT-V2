import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Int "mo:base/Int";

import Types "../types/types";

actor Storage {
    type DocumentMetadata = Types.DocumentMetadata;
    type UserId = Types.UserId;
    type User = Types.User;
    type UserRole = Types.UserRole;
    type VerificationStatus = Types.VerificationStatus;
    type VerificationRequest = Types.VerificationRequest;
    type CredentialVerificationRequest = Types.CredentialVerificationRequest;
    type UserFilter = Types.UserFilter;
    type Result<T, E> = Types.Result<T, E>;
    type ApiError = Types.ApiError;

    // Document storage
    private stable var documentEntries : [(Text, DocumentMetadata)] = [];
    private stable var fileEntries : [(Text, [Nat8])] = [];

    private var documents = HashMap.HashMap<Text, DocumentMetadata>(10, Text.equal, Text.hash);
    private var files = HashMap.HashMap<Text, [Nat8]>(10, Text.equal, Text.hash);

    // User management storage
    private stable var userEntries : [(UserId, User)] = [];
    private stable var verificationEntries : [(Text, VerificationRequest)] = [];
    private stable var credentialVerificationEntries : [(Text, CredentialVerificationRequest)] = [];

    private var users = HashMap.HashMap<UserId, User>(10, Principal.equal, Principal.hash);
    private var verificationRequests = HashMap.HashMap<Text, VerificationRequest>(10, Text.equal, Text.hash);
    private var credentialVerificationRequests = HashMap.HashMap<Text, CredentialVerificationRequest>(10, Text.equal, Text.hash);

    // Admin principals (can be updated via upgrade)
    private stable var adminPrincipals : [Principal] = [
        Principal.fromText("g5pqo-7ihb2-4vqek-pou4f-pauhm-tfylr-qcvnb-f5fnp-lfjs5-i7xtv-pae") // Your dfx identity
    ];

    // Verification request counter
    private stable var requestCounter : Nat = 0;

    // Maximum file size (10MB)
    private let MAX_FILE_SIZE : Nat = 10 * 1024 * 1024;

    // Allowed file types
    private let ALLOWED_TYPES = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    // Generate file hash (simple implementation)
    private func generateHash(content: [Nat8]) : Text {
        let size = content.size();
        let timestamp = Time.now();
        "HASH-" # Nat.toText(size) # "-" # Nat.toText(Int.abs(timestamp))
    };

    // Check if file type is allowed
    private func isAllowedFileType(contentType: Text) : Bool {
        Array.find(ALLOWED_TYPES, func(t: Text) : Bool { t == contentType }) != null
    };

    // Upload document
    public shared(msg) func uploadDocument(
        filename: Text,
        contentType: Text,
        content: [Nat8]
    ) : async Result<DocumentMetadata, ApiError> {
        let uploader = msg.caller;

        // Check file size
        if (content.size() > MAX_FILE_SIZE) {
            return #Err(#InvalidInput("File size exceeds maximum limit of 10MB"));
        };

        // Check file type
        if (not isAllowedFileType(contentType)) {
            return #Err(#InvalidInput("File type not allowed"));
        };

        let hash = generateHash(content);
        let now = Time.now();

        // Check if file already exists
        switch (documents.get(hash)) {
            case (?existingDoc) { return #Ok(existingDoc) };
            case null {};
        };

        let metadata : DocumentMetadata = {
            hash = hash;
            filename = filename;
            contentType = contentType;
            size = content.size();
            uploadedBy = uploader;
            uploadedAt = now;
        };

        // Store file and metadata
        documents.put(hash, metadata);
        files.put(hash, content);

        #Ok(metadata)
    };

    // Get document metadata
    public query func getDocumentMetadata(hash: Text) : async Result<DocumentMetadata, ApiError> {
        switch (documents.get(hash)) {
            case (?metadata) { #Ok(metadata) };
            case null { #Err(#NotFound) };
        }
    };

    // Download document
    public query func downloadDocument(hash: Text) : async Result<[Nat8], ApiError> {
        switch (files.get(hash)) {
            case (?content) { #Ok(content) };
            case null { #Err(#NotFound) };
        }
    };

    // Get document with metadata
    public query func getDocument(hash: Text) : async Result<{metadata: DocumentMetadata; content: [Nat8]}, ApiError> {
        switch (documents.get(hash), files.get(hash)) {
            case (?metadata, ?content) {
                #Ok({metadata = metadata; content = content})
            };
            case (_, _) { #Err(#NotFound) };
        }
    };

    // Get documents uploaded by user
    public shared(msg) func getMyDocuments() : async [DocumentMetadata] {
        let userId = msg.caller;
        let allDocs = Iter.toArray(documents.vals());
        Array.filter(allDocs, func(doc: DocumentMetadata) : Bool {
            Principal.equal(doc.uploadedBy, userId)
        })
    };

    // Get documents by user (admin function)
    public query func getDocumentsByUser(userId: UserId) : async [DocumentMetadata] {
        let allDocs = Iter.toArray(documents.vals());
        Array.filter(allDocs, func(doc: DocumentMetadata) : Bool {
            Principal.equal(doc.uploadedBy, userId)
        })
    };

    // Delete document
    public shared(msg) func deleteDocument(hash: Text) : async Result<(), ApiError> {
        switch (documents.get(hash)) {
            case null { return #Err(#NotFound) };
            case (?metadata) {
                // Only uploader can delete
                if (not Principal.equal(metadata.uploadedBy, msg.caller)) {
                    return #Err(#Unauthorized);
                };

                documents.delete(hash);
                files.delete(hash);
                #Ok(())
            };
        }
    };

    // Get storage statistics
    public query func getStorageStats() : async {
        totalDocuments: Nat;
        totalSize: Nat;
        averageSize: Nat;
    } {
        let allDocs = Iter.toArray(documents.vals());
        let totalDocuments = allDocs.size();

        var totalSize = 0;
        for (doc in allDocs.vals()) {
            totalSize += doc.size;
        };

        let averageSize = if (totalDocuments > 0) { totalSize / totalDocuments } else { 0 };

        {
            totalDocuments = totalDocuments;
            totalSize = totalSize;
            averageSize = averageSize;
        }
    };

    // Check if document exists
    public query func documentExists(hash: Text) : async Bool {
        switch (documents.get(hash)) {
            case (?_) { true };
            case null { false };
        }
    };

    // Get file info without content
    public query func getFileInfo(hash: Text) : async Result<{
        filename: Text;
        contentType: Text;
        size: Nat;
        uploadedAt: Time.Time;
    }, ApiError> {
        switch (documents.get(hash)) {
            case (?metadata) {
                #Ok({
                    filename = metadata.filename;
                    contentType = metadata.contentType;
                    size = metadata.size;
                    uploadedAt = metadata.uploadedAt;
                })
            };
            case null { #Err(#NotFound) };
        }
    };

    // Batch upload documents
    public shared(msg) func batchUploadDocuments(
        uploads: [{filename: Text; contentType: Text; content: [Nat8]}]
    ) : async Result<[DocumentMetadata], ApiError> {
        let uploader = msg.caller;
        var results : [DocumentMetadata] = [];

        for (upload in uploads.vals()) {
            // Check individual file constraints
            if (upload.content.size() > MAX_FILE_SIZE) {
                return #Err(#InvalidInput("File " # upload.filename # " exceeds size limit"));
            };

            if (not isAllowedFileType(upload.contentType)) {
                return #Err(#InvalidInput("File type not allowed for " # upload.filename));
            };

            let hash = generateHash(upload.content);
            let now = Time.now();

            let metadata : DocumentMetadata = {
                hash = hash;
                filename = upload.filename;
                contentType = upload.contentType;
                size = upload.content.size();
                uploadedBy = uploader;
                uploadedAt = now;
            };

            documents.put(hash, metadata);
            files.put(hash, upload.content);
            results := Array.append(results, [metadata]);
        };

        #Ok(results)
    };

    // Get recent documents
    public query func getRecentDocuments(limit: Nat) : async [DocumentMetadata] {
        let allDocs = Iter.toArray(documents.vals());
        let sortedDocs = Array.sort(allDocs, func(a: DocumentMetadata, b: DocumentMetadata) : {#less; #equal; #greater} {
            if (a.uploadedAt > b.uploadedAt) { #less }
            else if (a.uploadedAt < b.uploadedAt) { #greater }
            else { #equal }
        });

        if (sortedDocs.size() <= limit) {
            sortedDocs
        } else {
            Array.subArray(sortedDocs, 0, limit)
        }
    };

    // Get canister name
    public query func getName() : async Text {
        "Storage"
    };

    // ============ USER MANAGEMENT FUNCTIONS ============

    // Helper functions
    private func isAdmin(principal: Principal) : Bool {
        Array.find(adminPrincipals, func(p: Principal) : Bool { Principal.equal(p, principal) }) != null
    };

    // Admin management functions
    public shared(msg) func addAdmin(admin: Principal) : async Result<(), ApiError> {
        let caller = msg.caller;
        // Allow initial setup when no admins exist, or only existing admins can add new admins
        if (Array.size(adminPrincipals) > 0 and not isAdmin(caller)) {
            return #Err(#Unauthorized);
        };

        // Check if admin already exists
        if (isAdmin(admin)) {
            return #Err(#AlreadyExists);
        };

        adminPrincipals := Array.append(adminPrincipals, [admin]);
        #Ok(())
    };

    // Get list of admins (for debugging)
    public query func getAdmins() : async [Principal] {
        adminPrincipals
    };

    // Check if a principal is an admin
    public query func isAdminPrincipal(principal: Principal) : async Bool {
        isAdmin(principal)
    };

    // User registration
    public shared(msg) func registerUser(
        email: Text,
        role: UserRole,
        organizationName: ?Text
    ) : async Result<User, ApiError> {
        let userId = msg.caller;

        // Check if user already exists
        switch (users.get(userId)) {
            case (?_existingUser) { return #Err(#AlreadyExists) };
            case null {};
        };

        let now = Time.now();
        let user : User = {
            id = userId;
            role = role;
            email = email;
            organizationName = organizationName;
            verificationStatus = #Pending;
            documentsSubmitted = [];
            createdAt = now;
            updatedAt = now;
        };

        users.put(userId, user);
        #Ok(user)
    };

    // Get user profile
    public shared(msg) func getMyProfile() : async Result<User, ApiError> {
        let userId = msg.caller;
        switch (users.get(userId)) {
            case (?user) { #Ok(user) };
            case null { #Err(#NotFound) };
        }
    };

    // Update user profile
    public shared(msg) func updateProfile(
        email: ?Text,
        organizationName: ?Text
    ) : async Result<User, ApiError> {
        let userId = msg.caller;
        switch (users.get(userId)) {
            case null { #Err(#NotFound) };
            case (?user) {
                let updatedUser : User = {
                    id = user.id;
                    role = user.role;
                    email = switch(email) { case (?e) { e }; case null { user.email } };
                    organizationName = switch(organizationName) {
                        case (?name) { ?name };
                        case null { user.organizationName };
                    };
                    verificationStatus = user.verificationStatus;
                    documentsSubmitted = user.documentsSubmitted;
                    createdAt = user.createdAt;
                    updatedAt = Time.now();
                };
                users.put(userId, updatedUser);
                #Ok(updatedUser)
            };
        }
    };

    // Submit verification documents
    public shared(msg) func submitVerificationDocuments(
        documentHashes: [Text]
    ) : async Result<User, ApiError> {
        let userId = msg.caller;

        switch (users.get(userId)) {
            case null { return #Err(#NotFound) };
            case (?user) {
                let updatedUser : User = {
                    id = user.id;
                    role = user.role;
                    email = user.email;
                    organizationName = user.organizationName;
                    verificationStatus = #UnderReview;
                    documentsSubmitted = documentHashes;
                    createdAt = user.createdAt;
                    updatedAt = Time.now();
                };

                users.put(userId, updatedUser);
                #Ok(updatedUser)
            };
        }
    };

    // Get user by ID (admin function)
    public query func getUser(userId: UserId) : async Result<User, ApiError> {
        switch (users.get(userId)) {
            case (?user) { #Ok(user) };
            case null { #Err(#NotFound) };
        }
    };

    // Admin functions
    public shared(msg) func updateUserVerificationStatus(
        userId: UserId,
        status: VerificationStatus
    ) : async Result<User, ApiError> {
        if (not isAdmin(msg.caller)) {
            return #Err(#Unauthorized);
        };

        switch (users.get(userId)) {
            case null { #Err(#NotFound) };
            case (?user) {
                let updatedUser : User = {
                    id = user.id;
                    role = user.role;
                    email = user.email;
                    organizationName = user.organizationName;
                    verificationStatus = status;
                    documentsSubmitted = user.documentsSubmitted;
                    createdAt = user.createdAt;
                    updatedAt = Time.now();
                };
                users.put(userId, updatedUser);
                #Ok(updatedUser)
            };
        }
    };

    // Check if user is verified verifier
    public query func isVerifiedVerifier(userId: UserId) : async Bool {
        switch (users.get(userId)) {
            case (?user) {
                user.verificationStatus == #Approved and user.role != #Individual
            };
            case null { false };
        }
    };

    // Get all users (admin only)
    public shared(msg) func getAllUsers() : async Result<[User], ApiError> {
        if (not isAdmin(msg.caller)) {
            return #Err(#Unauthorized);
        };

        let userArray = Iter.toArray(users.vals());
        #Ok(userArray)
    };

    // Get verified issuers (for dropdown)
    public query func getVerifiedIssuers() : async [User] {
        let allUsers = Iter.toArray(users.vals());
        Array.filter(allUsers, func(user: User) : Bool {
            user.verificationStatus == #Approved and user.role != #Individual
        })
    };

    // Get users by filter (admin only)
    public shared(msg) func getUsersByFilter(filter: UserFilter) : async Result<[User], ApiError> {
        if (not isAdmin(msg.caller)) {
            return #Err(#Unauthorized);
        };

        let allUsers = Iter.toArray(users.vals());
        let filteredUsers = Array.filter(allUsers, func(user: User) : Bool {
            let roleMatch = switch(filter.role) {
                case (?role) { user.role == role };
                case null { true };
            };

            let statusMatch = switch(filter.verificationStatus) {
                case (?status) { user.verificationStatus == status };
                case null { true };
            };

            let orgMatch = switch(filter.organizationName) {
                case (?orgName) {
                    switch(user.organizationName) {
                        case (?userOrg) { Text.contains(userOrg, #text orgName) };
                        case null { false };
                    }
                };
                case null { true };
            };

            roleMatch and statusMatch and orgMatch
        });

        #Ok(filteredUsers)
    };

    // ============ VERIFICATION FUNCTIONS ============

    // Generate unique request ID
    private func generateRequestId() : Text {
        requestCounter += 1;
        "VR-" # Nat.toText(requestCounter)
    };

    // Submit verification request (from verification canister)
    public shared(msg) func submitVerificationRequest(
        role: UserRole,
        organizationName: Text,
        documentHashes: [Text]
    ) : async Result<VerificationRequest, ApiError> {
        let userId = msg.caller;
        let now = Time.now();
        let requestId = generateRequestId();

        // Check if user already has a pending request
        let existingRequests = Iter.toArray(verificationRequests.vals());
        let pendingRequest = Array.find(existingRequests, func(req: VerificationRequest) : Bool {
            Principal.equal(req.userId, userId) and (req.status == #Pending or req.status == #UnderReview)
        });

        switch (pendingRequest) {
            case (?_) { return #Err(#InvalidInput("User already has a pending verification request")) };
            case null {};
        };

        let request : VerificationRequest = {
            id = requestId;
            userId = userId;
            role = role;
            organizationName = organizationName;
            documents = documentHashes;
            submittedAt = now;
            status = #Pending;
            reviewedBy = null;
            reviewedAt = null;
            notes = null;
        };

        verificationRequests.put(requestId, request);
        #Ok(request)
    };

    // Get verification request by ID
    public query func getVerificationRequest(requestId: Text) : async Result<VerificationRequest, ApiError> {
        switch (verificationRequests.get(requestId)) {
            case (?request) { #Ok(request) };
            case null { #Err(#NotFound) };
        }
    };

    // Get verification requests by user
    public shared(msg) func getMyVerificationRequests() : async [VerificationRequest] {
        let userId = msg.caller;
        let allRequests = Iter.toArray(verificationRequests.vals());
        Array.filter(allRequests, func(req: VerificationRequest) : Bool {
            Principal.equal(req.userId, userId)
        })
    };

    // Create credential verification request
    public shared(msg) func createCredentialVerificationRequest(
        credentialId: Text,
        verifierEmail: Text,
        credentialTitle: Text,
        issuerName: Text
    ) : async Result<CredentialVerificationRequest, ApiError> {
        let requestId = credentialId # "-" # Nat.toText(Int.abs(Time.now()));
        let now = Time.now();

        let request : CredentialVerificationRequest = {
            id = requestId;
            credentialId = credentialId;
            requester = msg.caller;
            verifierEmail = verifierEmail;
            credentialTitle = credentialTitle;
            issuerName = issuerName;
            status = #Pending;
            createdAt = now;
            respondedAt = null;
            response = null;
        };

        credentialVerificationRequests.put(requestId, request);
        #Ok(request)
    };

    // Get all pending verification requests (admin only)
    public shared(msg) func getPendingVerificationRequests() : async Result<[VerificationRequest], ApiError> {
        if (not isAdmin(msg.caller)) {
            return #Err(#Unauthorized);
        };

        let allRequests = Iter.toArray(verificationRequests.vals());
        let pendingRequests = Array.filter(allRequests, func(req: VerificationRequest) : Bool {
            req.status == #Pending or req.status == #UnderReview
        });

        #Ok(pendingRequests)
    };

    // Review verification request (admin only)
    public shared(msg) func reviewVerificationRequest(
        requestId: Text,
        status: VerificationStatus,
        notes: ?Text
    ) : async Result<VerificationRequest, ApiError> {
        if (not isAdmin(msg.caller)) {
            return #Err(#Unauthorized);
        };

        let reviewerId = msg.caller;

        switch (verificationRequests.get(requestId)) {
            case null { return #Err(#NotFound) };
            case (?request) {
                if (request.status != #Pending and request.status != #UnderReview) {
                    return #Err(#InvalidInput("Request has already been reviewed"));
                };

                let now = Time.now();
                let updatedRequest : VerificationRequest = {
                    id = request.id;
                    userId = request.userId;
                    role = request.role;
                    organizationName = request.organizationName;
                    documents = request.documents;
                    submittedAt = request.submittedAt;
                    status = status;
                    reviewedBy = ?reviewerId;
                    reviewedAt = ?now;
                    notes = notes;
                };

                verificationRequests.put(requestId, updatedRequest);
                #Ok(updatedRequest)
            };
        }
    };

    // Start review process (mark as under review)
    public shared(msg) func startReview(requestId: Text) : async Result<VerificationRequest, ApiError> {
        if (not isAdmin(msg.caller)) {
            return #Err(#Unauthorized);
        };

        let reviewerId = msg.caller;

        switch (verificationRequests.get(requestId)) {
            case null { return #Err(#NotFound) };
            case (?request) {
                if (request.status != #Pending) {
                    return #Err(#InvalidInput("Request is not in pending status"));
                };

                let updatedRequest : VerificationRequest = {
                    id = request.id;
                    userId = request.userId;
                    role = request.role;
                    organizationName = request.organizationName;
                    documents = request.documents;
                    submittedAt = request.submittedAt;
                    status = #UnderReview;
                    reviewedBy = ?reviewerId;
                    reviewedAt = ?Time.now();
                    notes = request.notes;
                };

                verificationRequests.put(requestId, updatedRequest);
                #Ok(updatedRequest)
            };
        }
    };

    // Get verification statistics
    public query func getVerificationStats() : async {
        total: Nat;
        pending: Nat;
        underReview: Nat;
        approved: Nat;
        rejected: Nat;
    } {
        let allRequests = Iter.toArray(verificationRequests.vals());
        let total = allRequests.size();

        var pending = 0;
        var underReview = 0;
        var approved = 0;
        var rejected = 0;

        for (request in allRequests.vals()) {
            switch (request.status) {
                case (#Pending) { pending += 1 };
                case (#UnderReview) { underReview += 1 };
                case (#Approved) { approved += 1 };
                case (#Rejected) { rejected += 1 };
            };
        };

        {
            total = total;
            pending = pending;
            underReview = underReview;
            approved = approved;
            rejected = rejected;
        }
    };

    // Get verification requests by status
    public query func getVerificationRequestsByStatus(status: VerificationStatus) : async [VerificationRequest] {
        let allRequests = Iter.toArray(verificationRequests.vals());
        Array.filter(allRequests, func(req: VerificationRequest) : Bool {
            req.status == status
        })
    };

    // Get verification requests by role
    public query func getVerificationRequestsByRole(role: UserRole) : async [VerificationRequest] {
        let allRequests = Iter.toArray(verificationRequests.vals());
        Array.filter(allRequests, func(req: VerificationRequest) : Bool {
            req.role == role
        })
    };

    // Cancel verification request (user can cancel their own pending request)
    public shared(msg) func cancelVerificationRequest(requestId: Text) : async Result<VerificationRequest, ApiError> {
        let userId = msg.caller;

        switch (verificationRequests.get(requestId)) {
            case null { return #Err(#NotFound) };
            case (?request) {
                if (not Principal.equal(request.userId, userId)) {
                    return #Err(#Unauthorized);
                };

                if (request.status != #Pending) {
                    return #Err(#InvalidInput("Can only cancel pending requests"));
                };

                let cancelledRequest : VerificationRequest = {
                    id = request.id;
                    userId = request.userId;
                    role = request.role;
                    organizationName = request.organizationName;
                    documents = request.documents;
                    submittedAt = request.submittedAt;
                    status = #Rejected;
                    reviewedBy = ?userId;
                    reviewedAt = ?Time.now();
                    notes = ?"Cancelled by user";
                };

                verificationRequests.put(requestId, cancelledRequest);
                #Ok(cancelledRequest)
            };
        }
    };

    // System functions
    system func preupgrade() {
        documentEntries := Iter.toArray(documents.entries());
        fileEntries := Iter.toArray(files.entries());
        userEntries := Iter.toArray(users.entries());
        verificationEntries := Iter.toArray(verificationRequests.entries());
        credentialVerificationEntries := Iter.toArray(credentialVerificationRequests.entries());
    };

    system func postupgrade() {
        documents := HashMap.fromIter(documentEntries.vals(), documentEntries.size(), Text.equal, Text.hash);
        files := HashMap.fromIter(fileEntries.vals(), fileEntries.size(), Text.equal, Text.hash);
        users := HashMap.fromIter(userEntries.vals(), userEntries.size(), Principal.equal, Principal.hash);
        verificationRequests := HashMap.fromIter(verificationEntries.vals(), verificationEntries.size(), Text.equal, Text.hash);
        credentialVerificationRequests := HashMap.fromIter(credentialVerificationEntries.vals(), credentialVerificationEntries.size(), Text.equal, Text.hash);

        documentEntries := [];
        fileEntries := [];
        userEntries := [];
        verificationEntries := [];
        credentialVerificationEntries := [];
    };
}
