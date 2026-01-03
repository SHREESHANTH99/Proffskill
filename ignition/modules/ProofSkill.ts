import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Deploy all ProofSkill contracts in the correct order
const ProofSkillModule = buildModule("ProofSkillModule", (m) => {
  // Parameters
  const platformWallet = m.getParameter("platformWallet");
  const isSoulbound = m.getParameter("isSoulbound", true);

  // 1. Deploy IssuerRegistry first
  const issuerRegistry = m.contract("IssuerRegistry");

  // 2. Deploy SkillCredentialNFT (depends on IssuerRegistry)
  const skillCredentialNFT = m.contract("SkillCredentialNFT", [
    issuerRegistry,
    isSoulbound,
  ]);

  // 3. Deploy SkillMarketplace
  const skillMarketplace = m.contract("SkillMarketplace", [platformWallet]);

  // 4. Deploy Reputation (depends on SkillMarketplace)
  const reputation = m.contract("Reputation", [skillMarketplace]);

  return {
    issuerRegistry,
    skillCredentialNFT,
    skillMarketplace,
    reputation,
  };
});

export default ProofSkillModule;
