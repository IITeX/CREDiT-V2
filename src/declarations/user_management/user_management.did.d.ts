import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ApiError = { 'InvalidInput' : string } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'AlreadyExists' : null } |
  { 'InternalError' : string };
export type Result = { 'Ok' : User } |
  { 'Err' : ApiError };
export type Result_1 = { 'Ok' : Array<User> } |
  { 'Err' : ApiError };
export type Result_2 = { 'Ok' : null } |
  { 'Err' : ApiError };
export type Time = bigint;
export interface User {
  'id' : UserId,
  'organizationName' : [] | [string],
  'createdAt' : Time,
  'role' : UserRole,
  'documentsSubmitted' : Array<string>,
  'email' : string,
  'updatedAt' : Time,
  'verificationStatus' : VerificationStatus,
}
export interface UserFilter {
  'organizationName' : [] | [string],
  'role' : [] | [UserRole],
  'verificationStatus' : [] | [VerificationStatus],
}
export type UserId = Principal;
export type UserRole = { 'NGO' : null } |
  { 'CertificationBody' : null } |
  { 'Platform' : null } |
  { 'Educational' : null } |
  { 'Company' : null } |
  { 'Individual' : null };
export type VerificationStatus = { 'UnderReview' : null } |
  { 'Approved' : null } |
  { 'Rejected' : null } |
  { 'Pending' : null };
export interface _SERVICE {
  'addAdmin' : ActorMethod<[Principal], Result_2>,
  'getAdmins' : ActorMethod<[], Array<Principal>>,
  'getAllUsers' : ActorMethod<[], Result_1>,
  'getMyProfile' : ActorMethod<[], Result>,
  'getUser' : ActorMethod<[UserId], Result>,
  'getUsersByFilter' : ActorMethod<[UserFilter], Result_1>,
  'isAdminPrincipal' : ActorMethod<[Principal], boolean>,
  'isVerifiedVerifier' : ActorMethod<[UserId], boolean>,
  'registerUser' : ActorMethod<[string, UserRole, [] | [string]], Result>,
  'submitVerificationDocuments' : ActorMethod<[Array<string>], Result>,
  'updateProfile' : ActorMethod<[[] | [string], [] | [string]], Result>,
  'updateVerificationStatus' : ActorMethod<
    [UserId, VerificationStatus],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
