// Issuer Registry ABI
export const issuerRegistryABI = [
  {
    inputs: [{ internalType: "address", name: "_issuer", type: "address" }],
    name: "addIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_issuer", type: "address" }],
    name: "removeIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_issuer", type: "address" }],
    name: "isApprovedIssuer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Skill Credential NFT ABI
export const skillCredentialNFTABI = [
  {
    inputs: [
      { internalType: "address", name: "_holder", type: "address" },
      { internalType: "string", name: "_skillName", type: "string" },
      { internalType: "string", name: "_metadataURI", type: "string" },
      { internalType: "string", name: "_metadataHash", type: "string" },
    ],
    name: "mintCredential",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_holder", type: "address" }],
    name: "getHolderCredentials",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "getCredential",
    outputs: [
      {
        components: [
          { internalType: "string", name: "skillName", type: "string" },
          { internalType: "address", name: "issuer", type: "address" },
          { internalType: "uint256", name: "issuedAt", type: "uint256" },
          { internalType: "string", name: "metadataHash", type: "string" },
        ],
        internalType: "struct SkillCredentialNFT.Skill",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Skill Marketplace ABI
export const skillMarketplaceABI = [
  {
    inputs: [
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "uint256", name: "_price", type: "uint256" },
    ],
    name: "createServiceListing",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_provider", type: "address" },
      { internalType: "string", name: "_serviceDescription", type: "string" },
    ],
    name: "hireService",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_jobId", type: "uint256" }],
    name: "acceptJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_jobId", type: "uint256" }],
    name: "markJobComplete",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_jobId", type: "uint256" }],
    name: "releasePayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_jobId", type: "uint256" }],
    name: "cancelJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_provider", type: "address" }],
    name: "getProviderJobs",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_client", type: "address" }],
    name: "getClientJobs",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "jobs",
    outputs: [
      { internalType: "uint256", name: "jobId", type: "uint256" },
      { internalType: "address", name: "provider", type: "address" },
      { internalType: "address", name: "client", type: "address" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "string", name: "serviceDescription", type: "string" },
      { internalType: "bool", name: "accepted", type: "bool" },
      { internalType: "bool", name: "completed", type: "bool" },
      { internalType: "bool", name: "paid", type: "bool" },
      { internalType: "bool", name: "cancelled", type: "bool" },
      { internalType: "uint256", name: "createdAt", type: "uint256" },
      { internalType: "uint256", name: "acceptedAt", type: "uint256" },
      { internalType: "uint256", name: "completedAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Reputation ABI
export const reputationABI = [
  {
    inputs: [
      { internalType: "uint256", name: "_jobId", type: "uint256" },
      { internalType: "uint8", name: "_score", type: "uint8" },
      { internalType: "string", name: "_review", type: "string" },
    ],
    name: "rateProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_provider", type: "address" }],
    name: "getProviderStats",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "totalScore", type: "uint256" },
          { internalType: "uint256", name: "totalJobs", type: "uint256" },
          { internalType: "uint256", name: "averageRating", type: "uint256" },
        ],
        internalType: "struct Reputation.ProviderStats",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_provider", type: "address" }],
    name: "getAverageRating",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "totalScore",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "totalJobs",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
