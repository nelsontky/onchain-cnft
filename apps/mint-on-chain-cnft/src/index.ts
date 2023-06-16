import "dotenv/config";

import {
  Connection,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

import generateMetaData from "./utils/generateMetadata";
import postMetadataToLedger from "./utils/postMetadataToLedger";
import createMintCnftInstruction from "./utils/createMintCnftInstruction";
import {
  TokenProgramVersion,
  TokenStandard,
} from "@metaplex-foundation/mpl-bubblegum";

const connection = new Connection(process.env.RPC_ENDPOINT!, "confirmed");
const signer = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))
);

(async () => {
  console.log("Uploading metadata to ledger...");
  const { signaturesAddress, lastTxId, transactionsCount } =
    await postMetadataToLedger(generateMetaData(), signer, connection);

  console.log("Minting cNFT...");
  const metadataFile = fs.readFileSync(
    path.join(__dirname, "..", "assets", "metadata.json")
  );
  const metadata = JSON.parse(metadataFile.toString());
  const mintCnftInstruction = createMintCnftInstruction(
    {
      name: metadata.name,
      symbol: metadata.symbol,

      // this API will combine all the noop inputs of "transactionsCount" number of
      // transactions that includes the "signaturesAddress" account before and including
      // "lastTxId" into a single metadata file
      uri: `https://cnft.sol-idity.com/${signaturesAddress}?latestTxId=${lastTxId}&count=${transactionsCount}`,
      creators: [
        {
          address: signer.publicKey,
          verified: false,
          share: 100,
        },
      ],
      editionNonce: 0,
      uses: null,
      collection: null,
      primarySaleHappened: false,
      sellerFeeBasisPoints: 0,
      isMutable: false,
      tokenProgramVersion: TokenProgramVersion.Original,
      tokenStandard: TokenStandard.NonFungible,
    },
    signer
  );

  const tx = new Transaction().add(mintCnftInstruction);
  tx.feePayer = signer.publicKey;
  const txId = await sendAndConfirmTransaction(connection, tx, [signer]);

  console.log(`cNFT minted in tx: https://xray.helius.xyz/tx/${txId}`);
})();
