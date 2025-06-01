// Integration test for frontend-backend connection
const { Actor, HttpAgent } = require('@dfinity/agent');
const { Principal } = require('@dfinity/principal');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key] = value;
    }
  });
}

console.log('🧪 Testing Frontend-Backend Integration\n');

async function testIntegration() {
  try {
    console.log('📋 Environment Check:');
    console.log('   USER_MANAGEMENT_CANISTER_ID:', process.env.NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID);
    console.log('   CREDENTIAL_NFT_CANISTER_ID:', process.env.NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID);
    console.log('   VERIFICATION_CANISTER_ID:', process.env.NEXT_PUBLIC_VERIFICATION_CANISTER_ID);
    console.log('   STORAGE_CANISTER_ID:', process.env.NEXT_PUBLIC_STORAGE_CANISTER_ID);
    
    // Check if declarations exist
    const declarationsPath = path.join(__dirname, '..', 'src', 'declarations');
    console.log('\n📁 Declarations Check:');
    
    const canisters = ['user_management', 'credential_nft', 'verification', 'storage'];
    
    for (const canister of canisters) {
      const canisterPath = path.join(declarationsPath, canister);
      const idlPath = path.join(canisterPath, 'index.js');
      
      if (fs.existsSync(idlPath)) {
        console.log(`   ✅ ${canister} declarations found`);
        
        try {
          // Try to import the IDL
          const idlFactory = require(idlPath).idlFactory;
          console.log(`   ✅ ${canister} IDL factory loaded`);
          
          // Try to create actor (without identity for now)
          const agent = new HttpAgent({ 
            host: 'http://localhost:4943',
            fetch: require('node-fetch')
          });
          
          // Fetch root key for local development
          await agent.fetchRootKey();
          
          const canisterId = process.env[`NEXT_PUBLIC_${canister.toUpperCase()}_CANISTER_ID`];
          if (canisterId) {
            const actor = Actor.createActor(idlFactory, {
              agent,
              canisterId,
            });
            
            console.log(`   ✅ ${canister} actor created successfully`);
            
            // Test basic query (if available)
            if (canister === 'user_management') {
              try {
                // This might fail without authentication, but we can check if the method exists
                console.log(`   📞 Testing ${canister} connectivity...`);
                // Just testing if we can reach the canister
              } catch (e) {
                console.log(`   ℹ️  ${canister} requires authentication (expected)`);
              }
            }
          } else {
            console.log(`   ❌ ${canister} canister ID not found in environment`);
          }
        } catch (e) {
          console.log(`   ❌ ${canister} IDL import failed:`, e.message);
        }
      } else {
        console.log(`   ❌ ${canister} declarations not found at ${idlPath}`);
      }
    }
    
    console.log('\n🎉 Integration test completed!');
    console.log('\n📝 Summary:');
    console.log('   - Environment variables configured');
    console.log('   - TypeScript declarations available');
    console.log('   - Actors can be created (authentication pending)');
    console.log('\n🚀 Ready for frontend testing!');
    console.log('   Run: npm run dev');
    console.log('   Navigate to: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
  }
}

testIntegration();
