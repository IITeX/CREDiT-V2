# Credential NFT Integration Testing Guide 🧪

This guide walks you through testing the complete credential NFT integration, from creation to search.

## 🎯 What We're Testing

The integration of credential creation with NFT tokenization:
1. **Create credentials** → **Save to NFT canister** → **Get token ID**
2. **Search by token ID** → **Find and display credential**
3. **View credential details** → **See NFT information**

## 🚀 Step-by-Step Testing

### Step 1: Authentication Setup
1. **Go to Setup Admin**: http://localhost:3001/setup-admin
2. **Click "Login with Internet Identity"**
3. **Complete Internet Identity authentication**
4. **Register as admin user**
5. **Verify you see "Admin user registered successfully"**

### Step 2: Access Authenticated Dashboard
1. **Go to Dashboard**: http://localhost:3001/dashboard
2. **Verify you're logged in** (should see your principal ID)
3. **Check verification status** (should show as verified admin)

### Step 3: Create a Test Credential
1. **Click "Add Credential"** button in dashboard
2. **Choose credential type** (e.g., "Certificate & Courses")
3. **Fill in the form**:
   - **Title**: "AWS Solutions Architect"
   - **Issuer**: "Amazon Web Services"
   - **Description**: "Professional cloud architecture certification"
   - **Date**: Today's date
   - **Verifier Email**: (optional) your email
4. **Click "Add Credential"**
5. **Wait for success dialog** with token ID
6. **Copy the token ID** (format like CS-2025-001)

### Step 4: Test Token Search
1. **Go to Homepage**: http://localhost:3001
2. **Enter the token ID** in the search box
3. **Click "Search"**
4. **Verify it finds and displays the credential**
5. **Check the credential detail page** shows all information

### Step 5: Verify NFT Integration
1. **In the credential detail page**, verify you see:
   - **Token ID** displayed prominently
   - **NFT Information** section
   - **Owner principal ID**
   - **Creation timestamp**
   - **Verification status**

## 🧪 Test Scenarios

### Scenario A: Successful Flow
✅ **Expected**: Complete flow works end-to-end
- Authentication succeeds
- Credential creation returns token ID
- Search finds the credential
- Detail page shows complete information

### Scenario B: Authentication Required
✅ **Expected**: Clear error messages when not authenticated
- Direct dashboard shows authentication notice
- Credential creation shows authentication error
- Clear instructions to login first

### Scenario C: Invalid Token Search
✅ **Expected**: Graceful handling of invalid tokens
- Search for non-existent token ID
- Shows "Credential not found" message
- Provides option to search again

## 🔧 Troubleshooting

### Issue: "Not authenticated" Error
**Solution**:
1. Go to `/setup-admin`
2. Login with Internet Identity
3. Register as admin user
4. Try creating credential again

### Issue: Credential Creation Fails
**Check**:
1. Are you logged in? (Check dashboard shows principal)
2. Is the backend running? (Check console for errors)
3. Are canister IDs correct? (Check .env.local)

### Issue: Search Doesn't Find Credential
**Check**:
1. Did credential creation succeed?
2. Did you copy the correct token ID?
3. Is the search using the right canister?

### Issue: Credential Detail Page Shows Error
**Check**:
1. Is the token ID format correct?
2. Does the credential exist in the canister?
3. Are there any console errors?

## 📊 Expected Results

### Successful Credential Creation
```
✅ Success dialog appears
✅ Token ID displayed (e.g., CS-2025-001)
✅ Copy button works
✅ "Test Search on Homepage" button works
```

### Successful Token Search
```
✅ Search finds credential immediately
✅ Redirects to detail page
✅ Shows complete credential information
✅ Displays NFT metadata
```

### Credential Detail Page
```
✅ Token ID prominently displayed
✅ Credential title and description
✅ Issuer information
✅ Creation and expiry dates
✅ NFT owner and creation info
✅ Verification status
```

## 🎯 Key Features to Verify

### 1. Token ID Generation
- **Format**: Should follow pattern like CS-2025-001
- **Uniqueness**: Each credential gets unique token
- **Display**: Shown in success dialog and detail page

### 2. Search Functionality
- **Input validation**: Accepts various token formats
- **Real-time search**: Shows loading states
- **Error handling**: Clear messages for not found

### 3. Credential Detail Display
- **Complete information**: All credential data shown
- **NFT metadata**: Owner, creation date, token ID
- **Professional layout**: Clean, readable design
- **Actions**: Back to search, create own dResume

### 4. Integration Points
- **Dashboard**: Shows token IDs in credential cards
- **Homepage**: Search by token ID works
- **Detail page**: Complete credential and NFT info
- **Error handling**: Clear messages throughout

## 🚀 Advanced Testing

### Test Multiple Credential Types
1. Create different types: Certificate, Work Experience, Education
2. Verify each gets unique token ID
3. Search for each token ID
4. Verify all display correctly

### Test Error Scenarios
1. Search with invalid token ID
2. Try creating without authentication
3. Test with network issues
4. Verify error messages are helpful

### Test UI Responsiveness
1. Test on mobile devices
2. Verify search works on small screens
3. Check credential detail page on mobile
4. Test copy functionality on touch devices

## 📝 Test Checklist

### Authentication
- [ ] Can login with Internet Identity
- [ ] Admin registration works
- [ ] Dashboard shows authenticated state

### Credential Creation
- [ ] Form validation works
- [ ] Credential creation succeeds
- [ ] Token ID is generated and displayed
- [ ] Success dialog shows all information

### Search Functionality
- [ ] Homepage search accepts token ID
- [ ] Search finds existing credentials
- [ ] Error handling for invalid tokens
- [ ] Loading states work properly

### Detail Page
- [ ] Shows complete credential information
- [ ] Displays NFT metadata
- [ ] Professional layout and design
- [ ] All actions work correctly

### Integration
- [ ] Dashboard shows token IDs
- [ ] Cross-navigation works
- [ ] Error messages are clear
- [ ] Mobile responsiveness works

## 🎉 Success Criteria

**The integration is successful when**:
✅ Users can authenticate and create credentials
✅ Each credential gets a unique token ID
✅ Token search finds and displays credentials
✅ Detail page shows complete information
✅ Error handling is clear and helpful
✅ Mobile experience works well

---

**Ready to test? Start with Step 1 above and work through each scenario!** 🚀
