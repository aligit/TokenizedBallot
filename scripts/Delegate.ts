import { ethers } from "hardhat";
import { GroupTenToken, GroupTenToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
import voters from './assets/voters.json'

dotenv.config()

async function main() {
  const provider = ethers.getDefaultProvider("goerli")
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  console.log(`Connected to the acount of address ${signer.address}\nThis account has a balance of ${balanceBN.toString()} Wei`);
  const args = process.argv;
  const contractAddress = process.env.CONTRACT;
  const delegateeAddress = args[1];
  if (contractAddress === undefined || contractAddress === '') {
    throw "make sure CONTRACT address is set in the .env file";
  }
  if (!voters.includes(signer.address)) {
    throw "You are not given right to vote";
  }

  console.log(`Attaching GTET token to contract`);
  let tokenizedBallotContract: GroupTenToken;
  const tokenizedBallotContractFactory = new GroupTenToken__factory(signer);
  tokenizedBallotContract = tokenizedBallotContractFactory.attach(contractAddress);

  console.log(`Delegating voting right from ${signer.address} to ${delegateeAddress}`);
  const delegateTx = await tokenizedBallotContract.delegate(delegateeAddress);
  await delegateTx.wait();
  const votePower = await tokenizedBallotContract.getVotes(delegateeAddress);
  console.log(`Voting power delegated to: ${delegateeAddress} with voting power of ${votePower}`);
  voters.splice(voters.indexOf(signer.address));
  voters.push(delegateeAddress);
  //TODO update json file with new value
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
