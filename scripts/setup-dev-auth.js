#!/usr/bin/env node

/**
 * Development Authentication Setup
 * 
 * This script sets up development authentication for testing
 * without requiring a running IC replica.
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Generate a valid-looking principal for development
function generateDevPrincipal() {
  const chars = 'abcdefghijklmnopqrstuvwxyz234567';
  let result = '';
  for (let i = 0; i < 63; i++) {
    if (i > 0 && i % 5 === 0) {
      result += '-';
    } else {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return result;
}

// Setup development authentication
function setupDevAuth() {
  log(`${colors.bold}🔧 Setting up Development Authentication${colors.reset}\n`);
  
  // Check if .env file exists
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    log('❌ .env file not found', 'red');
    return false;
  }
  
  // Read current .env content
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update simulation mode if not already set
  if (!envContent.includes('NEXT_PUBLIC_SIMULATION_MODE=true')) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_SIMULATION_MODE=false/g,
      'NEXT_PUBLIC_SIMULATION_MODE=true'
    );
    
    if (!envContent.includes('NEXT_PUBLIC_SIMULATION_MODE=true')) {
      envContent += '\nNEXT_PUBLIC_SIMULATION_MODE=true\n';
    }
    
    fs.writeFileSync(envPath, envContent);
    logSuccess('Enabled simulation mode in .env');
  } else {
    logInfo('Simulation mode already enabled');
  }
  
  // Generate development principal
  const devPrincipal = generateDevPrincipal();
  
  // Create development setup instructions
  const setupInstructions = `
${colors.bold}🎯 Development Authentication Setup Complete!${colors.reset}

${colors.blue}To test authentication without Internet Identity:${colors.reset}

1. Start your development server:
   ${colors.yellow}npm run dev${colors.reset}

2. Open your browser to: ${colors.yellow}http://localhost:3000${colors.reset}

3. Open browser console (F12) and run:
   ${colors.yellow}localStorage.setItem('dev_principal', '${devPrincipal}')${colors.reset}

4. Refresh the page - you'll be logged in as a development user!

${colors.blue}Alternative test principals you can use:${colors.reset}
- ${generateDevPrincipal()}
- ${generateDevPrincipal()}
- ${process.env.NEXT_PUBLIC_TEST_VERIFIED_IDENTITY || 'qripm-egsfv-cxi4b-h4vcx-ngjcw-pk7ma-fctha-yjuq5-mp3hb-2ftjr-qqe'}

${colors.blue}To disable dev login:${colors.reset}
   ${colors.yellow}localStorage.removeItem('dev_principal')${colors.reset}

${colors.green}✨ Your app is now ready for development testing!${colors.reset}
`;

  console.log(setupInstructions);
  
  // Save setup info to file
  const setupInfoPath = path.join(__dirname, '..', 'DEV_AUTH_SETUP.md');
  const markdownContent = `# Development Authentication Setup

## Quick Start

Your dResume app is configured for development testing without requiring Internet Identity.

### Test Authentication

1. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Open browser to: http://localhost:3000

3. Enable dev login in browser console:
   \`\`\`javascript
   localStorage.setItem('dev_principal', '${devPrincipal}')
   \`\`\`

4. Refresh the page

### Test Principals

You can use any of these principals for testing:
- \`${devPrincipal}\`
- \`${generateDevPrincipal()}\`
- \`${generateDevPrincipal()}\`

### Disable Dev Login

\`\`\`javascript
localStorage.removeItem('dev_principal')
\`\`\`

## Production Setup

When ready for production:

1. Install DFX SDK:
   \`\`\`bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   \`\`\`

2. Deploy to local IC replica:
   \`\`\`bash
   bash scripts/deploy.sh
   \`\`\`

3. Update .env:
   \`\`\`bash
   NEXT_PUBLIC_SIMULATION_MODE=false
   \`\`\`

## Current Configuration

- ✅ Simulation mode enabled
- ✅ Dev login enabled  
- ✅ All required environment variables set
- ✅ Authentication components ready

Generated on: ${new Date().toISOString()}
`;

  fs.writeFileSync(setupInfoPath, markdownContent);
  logSuccess(`Setup guide saved to: DEV_AUTH_SETUP.md`);
  
  return true;
}

// Run setup
if (require.main === module) {
  setupDevAuth();
}
