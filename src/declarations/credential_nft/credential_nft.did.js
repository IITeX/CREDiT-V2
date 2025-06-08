export const idlFactory = ({ IDL }) => {
  const CredentialType = IDL.Variant({
    'Skill' : IDL.Null,
    'Academic' : IDL.Null,
    'Achievement' : IDL.Null,
    'Professional' : IDL.Null,
    'Other' : IDL.Text,
    'Certification' : IDL.Null,
    'WorkExperience' : IDL.Null,
  });
  const Time = IDL.Int;
  const CredentialId = IDL.Text;
  const TokenId = IDL.Text;
  const UserId = IDL.Principal;
  const Credential = IDL.Record({
    'id' : CredentialId,
    'documentHash' : IDL.Opt(IDL.Text),
    'title' : IDL.Text,
    'tokenId' : TokenId,
    'expiresAt' : IDL.Opt(Time),
    'isRevoked' : IDL.Bool,
    'metadata' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'credentialType' : CredentialType,
    'recipient' : IDL.Text,
    'description' : IDL.Text,
    'issuer' : UserId,
    'issuedAt' : Time,
    'blockchainTxId' : IDL.Opt(IDL.Text),
    'recipientName' : IDL.Text,
  });
  const NFTMetadata = IDL.Record({
    'name' : IDL.Text,
    'recipient' : IDL.Text,
    'description' : IDL.Text,
    'issuer' : IDL.Text,
    'attributes' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'credentialId' : CredentialId,
    'image' : IDL.Text,
    'issuedAt' : Time,
  });
  const NFT = IDL.Record({
    'tokenId' : TokenId,
    'owner' : IDL.Principal,
    'metadata' : NFTMetadata,
    'createdAt' : Time,
  });
  const ApiError = IDL.Variant({
    'InvalidInput' : IDL.Text,
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
    'InternalError' : IDL.Text,
  });
  const Result_2 = IDL.Variant({
    'Ok' : IDL.Tuple(Credential, NFT),
    'Err' : ApiError,
  });
  const Result_1 = IDL.Variant({ 'Ok' : Credential, 'Err' : ApiError });
  const Result = IDL.Variant({ 'Ok' : NFT, 'Err' : ApiError });
  const CredentialFilter = IDL.Record({
    'isRevoked' : IDL.Opt(IDL.Bool),
    'credentialType' : IDL.Opt(CredentialType),
    'recipient' : IDL.Opt(IDL.Text),
    'toDate' : IDL.Opt(Time),
    'issuer' : IDL.Opt(UserId),
    'fromDate' : IDL.Opt(Time),
  });
  return IDL.Service({
    'createCredential' : IDL.Func(
        [
          CredentialType,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(Time),
          IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
          IDL.Opt(IDL.Text),
        ],
        [Result_2],
        [],
      ),
    'getAllCredentials' : IDL.Func([], [IDL.Vec(Credential)], ['query']),
    'getCredential' : IDL.Func([CredentialId], [Result_1], ['query']),
    'getCredentialByToken' : IDL.Func([TokenId], [Result_1], ['query']),
    'getCredentialsByIssuer' : IDL.Func(
        [UserId],
        [IDL.Vec(Credential)],
        ['query'],
      ),
    'getCredentialsByRecipient' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Credential)],
        ['query'],
      ),
    'getNFT' : IDL.Func([TokenId], [Result], ['query']),
    'getNFTsByOwner' : IDL.Func([IDL.Principal], [IDL.Vec(NFT)], ['query']),
    'getName' : IDL.Func([], [IDL.Text], ['query']),
    'getStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalTokens' : IDL.Nat,
            'totalNFTs' : IDL.Nat,
            'totalCredentials' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'revokeCredential' : IDL.Func([CredentialId], [Result_1], []),
    'searchCredentials' : IDL.Func(
        [CredentialFilter],
        [IDL.Vec(Credential)],
        ['query'],
      ),
    'transferNFT' : IDL.Func([TokenId, IDL.Principal], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
