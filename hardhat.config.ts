// SPDX-License-Identifier: GPL-3.0-or-later
import { HardhatUserConfig } from "hardhat/config";
import "@matterlabs/hardhat-zksync";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-verify";
import "@matterlabs/hardhat-zksync-ethers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.19",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                    suppressedErrors: ["sendtransfer"],
                    suppressedWarnings: ["txorigin", "assemblycreate"],
                },
            },
            {
                version: "0.8.20",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                    suppressedErrors: ["sendtransfer"],
                    suppressedWarnings: ["txorigin", "assemblycreate"],
                },
            },
            {
                version: "0.8.22",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                    suppressedErrors: ["sendtransfer"],
                    suppressedWarnings: ["txorigin", "assemblycreate"],
                },
            },
        ]
    },

    zksolc: {
        version: "1.5.15",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            suppressedErrors: ["sendtransfer"],
            suppressedWarnings: ["txorigin", "assemblycreate"],
            codegen: "yul",
            libraries: {
                "contracts/art/PerlinNoise.sol": {
                    "PerlinNoise": "0x25B11E6e5b2d1A7309A98274b459d4d0081c85Ef"
                },
                "contracts/art/Trig.sol": {
                    "Trig": "0x00b2Ed8c1c84B02614B3579fF830b9aDbd52f273"
                },
                "contracts/libraries/BalanceLogicLibrary.sol": {
                    "BalanceLogicLibrary": "0x58025B26C518ac345bA1476B050BAb9f4A20B35d"
                },
                "contracts/libraries/DelegationLogicLibrary.sol": {
                    "DelegationLogicLibrary": "0x2A7Db0012bfE811a79b6888800D6E1aDc0d8c10C"
                }
            }
        },
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            zksync: false,
        },
        abstractTestnet: {
            url: "https://api.testnet.abs.xyz",
            ethNetwork: "sepolia",
            zksync: true,
            chainId: 11124,
            accounts: process.env.PRIVATE_KEY_DEPLOY ? [process.env.PRIVATE_KEY_DEPLOY] : [],
            // verify: {
            //   etherscan: {
            //     apiKey: process.env.ABSTRACT_TESTNET_API_KEY || "",
            //   },
            // },
        },
        abstractMainnet: {
            url: "https://api.mainnet.abs.xyz",
            ethNetwork: "mainnet",
            zksync: true,
            chainId: 2741,
            verifyURL: "https://api-explorer-verify.mainnet.abs.xyz/contract_verification",
            enableVerifyURL: true,
            accounts: process.env.PRIVATE_KEY_DEPLOY ? [process.env.PRIVATE_KEY_DEPLOY] : [],
            // verify: {
            //   etherscan: {
            //     apiKey: process.env.ABSTRACT_MAINNET_API_KEY || "",
            //   },
            // },
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        team: {
            default: 1,
            abstractTestnet: process.env.TEAM_ADDRESS || "",
            abstractMainnet: process.env.TEAM_ADDRESS || "",
        },
        feeManager: {
            default: 2,
            abstractTestnet: process.env.FEE_MANAGER_ADDRESS || "",
            abstractMainnet: process.env.FEE_MANAGER_ADDRESS || "",
        },
        emergencyCouncil: {
            default: 3,
            abstractTestnet: process.env.EMERGENCY_COUNCIL_ADDRESS || "",
            abstractMainnet: process.env.EMERGENCY_COUNCIL_ADDRESS || "",
        },
        allowedManager: {
            default: 4,
            abstractTestnet: process.env.ALLOWED_MANAGER_ADDRESS || "",
            abstractMainnet: process.env.ALLOWED_MANAGER_ADDRESS || "",
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
        deploy: "./deploy",
        deployments: "./deployments",
    },
    typechain: {
        outDir: "typechain-types",
        target: "ethers-v6",
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    etherscan: {
        apiKey: process.env.ABSTRACT_MAINNET_API_KEY || "",

        customChains: [
            {
                network: "abstractTestnet",
                chainId: 11124,
                urls: {
                    apiURL: "https://api-sepolia.abscan.org/api",
                    browserURL: "https://sepolia.abscan.org",
                },
            },
            {
                network: "abstractMainnet",
                chainId: 2741,
                urls: {
                    apiURL: 'https://api.etherscan.io/v2/api',
                    browserURL: "https://abscan.org/",
                },
            },
        ],
    },
};

export default config;
