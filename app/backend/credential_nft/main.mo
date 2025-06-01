import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
// import Random "mo:base/Random"; // Unused for now

import Types "../types/types";

actor CredentialNFT {
    type Credential = Types.Credential;
    type CredentialId = Types.CredentialId;
    type TokenId = Types.TokenId;
    type CredentialType = Types.CredentialType;
    type NFT = Types.NFT;
    type NFTMetadata = Types.NFTMetadata;
    type UserId = Types.UserId;
    type Result<T, E> = Types.Result<T, E>;
    type ApiError = Types.ApiError;
    type CredentialFilter = Types.CredentialFilter;

    // State
    private stable var credentialEntries : [(CredentialId, Credential)] = [];
    private stable var nftEntries : [(TokenId, NFT)] = [];
    private stable var tokenCounter : Nat = 0;

    private var credentials = HashMap.HashMap<CredentialId, Credential>(10, Text.equal, Text.hash);
    private var nfts = HashMap.HashMap<TokenId, NFT>(10, Text.equal, Text.hash);
    private var ownerTokens = HashMap.HashMap<Principal, [TokenId]>(10, Principal.equal, Principal.hash);

    // Reference to user management canister (will be set after deployment)
    // For local development, we'll skip the verification check
    // private let userManagement = actor("rrkah-fqaaa-aaaah-qcuha-cai") : actor {
    //     isVerifiedVerifier : (UserId) -> async Bool;
    // };

    // Generate unique token ID
    private func generateTokenId() : TokenId {
        tokenCounter += 1;
        "DRESUME-" # Nat.toText(tokenCounter)
    };

    // Generate credential ID
    private func generateCredentialId(credentialType: CredentialType) : CredentialId {
        let typePrefix = switch(credentialType) {
            case (#Academic) { "AC" };
            case (#Professional) { "PR" };
            case (#WorkExperience) { "WE" };
            case (#Certification) { "CE" };
            case (#Achievement) { "AC" };
            case (#Skill) { "SK" };
            case (#Other(_)) { "OT" };
        };

        let timestamp = Time.now();
        typePrefix # "-" # Nat.toText(Int.abs(timestamp))
    };

    // Create credential and mint NFT
    public shared(msg) func createCredential(
        credentialType: CredentialType,
        title: Text,
        description: Text,
        recipient: Text,
        recipientName: Text,
        expiresAt: ?Time.Time,
        metadata: [(Text, Text)],
        documentHash: ?Text
    ) : async Result<(Credential, NFT), ApiError> {
        let issuer = msg.caller;

        // Check if issuer is verified verifier
        // For local development, we'll skip this check
        // let isVerified = await userManagement.isVerifiedVerifier(issuer);
        // if (not isVerified) {
        //     return #Err(#Unauthorized);
        // };

        let now = Time.now();
        let credentialId = generateCredentialId(credentialType);
        let tokenId = generateTokenId();

        // Create credential
        let credential : Credential = {
            id = credentialId;
            tokenId = tokenId;
            credentialType = credentialType;
            title = title;
            description = description;
            issuer = issuer;
            recipient = recipient;
            recipientName = recipientName;
            issuedAt = now;
            expiresAt = expiresAt;
            metadata = metadata;
            documentHash = documentHash;
            isRevoked = false;
            blockchainTxId = ?tokenId; // Using tokenId as blockchain reference
        };

        // Create NFT metadata
        let nftMetadata : NFTMetadata = {
            name = "dResume Credential: " # title;
            description = description;
            image = "https://dresume.app/api/credential/" # credentialId # "/image";
            attributes = Array.append([
                ("Credential Type", debug_show(credentialType)),
                ("Issuer", Principal.toText(issuer)),
                ("Recipient", recipientName),
                ("Issue Date", Nat.toText(Int.abs(now))),
                ("Credential ID", credentialId)
            ], metadata);
            credentialId = credentialId;
            issuer = Principal.toText(issuer);
            recipient = recipientName;
            issuedAt = now;
        };

        // Create NFT (initially owned by issuer, can be transferred to recipient)
        let nft : NFT = {
            tokenId = tokenId;
            owner = issuer; // Initially owned by issuer
            metadata = nftMetadata;
            createdAt = now;
        };

        // Store credential and NFT
        credentials.put(credentialId, credential);
        nfts.put(tokenId, nft);

        // Update owner tokens
        let currentTokens = Option.get(ownerTokens.get(issuer), []);
        ownerTokens.put(issuer, Array.append(currentTokens, [tokenId]));

        #Ok((credential, nft))
    };

    // Get credential by ID
    public query func getCredential(credentialId: CredentialId) : async Result<Credential, ApiError> {
        switch (credentials.get(credentialId)) {
            case (?credential) { #Ok(credential) };
            case null { #Err(#NotFound) };
        }
    };

    // Get credential by token ID
    public query func getCredentialByToken(tokenId: TokenId) : async Result<Credential, ApiError> {
        // Find credential with matching tokenId
        let credentialArray = Iter.toArray(credentials.vals());
        switch (Array.find(credentialArray, func(c: Credential) : Bool { c.tokenId == tokenId })) {
            case (?credential) { #Ok(credential) };
            case null { #Err(#NotFound) };
        }
    };

    // Get NFT by token ID
    public query func getNFT(tokenId: TokenId) : async Result<NFT, ApiError> {
        switch (nfts.get(tokenId)) {
            case (?nft) { #Ok(nft) };
            case null { #Err(#NotFound) };
        }
    };

    // Get credentials by issuer
    public query func getCredentialsByIssuer(issuer: UserId) : async [Credential] {
        let credentialArray = Iter.toArray(credentials.vals());
        Array.filter(credentialArray, func(c: Credential) : Bool {
            Principal.equal(c.issuer, issuer) and not c.isRevoked
        })
    };

    // Get credentials by recipient
    public query func getCredentialsByRecipient(recipient: Text) : async [Credential] {
        let credentialArray = Iter.toArray(credentials.vals());
        Array.filter(credentialArray, func(c: Credential) : Bool {
            c.recipient == recipient and not c.isRevoked
        })
    };

    // Search credentials with filters
    public query func searchCredentials(filter: CredentialFilter) : async [Credential] {
        let credentialArray = Iter.toArray(credentials.vals());
        Array.filter(credentialArray, func(c: Credential) : Bool {
            let typeMatch = switch(filter.credentialType) {
                case (?cType) { c.credentialType == cType };
                case null { true };
            };

            let issuerMatch = switch(filter.issuer) {
                case (?issuer) { Principal.equal(c.issuer, issuer) };
                case null { true };
            };

            let recipientMatch = switch(filter.recipient) {
                case (?recipient) { c.recipient == recipient };
                case null { true };
            };

            let revokedMatch = switch(filter.isRevoked) {
                case (?revoked) { c.isRevoked == revoked };
                case null { true };
            };

            let dateMatch = switch(filter.fromDate, filter.toDate) {
                case (?from, ?to) { c.issuedAt >= from and c.issuedAt <= to };
                case (?from, null) { c.issuedAt >= from };
                case (null, ?to) { c.issuedAt <= to };
                case (null, null) { true };
            };

            typeMatch and issuerMatch and recipientMatch and revokedMatch and dateMatch
        })
    };

    // Revoke credential
    public shared(msg) func revokeCredential(credentialId: CredentialId) : async Result<Credential, ApiError> {
        switch (credentials.get(credentialId)) {
            case null { return #Err(#NotFound) };
            case (?credential) {
                // Only issuer can revoke
                if (not Principal.equal(credential.issuer, msg.caller)) {
                    return #Err(#Unauthorized);
                };

                let revokedCredential : Credential = {
                    id = credential.id;
                    tokenId = credential.tokenId;
                    credentialType = credential.credentialType;
                    title = credential.title;
                    description = credential.description;
                    issuer = credential.issuer;
                    recipient = credential.recipient;
                    recipientName = credential.recipientName;
                    issuedAt = credential.issuedAt;
                    expiresAt = credential.expiresAt;
                    metadata = credential.metadata;
                    documentHash = credential.documentHash;
                    isRevoked = true;
                    blockchainTxId = credential.blockchainTxId;
                };

                credentials.put(credentialId, revokedCredential);
                #Ok(revokedCredential)
            };
        }
    };

    // Transfer NFT ownership
    public shared(msg) func transferNFT(tokenId: TokenId, to: Principal) : async Result<NFT, ApiError> {
        switch (nfts.get(tokenId)) {
            case null { return #Err(#NotFound) };
            case (?nft) {
                // Only current owner can transfer
                if (not Principal.equal(nft.owner, msg.caller)) {
                    return #Err(#Unauthorized);
                };

                let updatedNFT : NFT = {
                    tokenId = nft.tokenId;
                    owner = to;
                    metadata = nft.metadata;
                    createdAt = nft.createdAt;
                };

                nfts.put(tokenId, updatedNFT);

                // Update owner tokens
                let currentOwnerTokens = Option.get(ownerTokens.get(msg.caller), []);
                let newOwnerTokens = Option.get(ownerTokens.get(to), []);

                ownerTokens.put(msg.caller, Array.filter(currentOwnerTokens, func(t: TokenId) : Bool { t != tokenId }));
                ownerTokens.put(to, Array.append(newOwnerTokens, [tokenId]));

                #Ok(updatedNFT)
            };
        }
    };

    // Get tokens owned by user
    public query func getOwnedTokens(owner: Principal) : async [TokenId] {
        Option.get(ownerTokens.get(owner), [])
    };

    // Get all credentials (for admin/analytics)
    public query func getAllCredentials() : async [Credential] {
        Iter.toArray(credentials.vals())
    };

    // System functions
    system func preupgrade() {
        credentialEntries := Iter.toArray(credentials.entries());
        nftEntries := Iter.toArray(nfts.entries());
    };

    system func postupgrade() {
        credentials := HashMap.fromIter(credentialEntries.vals(), credentialEntries.size(), Text.equal, Text.hash);
        nfts := HashMap.fromIter(nftEntries.vals(), nftEntries.size(), Text.equal, Text.hash);
        credentialEntries := [];
        nftEntries := [];

        // Rebuild owner tokens mapping
        for ((tokenId, nft) in nfts.entries()) {
            let currentTokens = Option.get(ownerTokens.get(nft.owner), []);
            ownerTokens.put(nft.owner, Array.append(currentTokens, [tokenId]));
        };
    };
}
