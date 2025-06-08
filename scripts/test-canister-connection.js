#!/usr/bin/env node

/**
 * Test script to verify canister connection and functionality
 * This script tests the deployed credential_nft canister
 */

const { Actor, HttpAgent } = require('@dfinity/agent');
const { idlFactory } = require('../src/declarations/credential_nft/credential_nft.did.js');

// Configuration
const CANISTER_ID = 'k7fau-4yaaa-aaaao-qkb2a-cai';
const IC_HOST = 'https://ic0.app';

async function testCanisterConnection() {
  console.log('🔧 Testing Credential NFT Canister Connection...');
  console.log(`📍 Canister ID: ${CANISTER_ID}`);
  console.log(`🌐 IC Host: ${IC_HOST}`);
  console.log('');

  try {
    // Create agent
    const agent = new HttpAgent({ host: IC_HOST });
    
    // Create actor
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: CANISTER_ID,
    });

    console.log('✅ Actor created successfully');

    // Test 1: Get canister name
    console.log('\n📋 Test 1: Getting canister name...');
    try {
      const name = await actor.getName();
      console.log(`✅ Canister name: ${name}`);
    } catch (error) {
      console.log(`❌ Failed to get name: ${error.message}`);
    }

    // Test 2: Get canister stats
    console.log('\n📊 Test 2: Getting canister stats...');
    try {
      const stats = await actor.getStats();
      console.log(`✅ Stats:`, {
        totalCredentials: Number(stats.totalCredentials),
        totalNFTs: Number(stats.totalNFTs),
        totalTokens: Number(stats.totalTokens)
      });
    } catch (error) {
      console.log(`❌ Failed to get stats: ${error.message}`);
    }

    // Test 3: Get all credentials
    console.log('\n🏆 Test 3: Getting all credentials...');
    try {
      const credentials = await actor.getAllCredentials();
      console.log(`✅ Found ${credentials.length} credentials`);
      
      if (credentials.length > 0) {
        console.log('\n📝 Sample credentials:');
        credentials.slice(0, 3).forEach((cred, index) => {
          console.log(`  ${index + 1}. ${cred.title} (ID: ${cred.id})`);
          console.log(`     Issuer: ${cred.issuer.toText()}`);
          console.log(`     Recipient: ${cred.recipient}`);
          console.log(`     Issued: ${new Date(Number(cred.issuedAt) / 1000000).toLocaleString()}`);
          console.log('');
        });
      }
    } catch (error) {
      console.log(`❌ Failed to get credentials: ${error.message}`);
    }

    console.log('🎉 Canister connection test completed!');

  } catch (error) {
    console.error('❌ Failed to connect to canister:', error.message);
    process.exit(1);
  }
}

// Run the test
testCanisterConnection().catch(console.error);
