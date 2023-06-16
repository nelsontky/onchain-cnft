import { Connection, Keypair } from "@solana/web3.js";
import createNoopInstruction from "./createNoopInstruction";
import createTransaction from "./createTransaction";
import { chunk } from "lodash";

const PART_LENGTH = 900;
const TRANSACTION_CHUNK_SIZE = 6;

export default async function postMetadataToLedger(
  metadata: string,
  signer: Keypair,
  connection: Connection
) {
  const signaturesAddress = Keypair.generate().publicKey;

  const transactionsCount = Math.ceil(metadata.length / PART_LENGTH);
  const metadataBufferParts = Array.from(
    { length: transactionsCount },
    (_, i) =>
      JSON.stringify([
        i,
        metadata.slice(
          i * PART_LENGTH,
          Math.min((i + 1) * PART_LENGTH, metadata.length)
        ),
      ])
  );

  const chunks = chunk(metadataBufferParts, TRANSACTION_CHUNK_SIZE);
  const resultTxIds: string[] = [];

  // I know this is not the best way to do it, but it works decently
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const txIds = await Promise.all(
      chunk.map(async (part) => {
        const instruction = createNoopInstruction(Buffer.from(part), [
          { isSigner: false, isWritable: false, pubkey: signaturesAddress },
        ]);
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

    resultTxIds.push(...txIds);

    console.log(
      `Sent ${Math.min(
        (i + 1) * TRANSACTION_CHUNK_SIZE,
        transactionsCount
      )}/${transactionsCount} transactions`
    );
  }

  await sleep(1000);

  const lastTxId = (
    await connection.getSignaturesForAddress(signaturesAddress, {
      limit: 1,
    })
  )[0].signature;

  return {
    signaturesAddress: signaturesAddress.toBase58(),
    lastTxId,
    transactionsCount,
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
