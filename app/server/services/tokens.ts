import { ethers } from "ethers";
import { getCurrentUser } from "./auth";
import { AppErrorCodes } from "@/types/AppModels";
import WorkoutRewardsArtifact from "../../assets/contracts/WorkoutRewards.json";
import GWCTokenArtifact from "../../assets/contracts/GWCToken.json";

const WORKOUT_REWARDS_ADDRESS = process.env.EXPO_PUBLIC_WORKOUT_REWARDS_ADDRESS;
const GWC_TOKEN_ADDRESS = process.env.EXPO_PUBLIC_GWC_TOKEN_ADDRESS;

if (!WORKOUT_REWARDS_ADDRESS) {
  console.error("EXPO_PUBLIC_WORKOUT_REWARDS_ADDRESS is not set");
  throw AppErrorCodes.REWARD_WORKOUT_FAILED;
}

if (!GWC_TOKEN_ADDRESS) {
  console.error("EXPO_PUBLIC_GWC_TOKEN_ADDRESS is not set");
  throw AppErrorCodes.REWARD_WORKOUT_FAILED;
}

const WORKOUT_REWARDS_ABI = WorkoutRewardsArtifact.abi;
const GWC_TOKEN_ABI = GWCTokenArtifact.abi;

export const rewardWorkout = async ({
  reps,
  weight,
  time,
  distance,
}: {
  reps: number;
  weight: number;
  time: number;
  distance: number;
}) => {
  const { user } = await getCurrentUser();

  if (!user) {
    throw AppErrorCodes.USER_NOT_FOUND;
  }

  if (!user.wallet_address) {
    throw AppErrorCodes.USER_WALLET_NOT_FOUND;
  }

  try {
    // Connect to the blockchain network
    if (!process.env.EXPO_PUBLIC_ALCHEMY_API_KEY) {
      console.error("EXPO_PUBLIC_ALCHEMY_API_KEY is not set");
      throw AppErrorCodes.REWARD_WORKOUT_FAILED;
    }

    console.log("Debug - Network config:", {
      rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.EXPO_PUBLIC_ALCHEMY_API_KEY}`,
      hasPrivateKey: !!process.env.EXPO_PUBLIC_METAMASK_PRIVATE_KEY,
    });

    const provider = new ethers.providers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.EXPO_PUBLIC_ALCHEMY_API_KEY}`,
      {
        name: "sepolia",
        chainId: 11155111,
      }
    );

    // Test network connection
    try {
      const network = await provider.getNetwork();
      console.log("Successfully connected to network:", network.name);
      if (network.chainId !== 11155111) {
        throw new Error("Not connected to Sepolia network");
      }
    } catch (error) {
      console.error("Failed to connect to network:", error);
      throw AppErrorCodes.REWARD_WORKOUT_FAILED;
    }

    if (!process.env.EXPO_PUBLIC_METAMASK_PRIVATE_KEY) {
      console.error("EXPO_PUBLIC_METAMASK_PRIVATE_KEY is not set");
      throw AppErrorCodes.REWARD_WORKOUT_FAILED;
    }

    const wallet = new ethers.Wallet(
      process.env.EXPO_PUBLIC_METAMASK_PRIVATE_KEY,
      provider
    );

    console.log("Debug - Wallet config:", {
      walletAddress: wallet.address,
      network: (await provider.getNetwork()).name,
    });

    // Create contract instance
    if (!WORKOUT_REWARDS_ADDRESS) {
      console.error("WorkoutRewards contract address is not set");
      throw AppErrorCodes.REWARD_WORKOUT_FAILED;
    }

    if (!user.wallet_address) {
      console.error("User wallet address is not set");
      throw AppErrorCodes.REWARD_WORKOUT_FAILED;
    }

    console.log("Debug - Contract values:", {
      userAddress: user.wallet_address,
      reps,
      weight,
      time,
      distance,
      contractAddress: WORKOUT_REWARDS_ADDRESS,
      walletAddress: wallet.address,
    });

    // Check wallet balance
    const walletBalance = await provider.getBalance(wallet.address);
    console.log(
      "Debug - Wallet balance:",
      ethers.utils.formatEther(walletBalance)
    );

    const workoutRewardsContract = new ethers.Contract(
      WORKOUT_REWARDS_ADDRESS,
      WORKOUT_REWARDS_ABI,
      wallet
    );

    // Check contract token balance
    const gwcTokenContract = new ethers.Contract(
      GWC_TOKEN_ADDRESS,
      GWC_TOKEN_ABI,
      provider
    );

    try {
      // Verify GWC token contract
      console.log("Debug - Verifying GWC token contract...");
      try {
        const tokenName = await gwcTokenContract.name();
        const tokenSymbol = await gwcTokenContract.symbol();
        console.log("Debug - GWC token contract verified:", {
          name: tokenName,
          symbol: tokenSymbol,
        });
      } catch (error) {
        console.error("GWC token contract verification failed:", error);
        throw new Error(
          "GWC token contract is not deployed or address is incorrect"
        );
      }

      // Verify WorkoutRewards contract
      console.log("Debug - Verifying WorkoutRewards contract...");
      try {
        const owner = await workoutRewardsContract.owner();
        console.log("Debug - WorkoutRewards contract verified:", { owner });
      } catch (error) {
        console.error("WorkoutRewards contract verification failed:", error);
        throw new Error(
          "WorkoutRewards contract is not deployed or address is incorrect"
        );
      }

      console.log("Debug - Checking token contract at:", GWC_TOKEN_ADDRESS);
      const contractTokenBalance = await gwcTokenContract.balanceOf(
        WORKOUT_REWARDS_ADDRESS
      );
      console.log(
        "Debug - Contract token balance:",
        ethers.utils.formatEther(contractTokenBalance)
      );
      console.log("Debug - Contract addresses:", {
        workoutRewards: WORKOUT_REWARDS_ADDRESS,
        gwcToken: GWC_TOKEN_ADDRESS,
      });

      // Check if contract has enough tokens
      if (contractTokenBalance.eq(0)) {
        console.error("Contract has no tokens to reward workouts");
        throw AppErrorCodes.REWARD_WORKOUT_FAILED;
      }

      // Estimate gas first
      console.log("Debug - Estimating gas for rewardWorkout...");
      const gasEstimate = await workoutRewardsContract.estimateGas
        .rewardWorkout(user.wallet_address, reps, weight, time, distance)
        .catch((error: Error) => {
          console.error("Gas estimation error:", error);
          throw error;
        });

      console.log("Debug - Gas estimate:", gasEstimate.toString());

      // Call the rewardWorkout function with all required parameters
      console.log("Debug - Sending rewardWorkout transaction...");
      const tx = await workoutRewardsContract.rewardWorkout(
        user.wallet_address,
        reps,
        weight,
        time,
        distance,
        {
          gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer
        }
      );
      console.log("Debug - Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Debug - Transaction confirmed");

      return {
        success: true,
        transactionHash: tx.hash,
        reps,
        weight,
        time,
        distance,
      };
    } catch (error: unknown) {
      console.error("Contract call error:", error);
      if (error instanceof Error && error.message.includes("CALL_EXCEPTION")) {
        console.error("Contract call failed. This could be due to:");
        console.error("1. Contract address is incorrect");
        console.error("2. Contract has insufficient token balance");
        console.error("3. Contract function is reverting");
        console.error("4. Contract is not deployed at the specified address");
      }
      throw AppErrorCodes.REWARD_WORKOUT_FAILED;
    }
  } catch (error) {
    console.error("Error rewarding workout:", error);
    throw AppErrorCodes.REWARD_WORKOUT_FAILED;
  }
};

export const getTokenBalance = async (walletAddress: string) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.EXPO_PUBLIC_ALCHEMY_API_KEY}`
    );
    const tokenContract = new ethers.Contract(
      GWC_TOKEN_ADDRESS,
      GWC_TOKEN_ABI,
      provider
    );

    const balance = await tokenContract.balanceOf(walletAddress);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error("Error getting token balance:", error);
    throw AppErrorCodes.GET_TOKEN_BALANCE_FAILED;
  }
};

export const transferTokensToRewardsContract = async (amount: string) => {
  try {
    if (!process.env.EXPO_PUBLIC_ALCHEMY_API_KEY) {
      console.error("EXPO_PUBLIC_ALCHEMY_API_KEY is not set");
      throw AppErrorCodes.REWARD_WORKOUT_FAILED;
    }

    const provider = new ethers.providers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.EXPO_PUBLIC_ALCHEMY_API_KEY}`,
      {
        name: "sepolia",
        chainId: 11155111,
      }
    );

    if (!process.env.EXPO_PUBLIC_METAMASK_PRIVATE_KEY) {
      console.error("EXPO_PUBLIC_METAMASK_PRIVATE_KEY is not set");
      throw AppErrorCodes.REWARD_WORKOUT_FAILED;
    }

    const wallet = new ethers.Wallet(
      process.env.EXPO_PUBLIC_METAMASK_PRIVATE_KEY,
      provider
    );

    const gwcTokenContract = new ethers.Contract(
      GWC_TOKEN_ADDRESS,
      GWC_TOKEN_ABI,
      wallet
    );

    console.log("Debug - Transferring tokens to WorkoutRewards contract...");
    const tx = await gwcTokenContract.transfer(
      WORKOUT_REWARDS_ADDRESS,
      ethers.utils.parseEther(amount)
    );
    console.log("Debug - Transfer transaction sent:", tx.hash);
    await tx.wait();
    console.log("Debug - Transfer confirmed");

    return {
      success: true,
      transactionHash: tx.hash,
    };
  } catch (error) {
    console.error("Error transferring tokens:", error);
    throw AppErrorCodes.REWARD_WORKOUT_FAILED;
  }
};
