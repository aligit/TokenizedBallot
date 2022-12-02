import { ethers } from "hardhat";
import { GroupTenToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
import voters from './assets/voters.json'

dotenv.config()

const MINT_VALUE = ethers.utils.parseEther("100");
const PROPOSALS = ['Remix', 'VSCode', 'VIM'];

async function main() {

  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", alchemyProvider);
  const deployer = wallet.connect(alchemyProvider);

  const groupTenTokenContractFactory = new GroupTenToken__factory(deployer);
  const groupTenTokenContract = await groupTenTokenContractFactory.deploy();
  await groupTenTokenContract.deployed();
  let currentBlock = await ethers.provider.getBlock("latest");
  console.log(`Token contract deployed at ${groupTenTokenContract.address} and within block number ${currentBlock.number}`)

  for (let index = 0; index < voters.length; index++) {
    const mintTx = await groupTenTokenContract.mint(voters[index], MINT_VALUE);
    await mintTx.wait();
  }
  console.log(`Deployer self-delegating`);
  const deployerDelegateTx = await groupTenTokenContract.connect(deployer).delegate(deployer.address);
  await deployerDelegateTx.wait();

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
