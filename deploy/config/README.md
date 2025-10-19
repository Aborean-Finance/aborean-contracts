# Deployment Configuration

Each Hardhat deployment script expects a JSON configuration file named after the
network you are targeting (for example `abstractMainnet.json` or
`abstractTestnet.json`). The configuration controls admin addresses, whitelist
tokens, pool pairs, and airdrop allocations consumed by the scripts in
`deploy/`.

To deploy to a live network:

1. Copy the closest `*.example.json` file in this directory and rename it to the
   target network name, e.g. `abstractMainnet.json`.
2. Replace the placeholder addresses and token allocations with the values you
   intend to use on-chain. All amounts must be encoded as stringified integers
   in wei.
3. Ensure the `PRIVATE_KEY_DEPLOY` environment variable is available when
   running Hardhat so that the scripts can sign transactions.

The configuration schema matches the TypeScript interfaces defined in the
deploy scripts:

- `WETH`, `allowedManager`, `team`, `feeManager`, `emergencyCouncil`: admin
  addresses used during core deployment.
- `whitelistTokens`: ERC-20 tokens pre-approved for trading and incentives.
- `minter`: liquid and locked allocations used when initialising the `Minter`
  and `AirdropDistributor`.
- `pools` / `poolsAbx`: pool pairs that should be created immediately after the
  core deployment.
- `airdrops.locked`: addresses and amounts for distributing locked veNFTs.

Keep private keys, mnemonics, and any other sensitive data out of these JSON
files. Use environment variables for secrets and commit only the non-sensitive
configuration needed for reproducibility.
