import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ApiError = { 'InvalidInput' : string } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'AlreadyExists' : null } |
  { 'InternalError' : string };
export interface DocumentMetadata {
  'contentType' : string,
  'hash' : string,
  'size' : bigint,
  'filename' : string,
  'uploadedAt' : Time,
  'uploadedBy' : UserId,
}
export type Result = { 'Ok' : DocumentMetadata } |
  { 'Err' : ApiError };
export type Result_1 = {
    'Ok' : {
      'contentType' : string,
      'size' : bigint,
      'filename' : string,
      'uploadedAt' : Time,
    }
  } |
  { 'Err' : ApiError };
export type Result_2 = {
    'Ok' : { 'content' : Uint8Array | number[], 'metadata' : DocumentMetadata }
  } |
  { 'Err' : ApiError };
export type Result_3 = { 'Ok' : Uint8Array | number[] } |
  { 'Err' : ApiError };
export type Result_4 = { 'Ok' : null } |
  { 'Err' : ApiError };
export type Result_5 = { 'Ok' : Array<DocumentMetadata> } |
  { 'Err' : ApiError };
export type Time = bigint;
export type UserId = Principal;
export interface _SERVICE {
  'batchUploadDocuments' : ActorMethod<
    [
      Array<
        {
          'content' : Uint8Array | number[],
          'contentType' : string,
          'filename' : string,
        }
      >,
    ],
    Result_5
  >,
  'deleteDocument' : ActorMethod<[string], Result_4>,
  'documentExists' : ActorMethod<[string], boolean>,
  'downloadDocument' : ActorMethod<[string], Result_3>,
  'getDocument' : ActorMethod<[string], Result_2>,
  'getDocumentMetadata' : ActorMethod<[string], Result>,
  'getDocumentsByUser' : ActorMethod<[UserId], Array<DocumentMetadata>>,
  'getFileInfo' : ActorMethod<[string], Result_1>,
  'getMyDocuments' : ActorMethod<[], Array<DocumentMetadata>>,
  'getRecentDocuments' : ActorMethod<[bigint], Array<DocumentMetadata>>,
  'getStorageStats' : ActorMethod<
    [],
    { 'totalSize' : bigint, 'averageSize' : bigint, 'totalDocuments' : bigint }
  >,
  'uploadDocument' : ActorMethod<
    [string, string, Uint8Array | number[]],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
