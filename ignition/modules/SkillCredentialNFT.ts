import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SkillCredentialNFTModule = buildModule(
  "SkillCredentialNFTModule",
  (m) => {
    // Parameters
    const issuerRegistryAddress = m.getParameter("issuerRegistryAddress");
    const isSoulbound = m.getParameter("isSoulbound", true); // Default to true (Soulbound)

    // Deploy SkillCredentialNFT
    const skillCredentialNFT = m.contract("SkillCredentialNFT", [
      issuerRegistryAddress,
      isSoulbound,
    ]);

    return { skillCredentialNFT };
  }
);

export default SkillCredentialNFTModule;
