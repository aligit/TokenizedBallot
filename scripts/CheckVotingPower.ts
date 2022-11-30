import { ethers } from "hardhat";
import { GroupTenToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
dotenv.config()

const tokenContractAddress = "0x6F1A2768e49053c7224f2cc422C7f50c193b60F3";

async function main() {
  // const walletDeployer = new ethers.Wallet(process.env.PRIVATE_KEY ?? "93c62ba2ede1b8a726a62d330a80ada9012aa9b94db8336e8ffdc621953e6b9a");
  // const deployer = walletDeployer.connect(ethers.getDefaultProvider("goerli"));
  const walletVoter = new ethers.Wallet("f95c9e8d855d51df88aaf390679382459329ef7cc78490c52b7de5b3fc4b10b5");
  const voter = walletVoter.connect(ethers.getDefaultProvider("goerli"));
  // const walletOther = new ethers.Wallet("e8d11010e199153aa06a1f617cd3c052a4681bb1d264c4647f8f634643782a43");
  // const other = walletOther.connect(ethers.getDefaultProvider("goerli"));
  //
  // const args = process.argv;
  // const params = args.slice(2);
  // if (params.length <= 0) throw new Error("arguments are missing");
  // const contractAddress = params[0];

  console.log(`Attaching GroupTenToken to contract`);
  const groupTenTokenContractFactory = new GroupTenToken__factory(voter);
  const groupTenTokenContract = groupTenTokenContractFactory.attach(tokenContractAddress);

  // const deployerDelegateTx = await groupTenTokenContract.connect(deployer).delegate(deployer.address);
  // await deployerDelegateTx.wait();

  const voterDelegateTx = await groupTenTokenContract.delegate(voter.address);
  await voterDelegateTx.wait();

  let voterVotePower = await groupTenTokenContract.getVotes(voter.address);
  // let otherVotePower = await groupTenTokenContract.getVotes(other.address);
  // let deployerVotePower = await groupTenTokenContract.getVotes(deployer.address);

  console.log(`The voter has ${voterVotePower} decimals of vote Power\n`)
  // console.log(`The deployer has ${deployerVotePower} decimals of vote Power\n`)
  // console.log(`The other has ${otherVotePower} decimals of vote Power\n`)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
