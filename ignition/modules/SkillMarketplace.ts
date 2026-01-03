import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SkillMarketplaceModule = buildModule("SkillMarketplaceModule", (m) => {
  // Parameters
  const platformWallet = m.getParameter("platformWallet");

  // Deploy SkillMarketplace
  const skillMarketplace = m.contract("SkillMarketplace", [platformWallet]);

  return { skillMarketplace };
});

export default SkillMarketplaceModule;
