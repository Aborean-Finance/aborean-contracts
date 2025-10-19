# Aborean Finance Core Contracts

Aborean Finance is an automated market maker (AMM) and ve-tokenomics protocol
inspired by Solidly and Aerodrome Finance. This repository contains the on-chain
smart contracts that power the protocol.

See `SPECIFICATION.md` for more detail on architecture and flows.

## Protocol Overview

### AMM contracts

| Filename | Description |
| --- | --- |
| `Pool.sol` | AMM constant-product implementation similar to Uniswap V2 liquidity pools |
| `Router.sol` | Handles multi-pool swaps, deposit/withdrawal, similar to Uniswap V2 Router interface |
| `PoolFees.sol` | Stores the liquidity pool trading fees, these are kept separate from the reserves |
| `ProtocolLibrary.sol` | Provides router-related helpers, eg. for price-impact calculations |
| `FactoryRegistry.sol` | Registry of factories approved for creation of pools, gauges, bribes and managed rewards. |

### Tokenomy contracts

| Filename | Description |
| --- | --- |
| `Abx.sol` | Protocol ERC20 token |
| `VotingEscrow.sol` | Protocol ERC-721 (ve)NFT representing the protocol vote-escrow lock. Beyond standard ve-type functions, there is also the ability to merge, split and create managed nfts. |
| `Minter.sol` | Protocol token minter. Distributes emissions to `Voter.sol` and rebases to `RewardsDistributor.sol`. |
| `RewardsDistributor.sol` | Is used to handle the rebases distribution for (ve)NFTs/lockers. |
| `VeArtProxy.sol` | (ve)NFT art proxy contract, exists for upgradability purposes |
| `AirdropDistributor.sol` | Distributes permanently locked (ve)NFTs to the provided addresses, in the desired amounts. |

### Protocol mechanics contracts

| Filename | Description |
| --- | --- |
| `Voter.sol` | Handles votes for the current epoch, gauge and voting reward creation as well as emission distribution to `Gauge.sol` contracts. |
| `Gauge.sol` | Gauges are attached to a Pool and based on the (ve)NFT votes it receives, it distributes proportional emissions in the form of protocol tokens. Deposits to the gauge take the form of LP tokens for the Pool. In exchange for receiving protocol emissions, claims on fees from the pool are relinquished to the gauge. Standard rewards contract. |
| `rewards/` | |
| `Reward.sol` | Base reward contract to be inherited for distribution of rewards to stakers.
| `VotingReward.sol` | Rewards contracts used by `FeesVotingReward.sol` and `BribeVotingReward.sol` which inherits `Reward.sol`. Rewards are distributed in the following epoch proportionally based on the last checkpoint created by the user, and are earned through "voting" for a pool or gauge. |
| `FeesVotingReward.sol` | Stores LP fees (from the gauge via `PoolFees.sol`) to be distributed for the current voting epoch to it's voters. |
| `BribeVotingReward.sol` | Stores the users/externally provided rewards for the current voting epoch to it's voters. These are deposited externally every week. |
| `ManagedReward.sol` | Staking implementation for managed veNFTs used by `LockedManagedReward.sol` and `FreeManagedReward.sol` which inherits `Reward.sol`.  Rewards can be earned passively by veNFTs who delegate their voting power to a "managed" veNFT.
| `LockedManagedReward.sol` | Handles "locked" rewards (i.e. ABX emissions / rebases that are compounded) for managed NFTs. Rewards are not distributed and only returned to `VotingEscrow.sol` when the user withdraws from the managed NFT. | 
| `FreeManagedReward.sol` | Handles "free" (i.e. unlocked) rewards for managed NFTs. Any rewards earned by a managed NFT that a manager passes on will be distributed to the users that deposited into the managed NFT. | 

### Governance contracts

| Filename | Description |
| --- | --- |
| `ProtocolGovernor.sol` | OpenZeppelin's Governor contracts used in protocol-wide access control to whitelist tokens for trade  within the protocol, update minting emissions, and create managed veNFTs. |
| `EpochGovernor.sol` | A simple epoch-based governance contract used exclusively for adjusting emissions. |


## Testing

This repository uses Foundry for testing and deployment. 

Foundry Setup

```
forge install
forge build
forge test
```

## Base Mainnet Fork Tests

In order to run mainnet fork tests against base, inherit `BaseTest` in `BaseTest.sol` in your new class and set the `deploymentType` variable to `Deployment.FORK`. The `BASE_RPC_URL` field must be set in `.env`. Optionally, `BLOCK_NUMBER` can be set in the `.env` file or in the test file if you wish to test against a consistent fork state (this will make tests faster).


## Lint

`yarn format` to run prettier.

`yarn lint` to run solhint (currently disabled in CI).

## Deployment

See `script/README.md` for more detail.

### Access Control
See `PERMISSIONS.md` for more detail.

### Abstract Mainnet

| Contract | Address |
| --- | --- |
| Abx | [0x4C68E4102c0F120cce9F08625bd12079806b7C4D](https://abscan.org/address/0x4C68E4102c0F120cce9F08625bd12079806b7C4D) |
| AirdropDistributor | [0xd29d05bFfb2F0AfBB76ed217d726Ff5922253086](https://abscan.org/address/0xd29d05bFfb2F0AfBB76ed217d726Ff5922253086) |
| FactoryRegistry | [0x5927E0C4b307Af16260327DE3276CE17d8A4aB49](https://abscan.org/address/0x5927E0C4b307Af16260327DE3276CE17d8A4aB49) |
| Forwarder | [0x3f91b806F1968Fca85C08A7eE9A7262D7207A9c1](https://abscan.org/address/0x3f91b806F1968Fca85C08A7eE9A7262D7207A9c1) |
| GaugeFactory | [0x29BfEd845b1C10e427766b21d4533800B6f4e111](https://abscan.org/address/0x29BfEd845b1C10e427766b21d4533800B6f4e111) |
| ManagedRewardsFactory | [0x889d93f9c3586ec7CD287eE4e7C96E544985Ee95](https://abscan.org/address/0x889d93f9c3586ec7CD287eE4e7C96E544985Ee95) |
| Minter | [0x58564Fcfc5a0C57887eFC0beDeC3EB5Ec37f1626](https://abscan.org/address/0x58564Fcfc5a0C57887eFC0beDeC3EB5Ec37f1626) |
| Pool | [0x3E5791019A9Fae2805d69965b06dcEFC43Cd1A79](https://abscan.org/address/0x3E5791019A9Fae2805d69965b06dcEFC43Cd1A79) |
| PoolFactory | [0xF6cDfFf7Ad51caaD860e7A35d6D4075d74039a6B](https://abscan.org/address/0xF6cDfFf7Ad51caaD860e7A35d6D4075d74039a6B) |
| RewardsDistributor | [0x36cbf77D8F8355D7A077d670C29E290E41367072](https://abscan.org/address/0x36cbf77D8F8355D7A077d670C29E290E41367072) |
| Router | [0xE8142D2f82036B6FC1e79E4aE85cF53FBFfDC998](https://abscan.org/address/0xE8142D2f82036B6FC1e79E4aE85cF53FBFfDC998) |
| VeArtProxy | [0x53AF068205CB466d7Ce6e55fD1E64eB9eBcB7ce0](https://abscan.org/address/0x53AF068205CB466d7Ce6e55fD1E64eB9eBcB7ce0) |
| Voter | [0xC0F53703e9f4b79fA2FB09a2aeBA487FA97729c9](https://abscan.org/address/0xC0F53703e9f4b79fA2FB09a2aeBA487FA97729c9) |
| VotingEscrow | [0x27B04370D8087e714a9f557c1EFF7901cea6bB63](https://abscan.org/address/0x27B04370D8087e714a9f557c1EFF7901cea6bB63) |
| VotingRewardsFactory | [0xCEf48ee1b2F7c0833D6F097c69D1ed4159b60958](https://abscan.org/address/0xCEf48ee1b2F7c0833D6F097c69D1ed4159b60958) |


#### Reproducing Deployments

- Scripts under `deploy/` (powered by Hardhat Deploy) recreate the production
  rollout. They expect a configuration file at `deploy/config/<network>.json`,
  so copy and edit the provided `*.example.json` templates before running the
  scripts.
- Deployment artifacts for each chain are stored in `deployments/<network>/`.
  Hardhat uses these files to resolve existing addresses and ABIs during future
  runs, and they double as on-chain records for integrations.
- Export the required environment variables (`PRIVATE_KEY_DEPLOY`,
  `ABSTRACT_MAINNET_RPC_URL`, etc.) then run `yarn deploy:abstract-mainnet` or
  `yarn deploy:abstract-testnet` to execute the staged deployment sequence.
- After redeploying, update the contract table above and commit any changes in
  `deployments/` so the repository reflects the live state.

## Licensing

Aborean Finance code is released under the GNU General Public License v3.0 or
later. The full license text is available at
`LICENSES/ABOREAN_FINANCE_GPL-3.0-OR-LATER.md`. This fork retains the upstream
Business Source License 1.1 from Perpetual Cyclist Services LLC, reproduced in
`LICENSE.md`, and all redistribution must comply with both licensing regimes.
We forked the upstream contracts only after the Business Source License change
date was reached, so the GPL change
license now applies to the inherited code as well as our own contributions.
Additional attribution and third-party license information can be found in
`NOTICE.md`.
