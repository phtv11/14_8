require("dotenv").config();

async function main() {
  const hre = require("hardhat");
  const { ethers } = hre;

  const rtbAddress = process.env.RTB_ADDRESS;
  const rttAddress = process.env.RTT_ADDRESS;

  if (!rtbAddress || !rttAddress) {
    console.error("Missing RTB_ADDRESS or RTT_ADDRESS in smart_contract/.env");
    process.exit(1);
  }

  console.log(`Network: ${hre.network.name}`);
  console.log(`Verifier: local bytecode comparison`);

  const results = [];
  results.push(await verifyContract(hre, "FIFARTB", rtbAddress));
  results.push(await verifyContract(hre, "FIFARTT", rttAddress));

  const allPassed = results.every(Boolean);
  if (!allPassed) {
    process.exit(1);
  }
}

async function verifyContract(hre, contractName, address) {
  const artifact = await hre.artifacts.readArtifact(contractName);
  const deployedCode = await hre.ethers.provider.getCode(address);

  const expected = normalize(artifact.deployedBytecode);
  const actual = normalize(deployedCode);

  if (expected === actual) {
    console.log(`✅ ${contractName} verified at ${address}`);
    return true;
  }

  console.log(`❌ ${contractName} mismatch at ${address}`);
  console.log(`   Expected length: ${expected.length}`);
  console.log(`   Actual length:   ${actual.length}`);
  return false;
}

function normalize(bytecode) {
  return (bytecode || "0x").replace(/^0x/i, "").toLowerCase();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
