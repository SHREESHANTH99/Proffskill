import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ReputationModule = buildModule("ReputationModule", (m) => {
  // Parameters
  const marketplaceAddress = m.getParameter("marketplaceAddress");

  // Deploy Reputation
  const reputation = m.contract("Reputation", [marketplaceAddress]);

  return { reputation };
});

export default ReputationModule;
