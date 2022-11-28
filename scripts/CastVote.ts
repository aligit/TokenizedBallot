import { ethers } from "hardhat";
import * as dotenv from 'dotenv'
import abi from "../artifacts/contracts/TokenizedBallot.sol/Ballot.json";

const contractABI = abi.abi;
// expect voting with 60% of total supply vote power
const MIN_VOTE_POWER_VALUE = ethers.utils.parseEther("600000");

dotenv.config()

async function main() {
  const args = process.argv;
  const voteIndex = parseInt(args[2]);
  const ballotContractAddress = process.env.CONTRACT_BALLOT;
  const privateKey = process.env.PRIVATE_KEY ?? ""
  if (!isNumber(voteIndex)) {
    throw "Only a number representing a proposal name is accepted";
  }
  if (ballotContractAddress === undefined || ballotContractAddress === '') {
    throw "make sure CONTRACT_BALLOT address is set in the .env file";
  }

  const provider = ethers.getDefaultProvider("goerli")
  const wallet = new ethers.Wallet(privateKey);
  const voter = wallet.connect(provider);
  console.log(`Connected to the acount of address ${voter.address}`);

  console.log(`attaching Ballot Contract`);
  const tokenizedBallotContract = new ethers.Contract(
    ballotContractAddress,
    contractABI,
    voter
  );

  const tProposals = await tokenizedBallotContract.getProposals();
  // List proposals
  if (voteIndex < 0 || voteIndex > tProposals.length) {
    console.log(`Error: ${voteIndex} is not a valid vote. Pick among the following`);
    tProposals.forEach((p: any, i: any) => console.log(`${i + 1} for ${ethers.utils.parseBytes32String(p.name)}`))
    throw "Program exiting";

  }

  console.log("Voting on proposal");
  const voteTx = await tokenizedBallotContract.vote(tProposals[voteIndex], MIN_VOTE_POWER_VALUE);
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
