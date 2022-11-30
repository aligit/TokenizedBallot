import { ethers } from "hardhat";
import { GroupTenToken__factory, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
import voters from './assets/voters.json'


dotenv.config()

const MINT_VALUE = ethers.utils.parseEther("100");
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

  const mintTxDeployer = await gtetTokenContract.mint(
    deployer.address,
    MINT_VALUE
  );
  // Mint voting power
  const votingPowerTransfers = []
  for (let index = 1; index < voters.length; index++) {
    const voter = voters[index];
    const mintTx = await gtetTokenContract.mint(
      voter,
      MINT_VALUE
    );
    votingPowerTransfers.push(mintTx.wait());
  }

  await Promise.all(votingPowerTransfers);
  console.log(`voting powers given`)

  const delegateTx = await gtetTokenContract.delegate(deployer.address);
  await delegateTx.wait();
  console.log(`Delegated to self`)

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
