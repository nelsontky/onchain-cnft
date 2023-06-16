import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";

const NOOP_PROGRAM_ID = new PublicKey(
  "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV"
);

export default function createNoopInstruction(
  data: Buffer,
  additionalAccounts: AccountMeta[] = []
) {
  const instruction = new TransactionInstruction({
    keys: additionalAccounts,
    programId: NOOP_PROGRAM_ID,
    data,
  });

  return instruction;
}
