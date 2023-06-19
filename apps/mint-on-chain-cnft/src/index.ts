import "dotenv/config";

import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

import generateMetaData from "./utils/generateMetadata";
import createMintCnftInstruction from "./utils/createMintCnftInstruction";
import {
  TokenProgramVersion,
  TokenStandard,
} from "@metaplex-foundation/mpl-bubblegum";
import createMetadataAccount from "./utils/createMetadataAccount";
import initializeMetadataAccount from "./utils/initializeMetadataAccount";
import uploadMetadata from "./utils/uploadMetadata";
import logMetadata from "./utils/logMetadata";
import createTransaction from "./utils/createTransaction";
import closeMetadataAccount from "./utils/closeMetadataAccount";

const connection = new Connection(process.env.RPC_ENDPOINT!, "confirmed");
const signer = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))
);

(async () => {
  let metadataAccount: PublicKey | undefined = undefined;
  try {
    const metadata = generateMetaData();
    const metadataSize = Buffer.from(metadata).length;

    metadataAccount = (
      await createMetadataAccount(metadataSize, connection, signer)
    ).publicKey;

    await initializeMetadataAccount(
      metadataSize,
      metadataAccount,
      connection,
      signer
    );
    await uploadMetadata(metadata, metadataAccount, signer, connection);
    const txId = await logMetadata(
      metadataAccount,
      metadataSize,
      connection,
      signer
    );

    console.log(`Metadata txId: https://solscan.io/tx/${txId}`);

    await closeMetadataAccount(metadataAccount, connection, signer);

    // mint cNFT
    console.log("Minting cNFT...");
    const metadataFile = fs.readFileSync(
      path.join(__dirname, "..", "assets", "metadata.json")
    );
    const metadataJson = JSON.parse(metadataFile.toString());
    const mintCnftInstruction = createMintCnftInstruction(
      {
        name: metadataJson.name,
        symbol: metadataJson.symbol,

        // this API will combine all the noop inputs of "transactionsCount" number of
        // transactions that includes the "signaturesAddress" account before and including
        // "lastTxId" into a single metadata file
        uri: `https://cnft.sol-idity.com/${txId}`,
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

    const tx = await createTransaction(
      [mintCnftInstruction],
      signer,
      connection
    );
    const cnftTxId = await sendAndConfirmTransaction(connection, tx, [signer]);

    console.log(`cNFT minted in tx: https://xray.helius.xyz/tx/${cnftTxId}`);
  } catch (e) {
    console.log(`An error occurred: ${e}`);
    if (metadataAccount) {
      await closeMetadataAccount(metadataAccount, connection, signer);
    }
  }
})();
