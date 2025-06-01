import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ApiError = { 'InvalidInput' : string } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'AlreadyExists' : null } |
  { 'InternalError' : string };
export type Result = { 'Ok' : VerificationRequest } |
  { 'Err' : ApiError };
export type Result_1 = { 'Ok' : Array<VerificationRequest> } |
  { 'Err' : ApiError };
export type Time = bigint;
export type UserId = Principal;
export type UserRole = { 'NGO' : null } |
  { 'CertificationBody' : null } |
  { 'Platform' : null } |
  { 'Educational' : null } |
  { 'Company' : null } |
  { 'Individual' : null };
export interface VerificationRequest {
  'id' : string,
  'status' : VerificationStatus,
  'organizationName' : string,
  'documents' : Array<string>,
  'userId' : UserId,
  'role' : UserRole,
  'submittedAt' : Time,
  'reviewedAt' : [] | [Time],
  'reviewedBy' : [] | [UserId],
  'notes' : [] | [string],
}
export type VerificationStatus = { 'UnderReview' : null } |
  { 'Approved' : null } |
  { 'Rejected' : null } |
  { 'Pending' : null };
export interface _SERVICE {
  'cancelVerificationRequest' : ActorMethod<[string], Result>,
  'getMyVerificationRequests' : ActorMethod<[], Array<VerificationRequest>>,
  'getPendingVerificationRequests' : ActorMethod<[], Result_1>,
  'getVerificationRequest' : ActorMethod<[string], Result>,
  'getVerificationRequestsByRole' : ActorMethod<
    [UserRole],
    Array<VerificationRequest>
  >,
  'getVerificationRequestsByStatus' : ActorMethod<
    [VerificationStatus],
    Array<VerificationRequest>
  >,
  'getVerificationStats' : ActorMethod<
    [],
    {
      'total' : bigint,
      'pending' : bigint,
      'underReview' : bigint,
      'approved' : bigint,
      'rejected' : bigint,
    }
  >,
  'reviewVerificationRequest' : ActorMethod<
    [string, VerificationStatus, [] | [string]],
    Result
  >,
  'startReview' : ActorMethod<[string], Result>,
  'submitVerificationRequest' : ActorMethod<
    [UserRole, string, Array<string>],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
