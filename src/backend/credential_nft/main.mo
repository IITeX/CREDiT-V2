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

    // Generate unique token ID
    private func generateTokenId() : TokenId {
        tokenCounter += 1;
        "CREDiT-" # Nat.toText(tokenCounter)
    };

    // Generate issuer-specific token ID (for verified issuers)
    private func generateIssuerTokenId(issuerRole: Text) : TokenId {
        tokenCounter += 1;
        let year = "2025"; // Could be dynamic based on current year
        let sequence = Nat.toText(tokenCounter);
        let paddedSequence = if (sequence.size() == 1) { "00" # sequence }
                           else if (sequence.size() == 2) { "0" # sequence }
                           else { sequence };

        let prefix = switch(issuerRole) {
            case ("Educational") { "ED" };
            case ("Company") { "CO" };
            case ("CertificationBody") { "CB" };
            case ("NGO") { "NG" };
            case ("Platform") { "PL" };
            case (_) { "TK" };
        };

        prefix # "-" # year # "-" # paddedSequence
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

    // Create Soul Bound Token (SBT) for verified issuers
    public shared(msg) func createSoulBoundToken(
        credentialType: CredentialType,
        title: Text,
        description: Text,
        recipient: Text,
        recipientName: Text,
        issuerRole: Text,
        expiresAt: ?Time.Time,
        metadata: [(Text, Text)],
        documentHash: ?Text
    ) : async Result<(Credential, NFT), ApiError> {
        let issuer = msg.caller;

        // TODO: Verify that issuer is a verified issuer
        // This should check against the storage canister

        let now = Time.now();
        let credentialId = generateCredentialId(credentialType);
        let tokenId = generateIssuerTokenId(issuerRole);

        // Create credential with SBT properties
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
            metadata = Array.append(metadata, [
                ("SBT", "true"),
                ("Issuer_Role", issuerRole),
                ("Non_Transferable", "true")
            ]);
            documentHash = documentHash;
            isRevoked = false;
            blockchainTxId = ?tokenId;
        };

        // Create SBT metadata
        let nftMetadata : NFTMetadata = {
            name = "dResume SBT: " # title;
            description = description # " (Soul Bound Token - Non-transferable)";
            image = "https://dresume.app/api/credential/" # credentialId # "/image";
            attributes = Array.append([
                ("Credential Type", debug_show(credentialType)),
                ("Issuer", Principal.toText(issuer)),
                ("Recipient", recipientName),
                ("Issue Date", Nat.toText(Int.abs(now))),
                ("Credential ID", credentialId),
                ("Token Type", "Soul Bound Token"),
                ("Transferable", "false"),
                ("Issuer Role", issuerRole)
            ], metadata);
            credentialId = credentialId;
            issuer = Principal.toText(issuer);
            recipient = recipientName;
            issuedAt = now;
        };

        // Create SBT (Soul Bound Token - non-transferable)
        let nft : NFT = {
            tokenId = tokenId;
            owner = issuer; // Initially owned by issuer
            metadata = nftMetadata;
            createdAt = now;
        };

        // Store credential and SBT
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
                case (?fromDate, ?toDate) { 
                    c.issuedAt >= fromDate and c.issuedAt <= toDate 
                };
                case (?fromDate, null) { c.issuedAt >= fromDate };
                case (null, ?toDate) { c.issuedAt <= toDate };
                case (null, null) { true };
            };

            typeMatch and issuerMatch and recipientMatch and revokedMatch and dateMatch
        })
    };

    // Revoke credential
    public shared(msg) func revokeCredential(credentialId: CredentialId) : async Result<Credential, ApiError> {
        let caller = msg.caller;

        switch (credentials.get(credentialId)) {
            case null { return #Err(#NotFound) };
            case (?credential) {
                // Only issuer can revoke
                if (not Principal.equal(credential.issuer, caller)) {
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

    // Check if token is Soul Bound Token (SBT)
    private func isSoulBoundToken(tokenId: TokenId) : Bool {
        switch (nfts.get(tokenId)) {
            case (?nft) {
                // Check if metadata contains SBT marker
                Array.find(nft.metadata.attributes, func((key, value): (Text, Text)) : Bool {
                    key == "Token Type" and value == "Soul Bound Token"
                }) != null
            };
            case null { false };
        }
    };

    // Transfer NFT ownership (blocked for SBTs)
    public shared(msg) func transferNFT(tokenId: TokenId, newOwner: Principal) : async Result<NFT, ApiError> {
        let caller = msg.caller;

        // Check if this is a Soul Bound Token
        if (isSoulBoundToken(tokenId)) {
            return #Err(#InvalidInput("Soul Bound Tokens cannot be transferred"));
        };

        switch (nfts.get(tokenId)) {
            case null { return #Err(#NotFound) };
            case (?nft) {
                // Only current owner can transfer
                if (not Principal.equal(nft.owner, caller)) {
                    return #Err(#Unauthorized);
                };

                let updatedNFT : NFT = {
                    tokenId = nft.tokenId;
                    owner = newOwner;
                    metadata = nft.metadata;
                    createdAt = nft.createdAt;
                };

                nfts.put(tokenId, updatedNFT);

                // Update owner tokens
                let oldOwnerTokens = Option.get(ownerTokens.get(caller), []);
                let filteredTokens = Array.filter(oldOwnerTokens, func(t: TokenId) : Bool { t != tokenId });
                ownerTokens.put(caller, filteredTokens);

                let newOwnerTokens = Option.get(ownerTokens.get(newOwner), []);
                ownerTokens.put(newOwner, Array.append(newOwnerTokens, [tokenId]));

                #Ok(updatedNFT)
            };
        }
    };

    // Get NFTs owned by user
    public query func getNFTsByOwner(owner: Principal) : async [NFT] {
        let tokenIds = Option.get(ownerTokens.get(owner), []);
        Array.mapFilter(tokenIds, func(tokenId: TokenId) : ?NFT {
            nfts.get(tokenId)
        })
    };

    // Get all credentials (for admin/debugging)
    public query func getAllCredentials() : async [Credential] {
        Iter.toArray(credentials.vals())
    };

    // Get canister name
    public query func getName() : async Text {
        "CredentialNFT"
    };

    // Get canister stats
    public query func getStats() : async {
        totalCredentials: Nat;
        totalNFTs: Nat;
        totalTokens: Nat;
    } {
        {
            totalCredentials = credentials.size();
            totalNFTs = nfts.size();
            totalTokens = tokenCounter;
        }
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
