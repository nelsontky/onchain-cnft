import { Keypair, PublicKey } from "@solana/web3.js";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import {
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  MetadataArgs,
  createMintV1Instruction,
} from "@metaplex-foundation/mpl-bubblegum";

/**
 * maxDepth: 14
 * canopySize: 0
 * maxBufferSize: 64
 */
const treeAddress = new PublicKey(
  "EK8XzrwstJQ5XEK7sXsUiBAo2WUXMG7nR9NQuj4LaR4Z"
);

export default function createMintCnftInstruction(
  metadata: MetadataArgs,
  signer: Keypair
) {
  const [treeAuthority] = PublicKey.findProgramAddressSync(
    [treeAddress.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );

  const mintIx = createMintV1Instruction(
    {
      payer: signer.publicKey,
      merkleTree: treeAddress,
      treeAuthority,
      treeDelegate: signer.publicKey,
      leafOwner: signer.publicKey,
      leafDelegate: signer.publicKey,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
    },
    {
      message: metadata,
    }
  );

  return mintIx;
}
