import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const GeotrustNftModule = buildModule("GeotrustNftModule", (m) => {
  
  const platformFeePercentage = 5; 

  const LandRegistry = m.contract("LandRegistry", [platformFeePercentage]);

  return { LandRegistry };
});

export default GeotrustNftModule;
