# ProofSkill

A decentralized platform for verifying professional skills and managing freelance work with blockchain-powered credential NFTs and escrow payments.

## Overview

ProofSkill solves the trust problem in the gig economy by combining verifiable skill credentials (NFTs) with a secure marketplace. Service providers get their skills verified and issued as soulbound NFTs, while clients can hire talent with confidence through automated escrow payments.

## Key Features

### Smart Contracts

- **Skill Credential NFT System**: EIP-5192 compliant soulbound tokens for verified skills
- **Secure Marketplace**: Trustless escrow with automated dispute resolution
- **Reputation System**: Weighted scoring based on job value to prevent gaming
- **Dispute Protection**: 7-day auto-claim window after job completion
- **Reentrancy Protection**: All payment functions secured with OpenZeppelin ReentrancyGuard
- **Batch Operations**: Optimized read functions to reduce RPC calls by 80%

### Frontend

- **Modern UI**: Built with Next.js 14, TypeScript, and TailwindCSS
- **Web3 Integration**: Wagmi v2 and RainbowKit for wallet connections
- **ENS Support**: Displays ENS names instead of addresses where available
- **Job Timeline**: Visual progress tracking with dispute countdown
- **Credential Badges**: Verified skill indicators throughout the platform

## Technical Stack

### Blockchain

- Solidity 0.8.20
- Hardhat 3.0 for development
- OpenZeppelin Contracts v5.4.0
- Sepolia Testnet deployment

### Frontend

- Next.js 14.2.3
- React 18.2.0
- TypeScript 5.4.5
- TailwindCSS 3.4.3
- Wagmi 2.5.7
- RainbowKit 2.0.4
- Viem 2.43.5

## Project Structure

```
ProofSkill/
├── contracts/               # Smart contracts
│   ├── SkillCredentialNFT.sol
│   ├── SkillMarketplace.sol
│   ├── Reputation.sol
│   └── IssuerRegistry.sol
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # Pages and routes
│   │   ├── components/    # React components
│   │   └── config/        # Contract addresses and ABIs
│   └── public/            # Static assets
├── ignition/              # Deployment scripts
│   └── modules/
└── test/                  # Contract tests

```

## Installation

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- MetaMask or compatible Web3 wallet

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ProofSkill.git
cd ProofSkill
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure your `.env` file:

```
SEPOLIA_RPC_URL=your_alchemy_or_infura_url
SEPOLIA_PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file:

```
NEXT_PUBLIC_ISSUER_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_SKILL_CREDENTIAL_NFT_ADDRESS=0x...
NEXT_PUBLIC_SKILL_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_REPUTATION_ADDRESS=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Usage

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy to Sepolia

1. Set your private key:

```bash
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

2. Deploy contracts:

```bash
npx hardhat ignition deploy ./ignition/modules/ProofSkill.ts --network sepolia
```

3. Update frontend contract addresses in `frontend/src/config/contracts.ts`

4. Update ABIs in `frontend/src/config/abis.ts` from `artifacts/` folder

### Run Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to access the application.

## Smart Contract Architecture

### IssuerRegistry

Manages authorized credential issuers. Only admin can add or remove issuers.

**Key Functions:**

- `addIssuer(address)` - Add authorized issuer (admin only)
- `removeIssuer(address)` - Remove issuer (admin only)
- `isAuthorizedIssuer(address)` - Check if address can issue credentials

### SkillCredentialNFT

EIP-5192 compliant NFT system for skill credentials. Supports both soulbound and transferable tokens.

**Key Functions:**

- `mintCredential(address, string, string, bool)` - Issue new credential
- `locked(uint256)` - Check if token is soulbound (EIP-5192)
- `tokenURI(uint256)` - Get credential metadata

**Events:**

- `CredentialMinted` - New credential issued
- `Locked` - Token marked as soulbound

### SkillMarketplace

Escrow-based marketplace with automatic dispute resolution.

**Key Functions:**

- `listService(string, string, uint256)` - Create service listing
- `createJob(uint256)` - Hire a service provider
- `acceptJob(uint256)` - Provider accepts job
- `markJobComplete(uint256)` - Provider marks work done
- `releasePayment(uint256)` - Client approves and releases payment
- `autoClaimPayment(uint256)` - Provider claims after 7-day dispute window
- `cancelJob(uint256)` - Cancel and refund (before acceptance)
- `getUserProfile(address)` - Batch read user data
- `getMultipleJobs(uint256[])` - Batch read job data

**Constants:**

- `PLATFORM_FEE_PERCENT` = 2%
- `DISPUTE_WINDOW` = 7 days

**Security:**

- Reentrancy protection on all payment functions
- Immutable platform fee and wallet address
- Comprehensive event logging

### Reputation

Value-weighted reputation system to prevent gaming.

**Key Functions:**

- `rateProvider(uint256, uint256, string)` - Rate completed job
- `getProviderStats(address)` - Get reputation metrics

**Metrics:**

- Total score
- Total jobs completed
- Simple average rating
- Weighted average (by job value)
- Total ETH volume

## User Flows

### For Service Providers

1. Get skill verified by authorized issuer
2. Receive soulbound NFT credential
3. List services on marketplace
4. Accept job requests
5. Complete work and mark as done
6. Receive payment (immediate or after 7 days)
7. Build reputation through ratings

### For Clients

1. Browse marketplace for verified talent
2. Check provider credentials and reputation
3. Create job with escrow payment
4. Monitor job progress through timeline
5. Approve completed work to release payment
6. Rate provider (weighted by job value)

### For Issuers

1. Get authorized by platform admin
2. Verify provider skills through assessment
3. Issue soulbound credential NFTs
4. Build trust in the ecosystem

## Security Features

- **Reentrancy Protection**: OpenZeppelin ReentrancyGuard on all payment functions
- **Access Control**: Role-based permissions for admin and issuers
- **Immutable Constants**: Platform fee and wallet cannot be changed after deployment
- **Dispute Window**: 7-day buffer for clients to dispute completed work
- **Soulbound Tokens**: Non-transferable credentials to prevent fraud
- **Weighted Reputation**: Economic value weighting prevents review manipulation

## Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/Counter.ts

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Environment Variables

### Backend (.env)

```
SEPOLIA_RPC_URL=              # Alchemy or Infura RPC endpoint
SEPOLIA_PRIVATE_KEY=          # Deployer private key
ETHERSCAN_API_KEY=            # For contract verification
```

### Frontend (.env.local)

```
NEXT_PUBLIC_ISSUER_REGISTRY_ADDRESS=
NEXT_PUBLIC_SKILL_CREDENTIAL_NFT_ADDRESS=
NEXT_PUBLIC_SKILL_MARKETPLACE_ADDRESS=
NEXT_PUBLIC_REPUTATION_ADDRESS=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.

## Acknowledgments

- OpenZeppelin for secure contract libraries
- Hardhat for development framework
- Next.js and Vercel for frontend infrastructure
- RainbowKit for wallet connection UI
