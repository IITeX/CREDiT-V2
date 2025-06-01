import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
// import Option "mo:base/Option"; // Unused for now
// import Blob "mo:base/Blob"; // Unused for now
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Int "mo:base/Int";

import Types "../types/types";

actor Storage {
    type DocumentMetadata = Types.DocumentMetadata;
    type UserId = Types.UserId;
    type Result<T, E> = Types.Result<T, E>;
    type ApiError = Types.ApiError;

    // Document storage
    private stable var documentEntries : [(Text, DocumentMetadata)] = [];
    private stable var fileEntries : [(Text, [Nat8])] = [];

    private var documents = HashMap.HashMap<Text, DocumentMetadata>(10, Text.equal, Text.hash);
    private var files = HashMap.HashMap<Text, [Nat8]>(10, Text.equal, Text.hash);

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

    // System functions
    system func preupgrade() {
        documentEntries := Iter.toArray(documents.entries());
        fileEntries := Iter.toArray(files.entries());
    };

    system func postupgrade() {
        documents := HashMap.fromIter(documentEntries.vals(), documentEntries.size(), Text.equal, Text.hash);
        files := HashMap.fromIter(fileEntries.vals(), fileEntries.size(), Text.equal, Text.hash);
        documentEntries := [];
        fileEntries := [];
    };
}
