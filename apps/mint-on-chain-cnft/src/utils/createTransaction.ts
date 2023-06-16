import {
  Connection,
  Keypair,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

export default async function createTransaction(
  instructions: TransactionInstruction[],
  signer: Keypair,
  connection: Connection
) {
  const latestBlockhash = await connection.getLatestBlockhash();
  const transaction = new Transaction().add(...instructions);

  transaction.recentBlockhash = latestBlockhash.blockhash;
  transaction.feePayer = signer.publicKey;
  transaction.sign(signer);

  return transaction;
}
