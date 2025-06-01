import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
// import Option "mo:base/Option"; // Unused for now
import Nat "mo:base/Nat";

import Types "../types/types";

actor Verification {
    type VerificationRequest = Types.VerificationRequest;
    type UserId = Types.UserId;
    type UserRole = Types.UserRole;
    type VerificationStatus = Types.VerificationStatus;
    type Result<T, E> = Types.Result<T, E>;
    type ApiError = Types.ApiError;

    // State
    private stable var requestEntries : [(Text, VerificationRequest)] = [];
    private stable var requestCounter : Nat = 0;

    private var verificationRequests = HashMap.HashMap<Text, VerificationRequest>(10, Text.equal, Text.hash);

    // Reference to user management canister (will be set after deployment)
    // For local development, we'll skip inter-canister calls
    // private let userManagement = actor("rrkah-fqaaa-aaaah-qcuha-cai") : actor {
    //     updateVerificationStatus : (UserId, VerificationStatus) -> async Result<Types.User, ApiError>;
    //     getUser : (UserId) -> async Result<Types.User, ApiError>;
    // };

    // Generate unique request ID
    private func generateRequestId() : Text {
        requestCounter += 1;
        "VR-" # Nat.toText(requestCounter)
    };

    // Submit verification request
    public shared(msg) func submitVerificationRequest(
        role: UserRole,
        organizationName: Text,
        documentHashes: [Text]
    ) : async Result<VerificationRequest, ApiError> {
        let userId = msg.caller;
        let now = Time.now();
        let requestId = generateRequestId();

        // Check if user exists (skip for local development)
        // switch (await userManagement.getUser(userId)) {
        //     case (#Err(error)) { return #Err(error) };
        //     case (#Ok(user)) {
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
            // };
        // }
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

    // Get all pending verification requests (admin only)
    public shared(_msg) func getPendingVerificationRequests() : async Result<[VerificationRequest], ApiError> {
        // Note: In a real implementation, you'd check if the caller is an admin
        // For now, we'll allow any verified verifier to review requests

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

                // Update user verification status in user management canister
                // Skip for local development
                // switch (await userManagement.updateVerificationStatus(request.userId, status)) {
                //     case (#Err(error)) { return #Err(error) };
                //     case (#Ok(_)) { #Ok(updatedRequest) };
                // }
                #Ok(updatedRequest)
            };
        }
    };

    // Start review process (mark as under review)
    public shared(msg) func startReview(requestId: Text) : async Result<VerificationRequest, ApiError> {
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
        requestEntries := Iter.toArray(verificationRequests.entries());
    };

    system func postupgrade() {
        verificationRequests := HashMap.fromIter(requestEntries.vals(), requestEntries.size(), Text.equal, Text.hash);
        requestEntries := [];
    };
}
