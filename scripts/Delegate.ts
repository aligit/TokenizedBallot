
import { ethers } from "hardhat";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
  const provider = ethers.getDefaultProvider("goerli")
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  console.log(`Connected to the acount of address ${signer.address}\nThis account has a balance of ${balanceBN.toString()} Wei`);
  const args = process.argv;
  const params = args.slice(2);
  if (params.length <= 0) throw new Error("arguments are missing");
  const contractAddress = params[0];
  const newDelegatedAddress = params[1];

  console.log(`Attaching MyToken to contract`);
  let tokenizedBallotContract: MyToken;
  const tokenizedBallotContractFactory = new MyToken__factory(signer);
  tokenizedBallotContract = tokenizedBallotContractFactory.attach(contractAddress);

  console.log("Delegating voting power to other");
  const delegateTx = await tokenizedBallotContract.delegate(newDelegatedAddress);
  await delegateTx.wait();
  let votePower = await tokenizedBallotContract.getVotes(newDelegatedAddress);
  console.log(`Voting power delegated to: ${newDelegatedAddress} with voting power of ${votePower}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
