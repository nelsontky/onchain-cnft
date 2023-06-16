# On Chain compressed NFTs

Create compressed NFTs where all the metadata (including image) is stored on the Solana ledger!

## How to mint your own on chain compressed NFT

1. Pull the repo and `yarn install` from the root directory.
2. `cd` to `apps/mint-on-chain-cnft`
3. `cp .env.example .env`, and update the values in `.env`.
4. Replace the `image.png` and `metadata.json` in the `assets` folder. (Keep the filenames, and try not to use images that are > 100kb as the scripts are still pretty lousy)
5. Run the script via `yarn ts-node src/index.ts`, and your cNFT should appear in your wallet in a minute or two!

## How does this work

https://twitter.com/sol_idity/status/1669750091933188102
