import { Injectable } from "@nestjs/common";
import { Connection, PublicKey } from "@solana/web3.js";
import * as bs58 from "bs58";
import { chunk } from "lodash";

const LOAD_CHUNK_SIZE = 10;

@Injectable()
export class AppService {
  async getMetadata(
    signaturesAddress: string,
    latestTxId: string,
    count: number
  ) {
    const connection = new Connection(process.env.RPC_ENDPOINT, "confirmed");
    const signaturesForAddress = await connection.getSignaturesForAddress(
      new PublicKey(signaturesAddress),
      {
        before: latestTxId,
        limit: count - 1,
      }
    );

    const signaturesToFetch = [
      latestTxId,
      ...signaturesForAddress.map(({ signature }) => signature),
    ];

    const chunkedSignaturesToFetch = chunk(signaturesToFetch, LOAD_CHUNK_SIZE);
    const jsonParts: [number, string][] = [];
    for (const chunk of chunkedSignaturesToFetch) {
      const jsonPartsChunk = await Promise.all(
        chunk.map(async (signature) => {
          const transaction = await connection.getTransaction(signature);

          if (!transaction) {
            throw new Error(`Transaction not found: ${signature}`);
          }

          const firstIxData =
            transaction.transaction.message.instructions[0].data;

          const jsonPart = JSON.parse(
            Buffer.from(bs58.decode(firstIxData)).toString("utf-8")
          );

          return jsonPart;
        })
      );

      jsonParts.push(...jsonPartsChunk);
    }

    const sortedJsonParts = jsonParts.sort(([a], [b]) => a - b);

    return JSON.parse(sortedJsonParts.map(([, json]) => json).join(""));
  }
}
