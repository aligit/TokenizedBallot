import { ethers } from "hardhat";
import * as dotenv from 'dotenv'
import abiTokenizedBallot from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import abiGroupTenToken from "../artifacts/contracts/ERC20Votes.sol/GroupTenToken.json";

const tokenizedBallotContractABI = abiTokenizedBallot.abi;
const groupTenTokenABI = abiGroupTenToken.abi;

dotenv.config()

async function main() {
  const args = process.argv;
  const params = args.slice(2);
  const ballotContractAddress = params[0];
  const voteIndex = parseInt(params[1]);
  const voteAmount = ethers.utils.parseEther(params[2]);
  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", alchemyProvider);
  const voter = wallet.connect(alchemyProvider);
  if (!isNumber(voteIndex)) {
    throw "Only a number representing a proposal name is accepted";
  }
  if (ballotContractAddress === undefined || ballotContractAddress === '') {
    throw "make sure ballot's contract address is provided as argument";
  }

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

  const voteTx = await tokenizedBallotContract.vote(voteIndex, voteAmount);
  await voteTx.wait();
  console.log("The vote has been casted");

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
