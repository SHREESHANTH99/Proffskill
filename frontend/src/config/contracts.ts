// Contract Addresses - Update after deployment
export const ISSUER_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_ISSUER_REGISTRY_ADDRESS || "";
export const SKILL_CREDENTIAL_NFT_ADDRESS =
  process.env.NEXT_PUBLIC_SKILL_CREDENTIAL_NFT_ADDRESS || "";
export const SKILL_MARKETPLACE_ADDRESS =
  process.env.NEXT_PUBLIC_SKILL_MARKETPLACE_ADDRESS || "";
export const REPUTATION_ADDRESS =
  process.env.NEXT_PUBLIC_REPUTATION_ADDRESS || "";

// Admin Address
export const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS || "";

// Network Configuration
export const CHAIN_ID = parseInt(
  process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"
);
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "";
