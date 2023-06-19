import { BadRequestException, Injectable } from "@nestjs/common";
import { Connection } from "@solana/web3.js";
import * as bs58 from "bs58";

const MAX_TX_LINKED_LIST_LENGTH = 40;

@Injectable()
export class AppService {
  async getMetadata(txId: string) {
    const connection = new Connection(process.env.RPC_ENDPOINT, "confirmed");
    const jsonParts: string[] = [];

    let txFetched = 0;
    let nextTxId = txId;
    while (nextTxId !== "NULL") {
      if (++txFetched > MAX_TX_LINKED_LIST_LENGTH) {
        throw new BadRequestException(
          `Transactions linked list is too long, please do not use this service to fetch metadata for a cNFT with more than ${MAX_TX_LINKED_LIST_LENGTH} transactions`
        );
      }

      try {
        const tx = await connection.getTransaction(nextTxId);
        const logs = tx?.meta?.innerInstructions?.[0]?.instructions?.map(
          ({ data }) => Buffer.from(bs58.decode(data)).toString("utf-8")
        );

        if (!logs) {
          throw new BadRequestException(
            "tx id does not follow the cNFT format"
          );
        }

        nextTxId = logs.pop();

        jsonParts.push(...logs);
      } catch {
        throw new BadRequestException("tx id does not follow the cNFT format");
      }
    }

    return JSON.parse(jsonParts.join(""));
  }
}
