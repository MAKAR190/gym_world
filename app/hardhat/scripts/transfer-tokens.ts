import { ethers } from "ethers";
import * as dotenv from "dotenv";
import GWCTokenArtifact from "../artifacts/contracts/GWCToken.sol/GWCToken.json";

dotenv.config();

const GWC_TOKEN_ADDRESS = process.env.GWC_TOKEN_ADDRESS;
const WORKOUT_REWARDS_ADDRESS = process.env.WORKOUT_REWARDS_ADDRESS;
const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;

async function main() {
  if (!GWC_TOKEN_ADDRESS || !WORKOUT_REWARDS_ADDRESS || !PRIVATE_KEY) {
    throw new Error(
      "Missing environment variables for addresses or private key"
    );
  }

  const provider = new ethers.JsonRpcProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  );
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const gwcToken = new ethers.Contract(
    GWC_TOKEN_ADDRESS,
    GWCTokenArtifact.abi,
    wallet
  );

  // Check wallet balance
  const walletBalance = await gwcToken.balanceOf(wallet.address);
  console.log("Wallet balance:", ethers.formatEther(walletBalance), "GWC");

  // Check contract balance
  const contractBalance = await gwcToken.balanceOf(WORKOUT_REWARDS_ADDRESS);
  console.log("Contract balance:", ethers.formatEther(contractBalance), "GWC");

  const amount = ethers.parseEther("1000"); // Change this value as needed
  console.log(
    `Attempting to transfer ${ethers.formatEther(
      amount
    )} tokens to WorkoutRewards contract...`
  );

  // Check if wallet has enough tokens
  if (walletBalance < amount) {
    throw new Error(
      `Insufficient balance. Have: ${ethers.formatEther(
        walletBalance
      )}, Need: ${ethers.formatEther(amount)}`
    );
  }

  try {
    const tx = await gwcToken.transfer(WORKOUT_REWARDS_ADDRESS, amount);
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Transfer confirmed!");

    // Check final balances
    const newWalletBalance = await gwcToken.balanceOf(wallet.address);
    const newContractBalance = await gwcToken.balanceOf(
      WORKOUT_REWARDS_ADDRESS
    );
    console.log(
      "New wallet balance:",
      ethers.formatEther(newWalletBalance),
      "GWC"
    );
    console.log(
      "New contract balance:",
      ethers.formatEther(newContractBalance),
      "GWC"
    );
  } catch (error) {
    console.error("Transfer failed:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
