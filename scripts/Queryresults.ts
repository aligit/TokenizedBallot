import { ethers } from "hardhat";
import { MyToken, MyToken__factory, TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
dotenv.config()

const TEST_MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
  const provider = ethers.getDefaultProvider("goerli")
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  const args = process.argv;
  const params = args.slice(2);
  const contractAddress = params[0];

  const ballotContractFactory = new TokenizedBallot__factory(signer);
  let ballotContract: TokenizedBallot = ballotContractFactory.attach(
    contractAddress
  );

  const winningProposalNumber = await ballotContract.winningProposal();

  const winnerNameBytes32 = await ballotContract.winnerName();

  const winnerName = ethers.utils.parseBytes32String(winnerNameBytes32);

  console.log(
    `Winning proposal index is ${winningProposalNumber} named ${winnerName}.`
  );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
