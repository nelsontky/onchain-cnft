import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import createTransaction from "./createTransaction";
import { chunk } from "lodash";
import getProgram from "./getProgram";

const PART_LENGTH = 981;
const TRANSACTION_CHUNK_SIZE = 6;

export default async function uploadMetadata(
  metadata: string,
  metadataAccount: PublicKey,
  signer: Keypair,
  connection: Connection
) {
  console.log("Uploading metadata...");

  const transactionsCount = Math.ceil(metadata.length / PART_LENGTH);
  const metadataBuffer = Buffer.from(metadata);
  const metadataBufferParts = Array.from(
    { length: transactionsCount },
    (_, i) =>
      metadataBuffer.subarray(
        i * PART_LENGTH,
        Math.min((i + 1) * PART_LENGTH, metadata.length)
      )
  );

  const chunks = chunk(metadataBufferParts, TRANSACTION_CHUNK_SIZE);

  // I know this is not the best way to do it, but it works decently
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    await Promise.all(
      chunk.map(async (part, j) => {
        const index = (i * TRANSACTION_CHUNK_SIZE + j) * PART_LENGTH;
        const instruction = await getProgram(connection, signer)
          .methods.update(index, part)
          .accounts({
            authority: signer.publicKey,
            metadata: metadataAccount,
          })
          .instruction();

        const transaction = await createTransaction(
          [instruction],
          signer,
          connection
        );
        const txId = await connection.sendRawTransaction(
          transaction.serialize()
        );
        await connection.confirmTransaction(txId);
        return txId;
      })
    );

    console.log(
      `Sent ${Math.min(
        (i + 1) * TRANSACTION_CHUNK_SIZE,
        transactionsCount
      )}/${transactionsCount} transactions`
    );
  }
}
