import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  createAllocTreeIx,
  ValidDepthSizePair,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import {
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  createCreateTreeInstruction,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const maxDepthSizePair: ValidDepthSizePair = {
  maxDepth: 14,
  maxBufferSize: 64,
};
const canopyDepth = 0;

export default async function createTree(
  connection: Connection,
  signer: Keypair
) {
  const treeKeypair = Keypair.generate();

  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [treeKeypair.publicKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );

  const allocTreeIx = await createAllocTreeIx(
    connection,
    treeKeypair.publicKey,
    signer.publicKey,
    maxDepthSizePair,
    canopyDepth
  );

  // create the instruction to actually create the tree
  const createTreeIx = createCreateTreeInstruction(
    {
      payer: signer.publicKey,
      treeCreator: signer.publicKey,
      treeAuthority,
      merkleTree: treeKeypair.publicKey,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
    },
    {
      maxBufferSize: maxDepthSizePair.maxBufferSize,
      maxDepth: maxDepthSizePair.maxDepth,
      public: true,
    },
    BUBBLEGUM_PROGRAM_ID
  );

  const tx = new Transaction().add(allocTreeIx).add(createTreeIx);
  tx.feePayer = signer.publicKey;

  const txSignature = await sendAndConfirmTransaction(
    connection,
    tx,
    [treeKeypair, signer],
    {
      commitment: "confirmed",
      skipPreflight: true,
    }
  );

  console.log(
    `Merkle tree ${treeKeypair.publicKey.toBase58()} created successfully!`
  );
}
