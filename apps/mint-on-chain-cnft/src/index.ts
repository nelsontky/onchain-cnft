import "dotenv/config";

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

import generateMetaData from "./utils/generateMetadata";
import postMetadataToLedger from "./utils/uploadMetadata";
import createMintCnftInstruction from "./utils/createMintCnftInstruction";
import {
  TokenProgramVersion,
  TokenStandard,
} from "@metaplex-foundation/mpl-bubblegum";
import createMetadataAccount from "./utils/createMetadataAccount";
import initializeMetadataAccount from "./utils/initializeMetadataAccount";
import uploadMetadata from "./utils/uploadMetadata";
import logMetadata from "./utils/logMetadata";

const connection = new Connection(process.env.RPC_ENDPOINT!, "confirmed");
const signer = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))
);

(async () => {
  const metadata = generateMetaData();
  const metadataSize = Buffer.from(metadata).length;

  // const metadataAccount = await createMetadataAccount(
  //   metadataSize,
  //   connection,
  //   signer
  // );

  const metadataAccount = new PublicKey(
    "AnAKsLbqn1mwLv2TkfN73cUJrKGpRj3x4crg7zwcoHLD"
  );
  // await initializeMetadataAccount(
  //   metadataSize,
  //   metadataAccount,
  //   connection,
  //   signer
  // );
  // await uploadMetadata(metadata, metadataAccount, signer, connection);
  const txId = await logMetadata(
    metadataAccount,
    metadataSize,
    connection,
    signer
  );

  console.log(`https://solscan.io/tx/${txId}`);

  // const metadataFile = fs.readFileSync(
  //   path.join(__dirname, "..", "assets", "metadata.json")
  // );
  // const metadata = JSON.parse(metadataFile.toString());
  // const mintCnftInstruction = createMintCnftInstruction(
  //   {
  //     name: metadata.name,
  //     symbol: metadata.symbol,

  //     // this API will combine all the noop inputs of "transactionsCount" number of
  //     // transactions that includes the "signaturesAddress" account before and including
  //     // "lastTxId" into a single metadata file
  //     uri: `https://cnft.sol-idity.com/${signaturesAddress}?latestTxId=${lastTxId}&count=${transactionsCount}`,
  //     creators: [
  //       {
  //         address: signer.publicKey,
  //         verified: false,
  //         share: 100,
  //       },
  //     ],
  //     editionNonce: 0,
  //     uses: null,
  //     collection: null,
  //     primarySaleHappened: false,
  //     sellerFeeBasisPoints: 0,
  //     isMutable: false,
  //     tokenProgramVersion: TokenProgramVersion.Original,
  //     tokenStandard: TokenStandard.NonFungible,
  //   },
  //   signer
  // );

  // const tx = new Transaction().add(mintCnftInstruction);
  // tx.feePayer = signer.publicKey;
  // const txId = await sendAndConfirmTransaction(connection, tx, [signer]);

  // console.log(`cNFT minted in tx: https://xray.helius.xyz/tx/${txId}`);
})();
