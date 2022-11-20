import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
// import * as dotenv from 'dotenv'
// dotenv.config()
//
const TEST_MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
  const accounts = await ethers.getSigners();
  const [minter, voter, other] = accounts;
  //For the weekend project(requires dotenu)//Check Lesson8 for inspiration
  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const contractFactory = new MyToken__factory(minter);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(`Tokenized Votes contract deployed at ${contract.address}\n`)
  let voterTokenBalance = await contract.balanceOf(voter.address);
  console.log(`The voter starts with at ${voterTokenBalance} decimals of balance\n`)
  const mintTx = await contract.mint(voter.address, TEST_MINT_VALUE);
  await mintTx.wait();
  voterTokenBalance = await contract.balanceOf(voter.address);
  console.log(`after the mint, the voter has ${voterTokenBalance} decimals of balance\n`)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
