import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const IssuerRegistryModule = buildModule("IssuerRegistryModule", (m) => {
  // Deploy IssuerRegistry (constructor has no parameters - admin is msg.sender)
  const issuerRegistry = m.contract("IssuerRegistry");

  return { issuerRegistry };
});

export default IssuerRegistryModule;
