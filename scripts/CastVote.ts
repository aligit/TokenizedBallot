import { ethers } from "hardhat";
import * as dotenv from 'dotenv'
import abiTokenizedBallot from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import abiGroupTenToken from "../artifacts/contracts/ERC20Votes.sol/GroupTenToken.json";

const tokenizedBallotContractABI = abiTokenizedBallot.abi;
const groupTenTokenABI = abiGroupTenToken.abi;

dotenv.config()

async function main() {
  const args = process.argv;
  const voteIndex = parseInt(args[2]);
  const voteAmount = ethers.utils.parseEther(args[3]);
  console.log(`voteIndex=${voteIndex}`)
  console.log(`voteAmount=${ethers.utils.formatEther(voteAmount)}`)
  const ballotContractAddress = process.env.CONTRACT_BALLOT;
  const tokenContractAddress = process.env.CONTRACT_GTET;
  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", alchemyProvider);
  const voter = wallet.connect(alchemyProvider);
  if (!isNumber(voteIndex)) {
    throw "Only a number representing a proposal name is accepted";
  }
  // if (!isNumber(voteAmount)) {
  //   throw "Only a number for vote amount is accepted";
  // }
  if (ballotContractAddress === undefined || ballotContractAddress === '') {
    throw "make sure CONTRACT_BALLOT address is set in the .env file";
  }
  if (tokenContractAddress === undefined || tokenContractAddress === '') {
    throw "make sure CONTRACT_BALLOT address is set in the .env file";
  }

  console.log(`attaching token Contract`);
  const groupTenTokenContract = new ethers.Contract(
    tokenContractAddress,
    groupTenTokenABI,
    voter
  );

  console.log(`attaching Ballot Contract`);
  const tokenizedBallotContract = new ethers.Contract(
    ballotContractAddress,
    tokenizedBallotContractABI,
    voter
  );

  const tProposals = await tokenizedBallotContract.getProposals();
  // List proposals
  if (voteIndex < 0 || voteIndex > tProposals.length) {
    console.log(`Error: ${voteIndex} is not a valid vote. Pick among the following`);
    tProposals.forEach((p: any, i: any) => console.log(`${i + 1} for ${ethers.utils.parseBytes32String(p.name)}`))
    throw "Program exiting";
  }

  const voterPastVotePower = await groupTenTokenContract.getPastVotes(voter.address, 8062411);
  if (voterPastVotePower <= 0) {
    console.log(`Not enough vote power at given block`);
    throw "Program exiting";
  }

  console.log("Voting on proposal");
  const voteTx = await tokenizedBallotContract.vote(voteIndex, voteAmount);
  await voteTx.wait();

}

function isNumber(value: string | number): boolean {
  return ((value != null) &&
    (value !== '') &&
    !isNaN(Number(value.toString())));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
