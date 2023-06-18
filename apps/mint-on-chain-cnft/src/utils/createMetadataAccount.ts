import { Connection, Keypair, SystemProgram } from "@solana/web3.js";
import { METADATA_BUFFER_START } from "../constants";
import getProgram from "./getProgram";
import createTransaction from "./createTransaction";

export default async function createMetadataAccount(
  metadataSize: number,
  connection: Connection,
  signer: Keypair
) {
  const metadataAccount = Keypair.generate();

  console.log(`Creating metadata account: ${metadataAccount.publicKey}`);

  const space = METADATA_BUFFER_START + metadataSize;

  const program = getProgram(connection, signer);
  const instruction = SystemProgram.createAccount({
    fromPubkey: signer.publicKey,
    newAccountPubkey: metadataAccount.publicKey,
    space,
    lamports: await connection.getMinimumBalanceForRentExemption(space),
    programId: program.programId,
  });

  const transaction = await createTransaction(
    [instruction],
    signer,
    connection
  );
  transaction.partialSign(metadataAccount);

  const txId = await connection.sendRawTransaction(transaction.serialize());
  await connection.confirmTransaction(txId);

  return metadataAccount;
}
