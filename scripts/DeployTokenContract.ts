import { ethers } from "hardhat";
import { GroupTenToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
// import voters from './assets/voters.json'


dotenv.config()

const MINT_VALUE = ethers.utils.parseEther("100");

async function main() {

  // Deploy gtetToken
  const walletDeployer = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const deployer = walletDeployer.connect(ethers.getDefaultProvider("goerli"));
  // const walletVoter = new ethers.Wallet("f95c9e8d855d51df88aaf390679382459329ef7cc78490c52b7de5b3fc4b10b5");
  // const voter = walletVoter.connect(ethers.getDefaultProvider("goerli"));
  // const walletOther = new ethers.Wallet("e8d11010e199153aa06a1f617cd3c052a4681bb1d264c4647f8f634643782a43");
  // const other = walletOther.connect(ethers.getDefaultProvider("goerli"));

  const tokenContractFactory = new GroupTenToken__factory(deployer);
  const gtetTokenContract = await tokenContractFactory.deploy();
  await gtetTokenContract.deployed();
  console.log(`GroupTenToken(GTET) contract deployed at ${gtetTokenContract.address}\n`)

  await gtetTokenContract.mint(deployer.address, MINT_VALUE);
  await gtetTokenContract.mint("0x103a5f440e6fb3e348606194A61080DE0a70064A", MINT_VALUE);
  await gtetTokenContract.mint("0x6B49A54f7345EEF9e3e84ffe1e541C246e6AaF9F", MINT_VALUE);

  const deployerDelegateTx = await gtetTokenContract.connect(deployer).delegate(deployer.address);
  await deployerDelegateTx.wait();
  // const voterDelegateTx = await gtetTokenContract.delegate(voter.address);
  // await voterDelegateTx.wait();
  // const otherDelegateTx = await gtetTokenContract.delegate(other.address);
  // await otherDelegateTx.wait();
  console.log(`Each account delegated to self`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
