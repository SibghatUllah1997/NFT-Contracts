const { ethers, upgrades } = require("hardhat");

const fs = require("fs");

const hre = require("hardhat");

async function main() {
  // Chimera
  const Chimera = await hre.ethers.getContractFactory("Chimera");

  //MarketplaceSettings
  const MarketplaceSettings = await hre.ethers.getContractFactory(
    "MarketplaceSettings"
  );

  //ChimeraTokenCreatorRegistry
  const ChimeraTokenCreatorRegistry = await hre.ethers.getContractFactory(
    "ChimeraTokenCreatorRegistery"
  );

  //ChimeraRoyaltyRegistry
  const ChimeraRoyaltyRegistry = await hre.ethers.getContractFactory(
    "ChimeraRoyaltyRegistry"
  );

  // ChimeraMarketAuctionV2
  const ChimeraMarketAuctionV2 = await hre.ethers.getContractFactory(
    "ChimeraMarketAuctionV2"
  );

  const chimeraAddr = fs.readFileSync("./address.txt", {
    encoding: "utf8",
    flag: "r",
  });

  var Addresses = chimeraAddr.split("\n");

  const UpgradedChimera = await upgrades.upgradeProxy(Addresses[0], Chimera);
  console.log(
    "UpgradedChimera upgraded Successfully at: ",
    UpgradedChimera.address
  );

  const UpgradedMarketplace = await upgrades.upgradeProxy(
    Addresses[1],
    MarketplaceSettings
  );
  console.log(
    "UpgradedMarketplace upgraded Successfully at: ",
    UpgradedMarketplace.address
  );
  const UpgradedCreatorRegistry = await upgrades.upgradeProxy(
    Addresses[2],
    ChimeraTokenCreatorRegistry
  );
  console.log(
    "UpgradedCreatorRegistry upgraded Successfully at: ",
    UpgradedCreatorRegistry.address
  );
  const UpgradedRoyaltyRegistry = await upgrades.upgradeProxy(
    Addresses[3],
    ChimeraRoyaltyRegistry
  );
  console.log(
    "UpgradedRoyaltyRegistry upgraded Successfully at: ",
    UpgradedRoyaltyRegistry.address
  );
  const UpgradedMarketAuction = await upgrades.upgradeProxy(
    Addresses[4],
    ChimeraMarketAuctionV2
  );
  console.log(
    "UpgradedMarketAuction upgraded Successfully at: ",
    UpgradedMarketAuction.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
