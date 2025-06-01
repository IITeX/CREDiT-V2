#!/usr/bin/env node

/**
 * Script to register the admin user and set them as verified
 * This will allow the admin to access the dashboard and admin panel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Admin principal ID (hardcoded in the backend)
const ADMIN_PRINCIPAL = 'g5pqo-7ihb2-4vqek-pou4f-pauhm-tfylr-qcvnb-f5fnp-lfjs5-i7xtv-pae';

function getCanisterId() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID="([^"]+)"/);
  
  if (!match) {
    console.error('❌ USER_MANAGEMENT_CANISTER_ID not found in .env.local');
    process.exit(1);
  }
  
  return match[1];
}

async function setupAdminUser() {
  try {
    const canisterId = getCanisterId();
    console.log(`🔧 Setting up admin user: ${ADMIN_PRINCIPAL}`);
    console.log(`📦 Canister ID: ${canisterId}`);
    
    // Step 1: Check if user already exists
    console.log('\n🔍 Checking if admin user exists...');
    try {
      const checkResult = execSync(
        `dfx canister call ${canisterId} getUser '(principal "${ADMIN_PRINCIPAL}")'`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      
      if (checkResult.includes('Ok')) {
        console.log('✅ Admin user already exists!');
        
        // Check verification status
        if (checkResult.includes('Approved')) {
          console.log('✅ Admin user is already verified!');
          console.log('\n🎉 Setup complete! You can now access:');
          console.log('   - Dashboard: http://localhost:3001/dashboard');
          console.log('   - Admin Panel: http://localhost:3001/admin');
          return;
        } else {
          console.log('⚠️  Admin user exists but not verified. Updating status...');
          // Update verification status
          const updateResult = execSync(
            `dfx canister call ${canisterId} updateVerificationStatus '(principal "${ADMIN_PRINCIPAL}", variant { Approved })'`,
            { encoding: 'utf8', stdio: 'pipe' }
          );
          console.log('✅ Admin verification status updated!');
          console.log('📋 Result:', updateResult.trim());
        }
      }
    } catch (error) {
      console.log('⚠️  Admin user not found. Creating new user...');
      
      // Step 2: Register the admin user
      console.log('\n➕ Registering admin user...');
      const registerResult = execSync(
        `dfx canister call ${canisterId} registerUser '("admin@dresume.app", variant { Company }, opt "dResume Admin")'`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      
      console.log('✅ Admin user registered!');
      console.log('📋 Result:', registerResult.trim());
      
      // Step 3: Set verification status to approved
      console.log('\n✅ Setting verification status to approved...');
      const approveResult = execSync(
        `dfx canister call ${canisterId} updateVerificationStatus '(principal "${ADMIN_PRINCIPAL}", variant { Approved })'`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      
      console.log('✅ Admin user approved!');
      console.log('📋 Result:', approveResult.trim());
    }
    
    // Step 4: Verify the setup
    console.log('\n🔍 Verifying admin setup...');
    const verifyResult = execSync(
      `dfx canister call ${canisterId} getUser '(principal "${ADMIN_PRINCIPAL}")'`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    
    console.log('📋 Final user status:', verifyResult.trim());
    
    // Step 5: Check admin status
    console.log('\n🔍 Verifying admin privileges...');
    const adminCheckResult = execSync(
      `dfx canister call ${canisterId} isAdminPrincipal '(principal "${ADMIN_PRINCIPAL}")'`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    
    if (adminCheckResult.includes('true')) {
      console.log('✅ Admin privileges confirmed!');
    } else {
      console.log('❌ Admin privileges not found');
    }
    
    console.log('\n🎉 Setup complete! You can now access:');
    console.log('   - Dashboard: http://localhost:3001/dashboard');
    console.log('   - Admin Panel: http://localhost:3001/admin');
    console.log('   - Admin Users: http://localhost:3001/admin/users');
    
  } catch (error) {
    console.error('❌ Error setting up admin user:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. DFX is running (dfx start)');
    console.log('   2. Canisters are deployed (dfx deploy)');
    console.log('   3. You are in the correct directory');
    console.log('   4. You are using the correct dfx identity');
    process.exit(1);
  }
}

// Run the script
setupAdminUser();
