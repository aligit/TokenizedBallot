import * as dotenv from "dotenv";
import { Wallet } from "ethers";
import { InfuraProvider } from "@ethersproject/providers";
import { TokenizedBallot, TokenizedBallot__factory, MyToken } from "../typechain-types";
import { MyToken__factory } from "../typechain-types";
dotenv.config();

async function main() {
  let args = process.argv;
  let params = args.slice(2);
  let proposals;

  const provider = new InfuraProvider("goerli", process.env.INFURA_KEY);
  const wallet = new Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  const contractAddress = params[0];
  const newDelegateAccount = params[1];

  const myTokenFactory = new MyToken__factory(signer);
  let myTokenContract: MyToken = await myTokenFactory.attach(contractAddress);

  const delegateTx = await myTokenContract.delegate(newDelegateAccount);

  const delegateReceipt = await delegateTx.wait();

  console.log(`receipt hashcode for tx is: ${delegateReceipt.transactionHash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});