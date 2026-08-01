require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },

    networks: {
        fuji: {
            url: process.env.RPC_URL,
            accounts: [
                process.env.PRIVATE_KEY
            ]
        }
    },

    etherscan: {
        apiKey: {
            avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || "API_KEY_PLACEHOLDER"
        },
        customChains: [
            {
                network: "avalancheFujiTestnet",
                chainId: 43113,
                urls: {
                    apiURL: "https://api-testnet.snowtrace.io/api",
                    browserURL: "https://testnet.snowtrace.io"
                }
            }
        ]
    }
};