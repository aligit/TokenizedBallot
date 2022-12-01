import { ethers } from "hardhat";
import { GroupTenToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
// import voters from './assets/voters.json'

dotenv.config()

const MINT_VALUE = ethers.utils.parseEther("100");

async function main() {

  const accounts = await ethers.getSigners();
  const [minter, voter, other] = accounts;

  const contractFactory = new GroupTenToken__factory(minter);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(`Tokenized Votes contract deployed at ${contract.address}\n`)
  let voterTokenBalance = await contract.balanceOf(voter.address);
  let minterTokenBalance = await contract.balanceOf(minter.address);
  let otherTokenBalance = await contract.balanceOf(other.address);

  console.log(`The voter starts with at ${voterTokenBalance} decimals of balance\n`)
  const voterMintTx = await contract.mint(voter.address, MINT_VALUE);
  await voterMintTx.wait();
  const minterMintTx = await contract.mint(minter.address, MINT_VALUE);
  await minterMintTx.wait();
  const otherMintTx = await contract.mint(other.address, MINT_VALUE);
  await otherMintTx.wait();
  voterTokenBalance = await contract.balanceOf(voter.address);
  minterTokenBalance = await contract.balanceOf(minter.address);
  otherTokenBalance = await contract.balanceOf(other.address);
  console.log(`after the mint, the voter has ${voterTokenBalance} decimals of balance\n`)
  console.log(`after the mint, the minter has ${minterTokenBalance} decimals of balance\n`)
  console.log(`after the mint, the other has ${otherTokenBalance} decimals of balance\n`)
  let voterVotePower = await contract.getVotes(voter.address);
  let minterVotePower = await contract.getVotes(minter.address);
  let otherVotePower = await contract.getVotes(other.address);
  console.log(`after the mint, the voter has ${voterVotePower} decimals of vote Power\n`)
  console.log(`after the mint, the minter has ${minterVotePower} decimals of vote Power\n`)
  console.log(`after the mint, the other has ${otherVotePower} decimals of vote Power\n`)
  const voterDelegateTx = await contract.connect(voter).delegate(voter.address);
  await voterDelegateTx.wait();
  const minterDelegateTx = await contract.connect(minter).delegate(minter.address);
  await minterDelegateTx.wait();
  const otherDelegateTx = await contract.connect(other).delegate(other.address);
  await otherDelegateTx.wait();
  voterVotePower = await contract.getVotes(voter.address);
  minterVotePower = await contract.getVotes(minter.address);
  otherVotePower = await contract.getVotes(other.address);
  console.log(`after the self delegation the voter has ${voterVotePower} decimals of vote Power\n`)
  console.log(`after the self delegation the minter has ${minterVotePower} decimals of vote Power\n`)
  console.log(`after the self delegation the other has ${otherVotePower} decimals of vote Power\n`)
  // const transferTx = await contract.connect(voter).transfer(other.address, MINT_VALUE.div(3));
  // await transferTx.wait();
  voterVotePower = await contract.getVotes(voter.address);
  console.log(`after the transfer, the voter has ${voterVotePower} decimals of vote Power\n`)
  voterVotePower = await contract.getVotes(other.address);
  console.log(`after the transfer, the other has ${voterVotePower} decimals of vote Power\n`)
  const currentBlock = await ethers.provider.getBlock("latest");
  for (let blockNumber = currentBlock.number - 1; blockNumber >= 0; blockNumber--) {
    const pastVotePower = await contract.getPastVotes(voter.address, blockNumber)
    console.log(`At block ${blockNumber} the vother has ${pastVotePower} decimals of vote Power\n`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
