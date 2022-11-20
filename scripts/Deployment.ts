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
  let votePower = await contract.getVotes(voter.address);
  console.log(`after the mint, the voter has ${votePower} decimals of vote Power\n`)
  const delegateTx = await contract.connect(voter).delegate(voter.address);
  await delegateTx.wait();
  votePower = await contract.getVotes(voter.address);
  console.log(`after the self delegation the voter has ${votePower} decimals of vote Power\n`)
  //when I've 1000 vote power I can vote and sell those tokens. This is
  //considered double spend. I can vote and sell those votes.. This is problem
  const transferTx = await contract.connect(voter).transfer(other.address, TEST_MINT_VALUE.div(2));
  await transferTx.wait();
  votePower = await contract.getVotes(voter.address);
  console.log(`after the transfer, the voter has ${votePower} decimals of vote Power\n`)
  votePower = await contract.getVotes(other.address);
  console.log(`after the transfer, the other has ${votePower} decimals of vote Power\n`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
