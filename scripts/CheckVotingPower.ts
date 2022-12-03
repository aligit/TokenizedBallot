import { ethers } from "hardhat";
import { GroupTenToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
dotenv.config()


async function main() {
  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", alchemyProvider);
  const voter = wallet.connect(alchemyProvider);
  const tokenContractAddress = process.env.CONTRACT_GTET ?? ""
  const ballotContractAddress = process.env.CONTRACT_BALLOT ?? ""
  if (tokenContractAddress === undefined || tokenContractAddress === '') {
    throw "make sure CONTRACT_GTET address is set in the .env file";
  }
  if (ballotContractAddress === undefined || ballotContractAddress === '') {
    throw "make sure CONTRACT_BALLOT address is set in the .env file";
  }

  const args = process.argv;
  const params = args.slice(2);
  if (params.length <= 0) throw new Error("arguments are missing");
  if (params.length <= 1) throw new Error("arguments are missing");
  const voterAddress = params[0];
  const tokenizedBallotContractBlock = params[1];

  const groupTenTokenContractFactory = new GroupTenToken__factory(voter);
  const groupTenTokenContract = groupTenTokenContractFactory.attach(tokenContractAddress);

  let voterVotePower = await groupTenTokenContract.getVotes(voterAddress);
  let voterPastVotePower = await groupTenTokenContract.getPastVotes(voterAddress, tokenizedBallotContractBlock);

  console.log(`The voter has overall ${ethers.utils.formatEther(voterVotePower)} decimals of vote Power`)
  console.log(`The voter has ${ethers.utils.formatEther(voterPastVotePower)} vote power in block ${tokenizedBallotContractBlock}`)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
