export const idlFactory = ({ IDL }) => {
  const ApiError = IDL.Variant({
    'InvalidInput' : IDL.Text,
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
    'InternalError' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : ApiError });
  const UserId = IDL.Principal;
  const Time = IDL.Int;
  const UserRole = IDL.Variant({
    'NGO' : IDL.Null,
    'CertificationBody' : IDL.Null,
    'Platform' : IDL.Null,
    'Educational' : IDL.Null,
    'Company' : IDL.Null,
    'Individual' : IDL.Null,
  });
  const VerificationStatus = IDL.Variant({
    'UnderReview' : IDL.Null,
    'Approved' : IDL.Null,
    'Rejected' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const User = IDL.Record({
    'id' : UserId,
    'organizationName' : IDL.Opt(IDL.Text),
    'createdAt' : Time,
    'role' : UserRole,
    'documentsSubmitted' : IDL.Vec(IDL.Text),
    'email' : IDL.Text,
    'updatedAt' : Time,
    'verificationStatus' : VerificationStatus,
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Vec(User), 'Err' : ApiError });
  const Result = IDL.Variant({ 'Ok' : User, 'Err' : ApiError });
  const UserFilter = IDL.Record({
    'organizationName' : IDL.Opt(IDL.Text),
    'role' : IDL.Opt(UserRole),
    'verificationStatus' : IDL.Opt(VerificationStatus),
  });
  return IDL.Service({
    'addAdmin' : IDL.Func([IDL.Principal], [Result_2], []),
    'getAdmins' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getAllUsers' : IDL.Func([], [Result_1], []),
    'getMyProfile' : IDL.Func([], [Result], []),
    'getUser' : IDL.Func([UserId], [Result], ['query']),
    'getUsersByFilter' : IDL.Func([UserFilter], [Result_1], []),
    'isAdminPrincipal' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'isVerifiedVerifier' : IDL.Func([UserId], [IDL.Bool], ['query']),
    'registerUser' : IDL.Func(
        [IDL.Text, UserRole, IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
    'submitVerificationDocuments' : IDL.Func([IDL.Vec(IDL.Text)], [Result], []),
    'updateProfile' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
    'updateVerificationStatus' : IDL.Func(
        [UserId, VerificationStatus],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
