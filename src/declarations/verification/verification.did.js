export const idlFactory = ({ IDL }) => {
  const VerificationStatus = IDL.Variant({
    'UnderReview' : IDL.Null,
    'Approved' : IDL.Null,
    'Rejected' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const UserId = IDL.Principal;
  const UserRole = IDL.Variant({
    'NGO' : IDL.Null,
    'CertificationBody' : IDL.Null,
    'Platform' : IDL.Null,
    'Educational' : IDL.Null,
    'Company' : IDL.Null,
    'Individual' : IDL.Null,
  });
  const Time = IDL.Int;
  const VerificationRequest = IDL.Record({
    'id' : IDL.Text,
    'status' : VerificationStatus,
    'organizationName' : IDL.Text,
    'documents' : IDL.Vec(IDL.Text),
    'userId' : UserId,
    'role' : UserRole,
    'submittedAt' : Time,
    'reviewedAt' : IDL.Opt(Time),
    'reviewedBy' : IDL.Opt(UserId),
    'notes' : IDL.Opt(IDL.Text),
  });
  const ApiError = IDL.Variant({
    'InvalidInput' : IDL.Text,
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
    'InternalError' : IDL.Text,
  });
  const Result = IDL.Variant({ 'Ok' : VerificationRequest, 'Err' : ApiError });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Vec(VerificationRequest),
    'Err' : ApiError,
  });
  return IDL.Service({
    'cancelVerificationRequest' : IDL.Func([IDL.Text], [Result], []),
    'getMyVerificationRequests' : IDL.Func(
        [],
        [IDL.Vec(VerificationRequest)],
        [],
      ),
    'getPendingVerificationRequests' : IDL.Func([], [Result_1], []),
    'getVerificationRequest' : IDL.Func([IDL.Text], [Result], ['query']),
    'getVerificationRequestsByRole' : IDL.Func(
        [UserRole],
        [IDL.Vec(VerificationRequest)],
        ['query'],
      ),
    'getVerificationRequestsByStatus' : IDL.Func(
        [VerificationStatus],
        [IDL.Vec(VerificationRequest)],
        ['query'],
      ),
    'getVerificationStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'total' : IDL.Nat,
            'pending' : IDL.Nat,
            'underReview' : IDL.Nat,
            'approved' : IDL.Nat,
            'rejected' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'reviewVerificationRequest' : IDL.Func(
        [IDL.Text, VerificationStatus, IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
    'startReview' : IDL.Func([IDL.Text], [Result], []),
    'submitVerificationRequest' : IDL.Func(
        [UserRole, IDL.Text, IDL.Vec(IDL.Text)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
