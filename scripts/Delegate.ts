import { ethers } from "hardhat";
import { GroupTenToken, GroupTenToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", alchemyProvider);
  const signer = wallet.connect(alchemyProvider);
  const balanceBN = await signer.getBalance();
  console.log(`Connected to the acount of address ${signer.address}\nThis account has a balance of ${balanceBN.toString()} Wei`);
  const args = process.argv;
  const params = args.slice(2);
  const contractAddress = params[0];
  const delegateeAddress = params[1];
  if (contractAddress === undefined || contractAddress === '') {
    throw "make sure CONTRACT address is set in the .env file";
  }

  console.log(`Attaching GTET token to contract`);
  let tokenizedBallotContract: GroupTenToken;
  const tokenizedBallotContractFactory = new GroupTenToken__factory(signer);
  tokenizedBallotContract = tokenizedBallotContractFactory.attach(contractAddress);

  console.log(`Delegating voting right from ${signer.address} to
              ${delegateeAddress}`);
  const delegateTx = await tokenizedBallotContract.delegate(delegateeAddress);
  await delegateTx.wait();
  const votePower = await tokenizedBallotContract.getVotes(delegateeAddress);
  console.log(
    `Voting delegated\n
    from: ${signer.address}\n
    to: ${delegateeAddress}\n
    with voting power of ${votePower}`
  );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
