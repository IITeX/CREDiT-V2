import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ApiError = { 'InvalidInput' : string } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'AlreadyExists' : null } |
  { 'InternalError' : string };
export interface Credential {
  'id' : CredentialId,
  'documentHash' : [] | [string],
  'title' : string,
  'tokenId' : TokenId,
  'expiresAt' : [] | [Time],
  'isRevoked' : boolean,
  'metadata' : Array<[string, string]>,
  'credentialType' : CredentialType,
  'recipient' : string,
  'description' : string,
  'issuer' : UserId,
  'issuedAt' : Time,
  'blockchainTxId' : [] | [string],
  'recipientName' : string,
}
export interface CredentialFilter {
  'isRevoked' : [] | [boolean],
  'credentialType' : [] | [CredentialType],
  'recipient' : [] | [string],
  'toDate' : [] | [Time],
  'issuer' : [] | [UserId],
  'fromDate' : [] | [Time],
}
export type CredentialId = string;
export type CredentialType = { 'Skill' : null } |
  { 'Academic' : null } |
  { 'Achievement' : null } |
  { 'Professional' : null } |
  { 'Other' : string } |
  { 'Certification' : null } |
  { 'WorkExperience' : null };
export interface NFT {
  'tokenId' : TokenId,
  'owner' : Principal,
  'metadata' : NFTMetadata,
  'createdAt' : Time,
}
export interface NFTMetadata {
  'name' : string,
  'recipient' : string,
  'description' : string,
  'issuer' : string,
  'attributes' : Array<[string, string]>,
  'credentialId' : CredentialId,
  'image' : string,
  'issuedAt' : Time,
}
export type Result = { 'Ok' : NFT } |
  { 'Err' : ApiError };
export type Result_1 = { 'Ok' : Credential } |
  { 'Err' : ApiError };
export type Result_2 = { 'Ok' : [Credential, NFT] } |
  { 'Err' : ApiError };
export type Time = bigint;
export type TokenId = string;
export type UserId = Principal;
export interface _SERVICE {
  'createCredential' : ActorMethod<
    [
      CredentialType,
      string,
      string,
      string,
      string,
      [] | [Time],
      Array<[string, string]>,
      [] | [string],
    ],
    Result_2
  >,
  'getAllCredentials' : ActorMethod<[], Array<Credential>>,
  'getCredential' : ActorMethod<[CredentialId], Result_1>,
  'getCredentialByToken' : ActorMethod<[TokenId], Result_1>,
  'getCredentialsByIssuer' : ActorMethod<[UserId], Array<Credential>>,
  'getCredentialsByRecipient' : ActorMethod<[string], Array<Credential>>,
  'getNFT' : ActorMethod<[TokenId], Result>,
  'getNFTsByOwner' : ActorMethod<[Principal], Array<NFT>>,
  'revokeCredential' : ActorMethod<[CredentialId], Result_1>,
  'searchCredentials' : ActorMethod<[CredentialFilter], Array<Credential>>,
  'transferNFT' : ActorMethod<[TokenId, Principal], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
