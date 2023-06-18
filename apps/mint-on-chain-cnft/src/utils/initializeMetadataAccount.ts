import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import getProgram from "./getProgram";
import createTransaction from "./createTransaction";

export default async function initializeMetadataAccount(
  metadataSize: number,
  metadataAccount: PublicKey,
  connection: Connection,
  signer: Keypair
) {
  console.log("Initializing metadata account...");

  const program = getProgram(connection, signer);

  const instruction = await program.methods
    .initialize(metadataSize)
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
  const txId = await connection.sendRawTransaction(transaction.serialize());
  await connection.confirmTransaction(txId);

  return txId;
}
