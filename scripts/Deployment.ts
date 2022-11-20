import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

async function main() {
  const accounts = ethers.getSigners();
  //For the weekend project(requires dotenv)
  //const accounts = ethers.Wallet.fromMnemonic ();
  const contractFactory = new MyToken__factory(accounts[0]);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(`Tokenized Votes contract deployed at ${contract.address}`)
}

main().catch(err) => {
  console.error(err);
  process.exitCode = 1;
}
