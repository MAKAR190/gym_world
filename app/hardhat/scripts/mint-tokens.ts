import { ethers } from "ethers";
import * as dotenv from "dotenv";
import GWCTokenArtifact from "../artifacts/contracts/GWCToken.sol/GWCToken.json";

dotenv.config();

const GWC_TOKEN_ADDRESS = process.env.GWC_TOKEN_ADDRESS;
const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;

async function main() {
  if (!GWC_TOKEN_ADDRESS || !PRIVATE_KEY) {
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

  // Check current balance
  const currentBalance = await gwcToken.balanceOf(wallet.address);
  console.log(
    "Current wallet balance:",
    ethers.formatEther(currentBalance),
    "GWC"
  );

  const amount = ethers.parseEther("10000");
  console.log(`Attempting to mint ${ethers.formatEther(amount)} tokens...`);

  try {
    // Get current gas price and increase it by 20%
    const feeData = await provider.getFeeData();
    const increasedGasPrice = feeData.gasPrice
      ? (feeData.gasPrice * 120n) / 100n
      : undefined;

    // Get current nonce
    const nonce = await provider.getTransactionCount(wallet.address);

    // Estimate gas for the transaction
    const gasEstimate = await gwcToken.mint.estimateGas(wallet.address, amount);
    const gasLimit = (gasEstimate * 120n) / 100n; // Add 20% buffer

    console.log("Transaction parameters:", {
      gasPrice: increasedGasPrice
        ? ethers.formatUnits(increasedGasPrice, "gwei")
        : "undefined",
      gasLimit: gasLimit.toString(),
      nonce: nonce,
    });

    const tx = await gwcToken.mint(wallet.address, amount, {
      gasPrice: increasedGasPrice,
      gasLimit: gasLimit,
      nonce: nonce,
    });

    console.log("Mint transaction sent:", tx.hash);
    await tx.wait();
    console.log("Mint confirmed!");

    // Check new balance
    const newBalance = await gwcToken.balanceOf(wallet.address);
    console.log("New wallet balance:", ethers.formatEther(newBalance), "GWC");
  } catch (error) {
    console.error("Mint failed:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
