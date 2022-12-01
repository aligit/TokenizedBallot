import { ethers } from "hardhat";
import { GroupTenToken__factory, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
// import voters from './assets/voters.json'

dotenv.config()

const MINT_VALUE = ethers.utils.parseEther("100");
const PROPOSALS = ['Remix', 'VSCode', 'VIM'];

async function main() {

  const accounts = await ethers.getSigners();
  const [minter, voter, other] = accounts;

  const groupTenTokenContractFactory = new GroupTenToken__factory(minter);
  const groupTenTokenContract = await groupTenTokenContractFactory.deploy();
  await groupTenTokenContract.deployed();
  console.log(`Tokenized Votes contract deployed at ${groupTenTokenContract.address}\n`)
  let voterTokenBalance = await groupTenTokenContract.balanceOf(voter.address);
  let minterTokenBalance = await groupTenTokenContract.balanceOf(minter.address);
  let otherTokenBalance = await groupTenTokenContract.balanceOf(other.address);

  console.log(`The voter starts with at ${voterTokenBalance} decimals of balance\n`)
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
  let voterVotePower = await groupTenTokenContract.getVotes(voter.address);
  let minterVotePower = await groupTenTokenContract.getVotes(minter.address);
  let otherVotePower = await groupTenTokenContract.getVotes(other.address);
  console.log(`after the mint, the voter has ${voterVotePower} decimals of vote Power\n`)
  console.log(`after the mint, the minter has ${minterVotePower} decimals of vote Power\n`)
  console.log(`after the mint, the other has ${otherVotePower} decimals of vote Power\n`)
  const voterDelegateTx = await groupTenTokenContract.connect(voter).delegate(voter.address);
  await voterDelegateTx.wait();
  const minterDelegateTx = await groupTenTokenContract.connect(minter).delegate(minter.address);
  await minterDelegateTx.wait();
  const otherDelegateTx = await groupTenTokenContract.connect(other).delegate(other.address);
  await otherDelegateTx.wait();
  voterVotePower = await groupTenTokenContract.getVotes(voter.address);
  minterVotePower = await groupTenTokenContract.getVotes(minter.address);
  otherVotePower = await groupTenTokenContract.getVotes(other.address);
  console.log(`after the self delegation the voter has ${voterVotePower} decimals of vote Power\n`)
  console.log(`after the self delegation the minter has ${minterVotePower} decimals of vote Power\n`)
  console.log(`after the self delegation the other has ${otherVotePower} decimals of vote Power\n`)
  // const transferTx = await contract.connect(voter).transfer(other.address, MINT_VALUE.div(3));
  // await transferTx.wait();
  voterVotePower = await groupTenTokenContract.getVotes(voter.address);
  console.log(`after the transfer, the voter has ${voterVotePower} decimals of vote Power\n`)
  voterVotePower = await groupTenTokenContract.getVotes(other.address);
  console.log(`after the transfer, the other has ${voterVotePower} decimals of vote Power\n`)
  let currentBlock = await ethers.provider.getBlock("latest");
  for (let blockNumber = currentBlock.number - 1; blockNumber >= 0; blockNumber--) {
    const pastVotePower = await groupTenTokenContract.getPastVotes(voter.address, blockNumber)
    console.log(`At block ${blockNumber} the vother has ${pastVotePower} decimals of vote Power\n`)
  }



  currentBlock = await ethers.provider.getBlock("latest");
  // Deploy TokenizedBallot
  const tokenizedBallotContractFactory = new Ballot__factory(minter);
  const tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(
    PROPOSALS.map((name) => ethers.utils.formatBytes32String(name)),
    groupTenTokenContract.address,
    currentBlock.number
  );
  await tokenizedBallotContract.deployed();
  console.log(`ballot for voting on following proposals deployed at contract\n ${tokenizedBallotContract.address} at block number ${currentBlock.number}\n`);
  PROPOSALS.forEach((p: string) => console.log(p));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
