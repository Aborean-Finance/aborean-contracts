// SPDX-License-Identifier: GPL-3.0-or-later
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

interface PoolConfig {
  stable: boolean;
  tokenA: string;
  tokenB: string;
}

interface PoolAbxConfig {
  stable: boolean;
  token: string;
}

interface DeployConfig {
  pools: PoolConfig[];
  poolsAbx: PoolAbxConfig[];
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network, ethers } = hre;
  const { get, log, save } = deployments;

  const { deployer } = await getNamedAccounts();

  log(`Deploying pools and gauges to network: ${network.name}`);
  log(`Deployer: ${deployer}`);

  // Load deployment configuration
  const path = require('path');
  const configPath = path.join(__dirname, '..', 'config', `${network.name}.json`);
  let config: DeployConfig;
  try {
    config = require(configPath);
  } catch (error) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }

  // Skip deployment if no pools are configured
  if ((!config.pools || config.pools.length === 0) && (!config.poolsAbx || config.poolsAbx.length === 0)) {
    log("No pools configured for deployment. Skipping pools and gauges deployment.");
    return;
  }

  // Get deployed contract addresses from previous deployment
  const poolFactory = await get("PoolFactory");
  const voter = await get("Voter");
  const abx = await get("Abx");

  // Use PoolFactory contract interface (now zkSync compatible)
  const poolFactoryContract = await ethers.getContractAt("PoolFactory", poolFactory.address);
  const voterContract = await ethers.getContractAt("Voter", voter.address);
  const signerDeployer = await ethers.getSigner(deployer);

  const deployedPools: string[] = [];
  const deployedGauges: string[] = [];

  log(`Using PoolFactory at: ${poolFactory.address}`);
  log(`Using Voter at: ${voter.address}`);
  log(`Using ABX token at: ${abx.address}`);

  // Deploy non-ABX pools and their gauges (following Foundry script pattern)
  if (config.pools && config.pools.length > 0) {
    log(`\n=== DEPLOYING NON-ABX POOLS AND GAUGES ===`);
    log(`Number of non-ABX pools to deploy: ${config.pools.length}`);

    for (let i = 0; i < config.pools.length; i++) {
      const poolConfig = config.pools[i];

      log(`\nCreating pool ${i + 1}/${config.pools.length}:`);
      log(`  TokenA: ${poolConfig.tokenA}`);
      log(`  TokenB: ${poolConfig.tokenB}`);
      log(`  Stable: ${poolConfig.stable}`);

      try {
        // Create pool
        const poolTx = await poolFactoryContract.connect(signerDeployer).createPool(
          poolConfig.tokenA,
          poolConfig.tokenB,
          poolConfig.stable,
          {
            gasLimit: 3000000, // Set high gas limit for pool creation
          }
        );
        await poolTx.wait();

        // Get the created pool address
        const poolAddress = await poolFactoryContract.getPool(
          poolConfig.tokenA,
          poolConfig.tokenB,
          poolConfig.stable
        );

        if (poolAddress === ethers.ZeroAddress) {
          throw new Error(`Failed to create pool for ${poolConfig.tokenA}/${poolConfig.tokenB}`);
        }

        log(`  Pool created: ${poolAddress}`);

        // Create gauge for the pool
        const gaugeTx = await voterContract.connect(signerDeployer).createGauge(
          poolFactory.address,
          poolAddress,
          {
            gasLimit: 2000000, // Set high gas limit for gauge creation
          }
        );
        await gaugeTx.wait();

        // Get the created gauge address
        const gaugeAddress = await voterContract.gauges(poolAddress);

        if (gaugeAddress === ethers.ZeroAddress) {
          throw new Error(`Failed to create gauge for pool ${poolAddress}`);
        }

        deployedPools.push(poolAddress);
        deployedGauges.push(gaugeAddress);

        log(`  Gauge created: ${gaugeAddress}`);
        log(`  ✅ Pool and gauge deployment successful`);

      } catch (error) {
        log(`  ❌ Error deploying pool ${i + 1}: ${error.message}`);
        throw error;
      }
    }
  }

  // Deploy ABX pools and their gauges (following Foundry script pattern)
  if (config.poolsAbx && config.poolsAbx.length > 0) {
    log(`\n=== DEPLOYING ABX POOLS AND GAUGES ===`);
    log(`Number of ABX pools to deploy: ${config.poolsAbx.length}`);

    for (let i = 0; i < config.poolsAbx.length; i++) {
      const poolConfig = config.poolsAbx[i];

      log(`\nCreating ABX pool ${i + 1}/${config.poolsAbx.length}:`);
      log(`  ABX: ${abx.address}`);
      log(`  Token: ${poolConfig.token}`);
      log(`  Stable: ${poolConfig.stable}`);

      try {
        // Create pool (ABX as tokenA, other token as tokenB)
        const poolTx = await poolFactoryContract.connect(signerDeployer).createPool(
          abx.address,
          poolConfig.token,
          poolConfig.stable,
          {
            gasLimit: 3000000, // Set high gas limit for pool creation
          }
        );
        await poolTx.wait();

        // Get the created pool address
        const poolAddress = await poolFactoryContract.getPool(
          abx.address,
          poolConfig.token,
          poolConfig.stable
        );

        if (poolAddress === ethers.ZeroAddress) {
          throw new Error(`Failed to create ABX pool for ${abx.address}/${poolConfig.token}`);
        }

        log(`  Pool created: ${poolAddress}`);

        // Create gauge for the pool
        const gaugeTx = await voterContract.connect(signerDeployer).createGauge(
          poolFactory.address,
          poolAddress,
          {
            gasLimit: 2000000, // Set high gas limit for gauge creation
          }
        );
        await gaugeTx.wait();

        // Get the created gauge address
        const gaugeAddress = await voterContract.gauges(poolAddress);

        if (gaugeAddress === ethers.ZeroAddress) {
          throw new Error(`Failed to create gauge for ABX pool ${poolAddress}`);
        }

        deployedPools.push(poolAddress);
        deployedGauges.push(gaugeAddress);

        log(`  Gauge created: ${gaugeAddress}`);
        log(`  ✅ ABX pool and gauge deployment successful`);

      } catch (error) {
        log(`  ❌ Error deploying ABX pool ${i + 1}: ${error.message}`);
        throw error;
      }
    }
  }

  // Save deployment data for reference (following Foundry script output pattern)
  await save("DeployedPools", {
    abi: [],
    address: ethers.ZeroAddress, // dummy address for data storage
    args: [],
    linkedData: {
      pools: deployedPools,
      gauges: deployedGauges,
    },
  });

  log(`\n=== POOLS AND GAUGES DEPLOYMENT COMPLETED! ===`);
  log(`Total pools deployed: ${deployedPools.length}`);
  log(`Total gauges deployed: ${deployedGauges.length}`);

  if (deployedPools.length > 0) {
    log(`\nDeployed Pools:`);
    deployedPools.forEach((pool, index) => {
      log(`  ${index + 1}. ${pool}`);
    });

    log(`\nDeployed Gauges:`);
    deployedGauges.forEach((gauge, index) => {
      log(`  ${index + 1}. ${gauge}`);
    });
  }

  log("\nNext deployment step: Run 003_deploy_governors.ts");
};

export default func;
func.tags = ["Pools", "Gauges"];
func.dependencies = ["Core"];
