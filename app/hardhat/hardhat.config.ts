require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

// Get the API key from environment variables
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/** @type {import("hardhat/config").HardhatUserConfig} */
const config = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.METAMASK_PRIVATE_KEY
        ? [process.env.METAMASK_PRIVATE_KEY]
        : [],
      gasPrice: 20000000000, // 20 gwei
      gas: 5000000, // 5M gas limit
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.METAMASK_PRIVATE_KEY
        ? [process.env.METAMASK_PRIVATE_KEY]
        : [],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.METAMASK_PRIVATE_KEY
        ? [process.env.METAMASK_PRIVATE_KEY]
        : [],
    },
  },
};

module.exports = config;
