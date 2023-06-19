import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import getProgram from "./getProgram";
import createTransaction from "./createTransaction";

export default async function closeMetadataAccount(
  metadataAccount: PublicKey,
  connection: Connection,
  signer: Keypair
) {
  console.log("Closing metadata account...");

  const program = getProgram(connection, signer);
  const instruction = await program.methods
    .close()
    .accounts({
      metadata: metadataAccount,
      authority: signer.publicKey,
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
