# Docker Setup for dresumeV2

This directory contains Docker configuration files to run the dresumeV2 Motoko backend in a containerized environment, solving WSL2 filesystem permission issues on Windows.

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git Bash or WSL2 terminal

### 1. Start Docker Environment
```bash
chmod +x scripts/*.sh
./scripts/start-docker.sh
```

### 2. Deploy Canisters
```bash
./scripts/deploy-docker.sh
```

### 3. Start Next.js Development
```bash
npm run dev
```

## Docker Commands

### Container Management
```bash
# Start container
docker-compose -f docker-compose.dfx.yml up -d

# Stop container
docker-compose -f docker-compose.dfx.yml down

# Access container shell
docker-compose -f docker-compose.dfx.yml exec dfx bash

# View logs
docker-compose -f docker-compose.dfx.yml logs -f
```

### DFX Commands in Container
```bash
# Access container and run DFX commands
docker-compose -f docker-compose.dfx.yml exec dfx bash

# Inside container:
dfx start --background --clean
dfx deploy
dfx generate
dfx canister id user_management
```

## File Structure

```
dresumeV2/
├── Dockerfile.dfx              # Docker image definition
├── docker-compose.dfx.yml     # Docker Compose configuration
├── scripts/
│   ├── deploy-docker.sh        # Complete deployment script
│   ├── start-docker.sh         # Start Docker environment
│   └── stop-docker.sh          # Stop Docker environment
└── .env.local                  # Updated automatically with canister IDs
```

## Features

### Persistent Data
- **dfx_data volume**: Preserves DFX state between container restarts
- **node_modules volume**: Cached Node.js dependencies
- **Workspace mount**: Live code changes reflected in container

### Port Mapping
- **4943**: DFX local replica
- **3000**: Next.js development server

### Environment Variables
- `DFX_VERSION=0.15.2`
- `NODE_ENV=development`
- `NEXT_PUBLIC_DFX_NETWORK=local`

## Troubleshooting

### Container Won't Start
```bash
# Check Docker status
docker info

# Rebuild container
docker-compose -f docker-compose.dfx.yml up -d --build --force-recreate
```

### Permission Issues
```bash
# Fix script permissions
chmod +x scripts/*.sh

# Fix volume permissions (if needed)
docker-compose -f docker-compose.dfx.yml exec dfx chmod -R 755 /workspace
```

### DFX Issues
```bash
# Clean restart DFX in container
docker-compose -f docker-compose.dfx.yml exec dfx bash -c "
    dfx stop
    rm -rf .dfx/local
    dfx start --background --clean
"
```

### Reset Everything
```bash
# Stop and remove all containers and volumes
docker-compose -f docker-compose.dfx.yml down -v
docker-compose -f docker-compose.dfx.yml up -d --build
```

## Advantages of Docker Setup

1. **No WSL2 Permission Issues**: Runs in clean Linux environment
2. **Consistent Environment**: Same setup across different machines
3. **Isolated Dependencies**: No conflicts with host system
4. **Easy Cleanup**: Complete environment reset with one command
5. **Reproducible Builds**: Guaranteed consistent deployment environment

## Development Workflow

1. **Start Environment**: `./scripts/start-docker.sh`
2. **Deploy Backend**: `./scripts/deploy-docker.sh`
3. **Develop Frontend**: `npm run dev` (runs on host)
4. **Test Integration**: Access http://127.0.0.1:3000
5. **Stop Environment**: `./scripts/stop-docker.sh`

## Integration with Frontend

The Docker setup automatically updates `.env.local` with the correct canister IDs, ensuring seamless integration with the Next.js frontend running on the host machine.

## Production Deployment

For production deployment to the Internet Computer mainnet:

```bash
# Access container
docker-compose -f docker-compose.dfx.yml exec dfx bash

# Inside container:
dfx deploy --network ic --with-cycles 1000000000000
```

Note: Ensure you have sufficient cycles and proper identity setup for mainnet deployment.
