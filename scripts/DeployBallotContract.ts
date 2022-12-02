import { ethers } from "hardhat";
import { GroupTenToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from 'dotenv'

dotenv.config()

const PROPOSALS = ['Remix', 'VSCode', 'VIM'];

async function main() {

  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", alchemyProvider);
  const deployer = wallet.connect(alchemyProvider);
  const tokenContractAddress = process.env.CONTRACT_GTET ?? ""
  if (tokenContractAddress === undefined || tokenContractAddress === '') {
    throw "make sure CONTRACT_BALLOT address is set in the .env file";
  }

  console.log(`Attaching GroupTenToken to contract`);
  const groupTenTokenContractFactory = new GroupTenToken__factory(deployer);
  const groupTenTokenContract = groupTenTokenContractFactory.attach(tokenContractAddress);
  await groupTenTokenContract.deployed();

  // Deploy TokenizedBallot
  let currentBlock = await ethers.provider.getBlock("latest");
  const tokenizedBallotContractFactory = new TokenizedBallot__factory(deployer);
  const tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(
    PROPOSALS.map((name) => ethers.utils.formatBytes32String(name)),
    groupTenTokenContract.address,
    currentBlock.number
  );
  await tokenizedBallotContract.deployed();
  const targetBlock = await tokenizedBallotContract.targetBlock();
  console.log(`ballot for voting on following proposals deployed at contract\n ${tokenizedBallotContract.address} at block number ${targetBlock}\n`);
  PROPOSALS.forEach((p: string) => console.log(p));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
