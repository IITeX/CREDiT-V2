export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const UserId = IDL.Principal;
  const DocumentMetadata = IDL.Record({
    'contentType' : IDL.Text,
    'hash' : IDL.Text,
    'size' : IDL.Nat,
    'filename' : IDL.Text,
    'uploadedAt' : Time,
    'uploadedBy' : UserId,
  });
  const ApiError = IDL.Variant({
    'InvalidInput' : IDL.Text,
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
    'InternalError' : IDL.Text,
  });
  const Result_5 = IDL.Variant({
    'Ok' : IDL.Vec(DocumentMetadata),
    'Err' : ApiError,
  });
  const Result_4 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : ApiError });
  const Result_3 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat8), 'Err' : ApiError });
  const Result_2 = IDL.Variant({
    'Ok' : IDL.Record({
      'content' : IDL.Vec(IDL.Nat8),
      'metadata' : DocumentMetadata,
    }),
    'Err' : ApiError,
  });
  const Result = IDL.Variant({ 'Ok' : DocumentMetadata, 'Err' : ApiError });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Record({
      'contentType' : IDL.Text,
      'size' : IDL.Nat,
      'filename' : IDL.Text,
      'uploadedAt' : Time,
    }),
    'Err' : ApiError,
  });
  return IDL.Service({
    'batchUploadDocuments' : IDL.Func(
        [
          IDL.Vec(
            IDL.Record({
              'content' : IDL.Vec(IDL.Nat8),
              'contentType' : IDL.Text,
              'filename' : IDL.Text,
            })
          ),
        ],
        [Result_5],
        [],
      ),
    'deleteDocument' : IDL.Func([IDL.Text], [Result_4], []),
    'documentExists' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'downloadDocument' : IDL.Func([IDL.Text], [Result_3], ['query']),
    'getDocument' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'getDocumentMetadata' : IDL.Func([IDL.Text], [Result], ['query']),
    'getDocumentsByUser' : IDL.Func(
        [UserId],
        [IDL.Vec(DocumentMetadata)],
        ['query'],
      ),
    'getFileInfo' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'getMyDocuments' : IDL.Func([], [IDL.Vec(DocumentMetadata)], []),
    'getRecentDocuments' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(DocumentMetadata)],
        ['query'],
      ),
    'getStorageStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalSize' : IDL.Nat,
            'averageSize' : IDL.Nat,
            'totalDocuments' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'uploadDocument' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Nat8)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
