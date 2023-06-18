export const METADATA_BUFFER_START =
  8 + // discriminator
  32; // authority

export const BYTES_PER_TX =
  1276 * // bytes per cpi
  23; // max number of cpis (minus one to fit in one more log for the linked list to the next tx id) we can make before blowing the stack
