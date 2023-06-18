import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { IDL, OnChainCnft } from "contract";

const getProgram = (connection: Connection, signer: Keypair) =>
  new anchor.Program(
    IDL,
    new PublicKey("cNFTxJQTzQsvVd1sy8GxUQKHLJeMEMsacJfvs3oeizr"),
    new anchor.AnchorProvider(connection, new anchor.Wallet(signer), {
      commitment: "confirmed",
    })
  ) as anchor.Program<OnChainCnft>;

export default getProgram;
