import { ethers } from "hardhat";
import { GroupTenToken__factory, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
import voters from './assets/voters.json'


dotenv.config()

const TOTAL_SUPPLY_IN_ETHERS = 1000000;
const MINT_VALUE = ethers.utils.parseEther(TOTAL_SUPPLY_IN_ETHERS.toString());
const PROPOSALS = ['Remix', 'VSCode', 'VIM'];

async function main() {

  // Deploy gtetToken
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const deployer = wallet.connect(ethers.getDefaultProvider("goerli"));
  console.log(`Connected to the acount of address ${deployer.address}`);
  const tokenContractFactory = new GroupTenToken__factory(deployer);
  const gtetTokenContract = await tokenContractFactory.deploy();
  await gtetTokenContract.deployed();
  console.log(`GroupTenToken(GTET) contract deployed at ${gtetTokenContract.address}\n`)

  // Mint voting power
  const votingPowerTransfers = []
  for (let index = 0; index < voters.length; index++) {
    const voterShare = Math.round(TOTAL_SUPPLY_IN_ETHERS / voters.length);
    const voter = voters[index];
    console.log(`voter ${voters[index]} was given ${voterShare} tokens`)
    const mintTx = await gtetTokenContract.mint(
      voter,
      MINT_VALUE
    );
    votingPowerTransfers.push(mintTx.wait());
  }

  await Promise.all(votingPowerTransfers);
  console.log(`voting powers given`)

  const currentBlock = await ethers.provider.getBlock("latest");
  // Deploy TokenizedBallot
  const tokenizedBallotContractFactory = new Ballot__factory(deployer);
  const tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(
    PROPOSALS.map((name) => ethers.utils.formatBytes32String(name)),
    gtetTokenContract.address,
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
