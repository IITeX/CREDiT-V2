import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Option "mo:base/Option";

import Types "../types/types";

actor UserManagement {
    type User = Types.User;
    type UserId = Types.UserId;
    type UserRole = Types.UserRole;
    type VerificationStatus = Types.VerificationStatus;
    type Result<T, E> = Types.Result<T, E>;
    type ApiError = Types.ApiError;
    type UserFilter = Types.UserFilter;

    // State
    private stable var userEntries : [(UserId, User)] = [];
    private var users = HashMap.HashMap<UserId, User>(10, Principal.equal, Principal.hash);

    // Admin principals (can approve verifiers)
    private stable var adminPrincipals : [Principal] = [];

    // Initialize with admin principals
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

    // Helper functions
    private func isAdmin(principal: Principal) : Bool {
        Array.find(adminPrincipals, func(p: Principal) : Bool { Principal.equal(p, principal) }) != null
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
    public query func getUser(userId: UserId) : async Result<User, ApiError> {
        switch (users.get(userId)) {
            case (?user) { #Ok(user) };
            case null { #Err(#NotFound) };
        }
    };

    // Get current user profile
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
            case null { return #Err(#NotFound) };
            case (?user) {
                let updatedUser : User = {
                    id = user.id;
                    role = user.role;
                    email = Option.get(email, user.email);
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

    // Admin function: Approve/Reject verifier
    public shared(msg) func updateVerificationStatus(
        userId: UserId,
        status: VerificationStatus
    ) : async Result<User, ApiError> {
        if (not isAdmin(msg.caller)) {
            return #Err(#Unauthorized);
        };

        switch (users.get(userId)) {
            case null { return #Err(#NotFound) };
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

    // System functions
    system func preupgrade() {
        userEntries := Iter.toArray(users.entries());
    };

    system func postupgrade() {
        users := HashMap.fromIter(userEntries.vals(), userEntries.size(), Principal.equal, Principal.hash);
        userEntries := [];
    };
}
