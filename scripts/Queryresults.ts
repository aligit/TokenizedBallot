import { ethers } from "hardhat";
import { TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", alchemyProvider);
  const signer = wallet.connect(alchemyProvider);
  const args = process.argv;
  const params = args.slice(2);
  const tokenizedBallotcontractAddress = params[0];
  if (tokenizedBallotcontractAddress === undefined || tokenizedBallotcontractAddress === '') {
    throw "make sure ballot's contract address is provided as argument";
  }

  const ballotContractFactory = new TokenizedBallot__factory(signer);
  let tokenizedBallotContract: TokenizedBallot = ballotContractFactory.attach(
    tokenizedBallotcontractAddress
  );

  const winningProposalNumber = await tokenizedBallotContract.winningProposal();

  const winnerNameBytes32 = await tokenizedBallotContract.winnerName();

  const winnerName = ethers.utils.parseBytes32String(winnerNameBytes32);

  console.log(
    `Winning proposal index is ${winningProposalNumber} named ${winnerName}.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
