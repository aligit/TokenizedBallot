import { ethers } from "hardhat";
import { GroupTenToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", alchemyProvider);
  const signer = wallet.connect(alchemyProvider);
  const tokenContractAddress = process.env.CONTRACT_GTET ?? ""
  if (tokenContractAddress === undefined || tokenContractAddress === '') {
    throw "make sure CONTRACT_GTET address is set in the .env file";
  }
  const args = process.argv;
  const params = args.slice(2);
  if (params.length <= 0) throw new Error("Please make sure are needed arguments are provided!");
  const voterAddress = params[0];

  const groupTenTokenContractFactory = new GroupTenToken__factory(signer);
  const groupTenTokenContract = groupTenTokenContractFactory.attach(tokenContractAddress);

  const voterVotePower = await groupTenTokenContract.getVotes(voterAddress);
  console.log(`The voter has ${ethers.utils.formatEther(voterVotePower)} vote power`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
