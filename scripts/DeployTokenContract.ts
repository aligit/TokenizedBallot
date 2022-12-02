import { ethers } from "hardhat";
import { GroupTenToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
// import voters from './assets/voters.json'

dotenv.config()

const MINT_VALUE = ethers.utils.parseEther("100");
const PROPOSALS = ['Remix', 'VSCode', 'VIM'];
const MIN_VOTE_POWER_VALUE = ethers.utils.parseEther("70");

async function main() {

  const accounts = await ethers.getSigners();
  const [minter, voter, other] = accounts;

  const groupTenTokenContractFactory = new GroupTenToken__factory(minter);
  const groupTenTokenContract = await groupTenTokenContractFactory.deploy();
  await groupTenTokenContract.deployed();
  let currentBlock = await ethers.provider.getBlock("latest");
  console.log(`Token contract deployed at ${groupTenTokenContract.address} and within block number ${currentBlock.number}`)
  let voterTokenBalance = await groupTenTokenContract.balanceOf(voter.address);
  let minterTokenBalance = await groupTenTokenContract.balanceOf(minter.address);
  let otherTokenBalance = await groupTenTokenContract.balanceOf(other.address);

  const voterMintTx = await groupTenTokenContract.mint(voter.address, MINT_VALUE);
  await voterMintTx.wait();
  const minterMintTx = await groupTenTokenContract.mint(minter.address, MINT_VALUE);
  await minterMintTx.wait();
  const otherMintTx = await groupTenTokenContract.mint(other.address, MINT_VALUE);
  await otherMintTx.wait();
  voterTokenBalance = await groupTenTokenContract.balanceOf(voter.address);
  minterTokenBalance = await groupTenTokenContract.balanceOf(minter.address);
  otherTokenBalance = await groupTenTokenContract.balanceOf(other.address);
  console.log(`after the mint, the voter has ${voterTokenBalance} decimals of balance\n`)
  console.log(`after the mint, the minter has ${minterTokenBalance} decimals of balance\n`)
  console.log(`after the mint, the other has ${otherTokenBalance} decimals of balance\n`)
  console.log(`delegating at block number ${currentBlock.number}`);
  const tokenizedBallotContractFactory = new TokenizedBallot__factory(minter);
  const minterDelegateTx = await groupTenTokenContract.connect(minter).delegate(minter.address);
  await minterDelegateTx.wait();
  const voterDelegateTx = await groupTenTokenContract.connect(voter).delegate(voter.address);
  await voterDelegateTx.wait();
  const otherDelegateTx = await groupTenTokenContract.connect(other).delegate(other.address);
  await otherDelegateTx.wait();
  // for (let blockNumber = currentBlock.number - 1; blockNumber >= 0; blockNumber--) {
  //   const pastVotePower = await groupTenTokenContract.getPastVotes(voter.address, blockNumber)
  //   console.log(`At block ${blockNumber} the vother has ${pastVotePower} decimals of vote Power\n`)
  // }

  // Deploy TokenizedBallot
  currentBlock = await ethers.provider.getBlock("latest");
  const tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(
    PROPOSALS.map((name) => ethers.utils.formatBytes32String(name)),
    groupTenTokenContract.address,
    currentBlock.number
  );
  // console.log(`target block set to ${targetBlock}`);
  const targetBlock = await tokenizedBallotContract.targetBlock();
  console.log(`target block set to ${targetBlock}`);
  await tokenizedBallotContract.deployed();
  const voterTokenizedBallotContract = tokenizedBallotContract.connect(voter).attach(tokenizedBallotContract.address);
  const otherTokenizedBallotContract = tokenizedBallotContract.connect(other).attach(tokenizedBallotContract.address);
  PROPOSALS.forEach((p: string) => console.log(p));
  // const tProposals = await tokenizedBallotContract.getProposals();

  // const otherGroupTenTokenContractFactory = new GroupTenToken__factory(other);
  // const voterGroupTenTokenContractFactory = new GroupTenToken__factory(voter);
  // const otherGroupTenTokenContract = otherGroupTenTokenContractFactory.attach(groupTenTokenContract.address);
  // const voterGroupTenTokenContract = voterGroupTenTokenContractFactory.attach(groupTenTokenContract.address);
  // await otherGroupTenTokenContract.deployed();
  // await voterGroupTenTokenContract.deployed();

  let voterVotePower = await groupTenTokenContract.getPastVotes(voter.address, targetBlock);
  let minterVotePower = await groupTenTokenContract.getPastVotes(minter.address, targetBlock);
  let otherVotePower = await groupTenTokenContract.getPastVotes(other.address, targetBlock);
  console.log(`Minter has ${ethers.utils.formatEther(minterVotePower)} vote power`);
  console.log(`Voter has ${ethers.utils.formatEther(voterVotePower)} vote power`);
  console.log(`Other has ${ethers.utils.formatEther(otherVotePower)} vote power`);
  console.log(`Voter with ${voterVotePower} vote power about to vote with ${voterVotePower.div(5)}`);
  const voterVoteTx = await voterTokenizedBallotContract.vote(2, voterVotePower.div(5));
  await voterVoteTx.wait();
  console.log(`Minter with ${minterVotePower} vote power about to vote with ${minterVotePower.div(5)}`);
  const minterVoteTx = await tokenizedBallotContract.vote(2, voterVotePower.div(5));
  await minterVoteTx.wait();
  console.log(`Other with ${otherVotePower} vote power about to vote ${otherVotePower.div(5)}`);
  const otherVoteTx = await otherTokenizedBallotContract.vote(2, otherVotePower.div("5"));
  await otherVoteTx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
