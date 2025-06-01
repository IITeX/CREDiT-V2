# Development Authentication Setup

## Quick Start

Your dResume app is configured for development testing without requiring Internet Identity.

### Test Authentication

1. Start development server:
   ```bash
   npm run dev
   ```

2. Open browser to: http://localhost:3000

3. Enable dev login in browser console:
   ```javascript
   localStorage.setItem('dev_principal', 'kuu6r-abgw-yol3-7rdi-vsde-xpcp-jf3f-fwoy-mdtq-zumu-pvqt-swfk-ak')
   ```

4. Refresh the page

### Test Principals

You can use any of these principals for testing:
- `kuu6r-abgw-yol3-7rdi-vsde-xpcp-jf3f-fwoy-mdtq-zumu-pvqt-swfk-ak`
- `47pac-oa6c-3ouv-wrtb-57vi-d3vf-wps3-2huf-hjeq-a5lx-azaf-3wyn-cv`
- `2ttw6-oanu-vndi-sx2f-qvsl-jxpe-n25x-xuol-cwdh-h2th-tsfc-oiab-n4`

### Disable Dev Login

```javascript
localStorage.removeItem('dev_principal')
```

## Production Setup

When ready for production:

1. Install DFX SDK:
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

2. Deploy to local IC replica:
   ```bash
   bash scripts/deploy.sh
   ```

3. Update .env:
   ```bash
   NEXT_PUBLIC_SIMULATION_MODE=false
   ```

## Current Configuration

- ✅ Simulation mode enabled
- ✅ Dev login enabled  
- ✅ All required environment variables set
- ✅ Authentication components ready

Generated on: 2025-06-01T08:08:10.670Z
