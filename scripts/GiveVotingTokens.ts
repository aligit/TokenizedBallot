
import { ethers } from "hardhat";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
dotenv.config()

const TEST_MINT_VALUE = ethers.utils.parseEther("10");

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

  console.log(`Attaching MyToken to contract`);
  let tokenizedBallotContract: MyToken;
  const tokenizedBallotContractFactory = new MyToken__factory(signer);
  tokenizedBallotContract = tokenizedBallotContractFactory.attach(contractAddress);
  console.log(`Minting tokens to self`);
  const mintToSelfTx = await tokenizedBallotContract.mint(signer.address, TEST_MINT_VALUE);
  const receipt = await mintToSelfTx.wait();
  console.log({ receipt });
  let tokenBalance = await tokenizedBallotContract.balanceOf(signer.address);
  console.log(`ERC20 token balance: ${tokenBalance}`);

  console.log("Delegating voting power to self");
  const delegateTx = await tokenizedBallotContract.delegate(signer.address);
  await delegateTx.wait();
  let votePower = await tokenizedBallotContract.getVotes(signer.address);
  console.log(`Vote power: ${votePower}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
