import "dotenv/config";

import { Connection, Keypair } from "@solana/web3.js";

import generateMetaData from "./utils/generateMetadata";
import postMetadataToLedger from "./utils/postMetadataToLedger";

const connection = new Connection(process.env.RPC_ENDPOINT!, "confirmed");
const signer = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))
);

(async () => {
  await postMetadataToLedger(generateMetaData(), signer, connection);
})();
