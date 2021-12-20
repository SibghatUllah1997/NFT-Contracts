const { ethers, upgrades } = require("hardhat");

const fs = require("fs");

const hre = require("hardhat");

async function main() {
  // Chimera
  const Chimera = await hre.ethers.getContractFactory("Chimera");
  let chimera;
  chimera = await upgrades.deployProxy(Chimera, ["Chimera", "CH"], {
    initializer: "InitializeChimera",
  });
  await chimera.deployed();
  console.log("\nDeploying Contracts");
  console.log("\nChimera deployed to:", chimera.address);
  let content = chimera.address;
  fs.writeFileSync("address.txt", content + "\n", (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  //MarketplaceSettings
  const MarketplaceSettings = await hre.ethers.getContractFactory(
    "MarketplaceSettings"
  );
  let marketplacesettings;
  marketplacesettings = await upgrades.deployProxy(MarketplaceSettings, {
    initializer: "InitializeMarketPlaceSettings",
  });
  await marketplacesettings.deployed();
  console.log("MarketplaceSettings deployed to:", marketplacesettings.address);
  content = marketplacesettings.address;
  fs.appendFileSync("address.txt", content + "\n", (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  //ChimeraTokenCreatorRegistry
  const ChimeraTokenCreatorRegistry = await hre.ethers.getContractFactory(
    "ChimeraTokenCreatorRegistery"
  );
  let chimeratokencreatorregistry;
  chimeratokencreatorregistry = await upgrades.deployProxy(
    ChimeraTokenCreatorRegistry,
    [[chimera.address.toString()]], //Chimera
    {
      initializer: "InitializeChimeraTokenCreatorRegistery",
    }
  );
  await chimeratokencreatorregistry.deployed();
  console.log(
    "ChimeraTokenCreatorRegistry deployed to:",
    chimeratokencreatorregistry.address
  );
  content = chimeratokencreatorregistry.address;
  fs.appendFileSync("address.txt", content + "\n", (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  //ChimeraRoyaltyRegistry
  const ChimeraRoyaltyRegistry = await hre.ethers.getContractFactory(
    "ChimeraRoyaltyRegistry"
  );
  let chimeraroyaltyregistry;
  chimeraroyaltyregistry = await upgrades.deployProxy(
    ChimeraRoyaltyRegistry,
    [chimeratokencreatorregistry.address.toString()], //ChimeraTokenCreatorRegistry
    {
      initializer: "InitializeChimeraRoyaltyRegistry",
    }
  );
  await chimeraroyaltyregistry.deployed();
  console.log(
    "ChimeraRoyaltyRegistry deployed to:",
    chimeraroyaltyregistry.address
  );
  content = chimeraroyaltyregistry.address;
  fs.appendFileSync("address.txt", content + "\n", (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  // ChimeraMarketAuctionV2
  const ChimeraMarketAuctionV2 = await hre.ethers.getContractFactory(
    "ChimeraMarketAuctionV2"
  );
  let chimeramarket;
  chimeramarket = await upgrades.deployProxy(
    ChimeraMarketAuctionV2,
    [
      marketplacesettings.address.toString(),
      chimeraroyaltyregistry.address.toString(),
    ],
    {
      initializer: "InitializeChimeraMarketAuctionV2",
    }
  );
  await chimeramarket.deployed();
  console.log("ChimeraMarketAuctionV2 deployed to: ", chimeramarket.address);
  const marketAddr = chimeramarket.address;
  fs.appendFileSync("address.txt", marketAddr, (err) => {
    if (err) {
      console.log(err);
      return;
    }
  });
  // await chimeramarket.deployed();
  // const marketAddrDummy = chimeramarket.address;
  // fs.appendFile("address.txt", marketAddrDummy, (err) => {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  // });

  //Calling All initial Functions

  let MarkRole = await marketplacesettings.TOKEN_MARK_ROLE();

  await marketplacesettings.grantRole(
    MarkRole,
    chimeramarket.address.toString()
  );

  console.log(
    "\nChimeraMarketAuctionV2 has been assigned the role succesfully"
  );

  await marketplacesettings.setERC721ContractPrimarySaleFeePercentage(
    chimera.address.toString(),
    10
  );
  await marketplacesettings.setERC721ContractSecondarySaleFeePercentage(
    chimera.address.toString(),
    5
  );

  console.log("\nPrimary and Secondary Fees has been set as 10 and 5 percent");

  await chimeratokencreatorregistry.setIERC721Creator(
    chimera.address.toString()
  );

  console.log("\nChimera has been assigned as Token Creator succesfully");

  await chimeraroyaltyregistry.setPercentageForSetERC721ContractRoyalty(
    chimera.address.toString(),
    5
  );

  console.log("\nChimera Royalty has been set at 5 percent");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
