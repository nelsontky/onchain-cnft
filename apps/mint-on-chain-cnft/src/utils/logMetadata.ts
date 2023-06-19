import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import getProgram from "./getProgram";
import createTransaction from "./createTransaction";
import { BYTES_PER_TX } from "../constants";

export default async function logMetadata(
  metadataAccount: PublicKey,
  metadataSize: number,
  connection: Connection,
  signer: Keypair
) {
  console.log("Logging metadata...");

  const transactionCount = Math.ceil(metadataSize / BYTES_PER_TX);
  const startAndEnds = Array.from({ length: transactionCount }, (_, i) => [
    i * BYTES_PER_TX,
    Math.min((i + 1) * BYTES_PER_TX, metadataSize),
  ]).reverse();

  const program = getProgram(connection, signer);
  let nextTxId: string | null = null;
  for (const [start, end] of startAndEnds) {
    const instruction = await program.methods
      .log(start, end, nextTxId)
      .accounts({
        metadata: metadataAccount,
        authority: signer.publicKey,
        logWrapper: new PublicKey(
          "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV"
        ),
      })
      .instruction();

    const transaction = await createTransaction(
      [instruction],
      signer,
      connection
    );
    nextTxId = await connection.sendRawTransaction(transaction.serialize());
  }

  return nextTxId;
}
