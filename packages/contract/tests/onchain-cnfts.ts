import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { OnchainCnfts } from "../target/types/onchain_cnfts";

describe("onchain-cnfts", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.OnchainCnfts as Program<OnchainCnfts>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
