import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types/factories/contracts/ERC20Votes.sol/MyToken__factory";
import * as dotenv from 'dotenv'
dotenv.config()

const TEST_MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
  // const accounts = await ethers.getSigners();
  // const [minter, voter, other] = accounts;
  //For the weekend project(requires dotenu)//Check Lesson8 for inspiration
  const provider = ethers.getDefaultProvider("goerli")
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  console.log(`Connected to the acount of address ${signer.address}\nThis account has a balance of ${balanceBN.toString()} Wei`);
  const contractFactory = new MyToken__factory(signer);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(`Tokenized Votes contract deployed at ${contract.address}\n`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
