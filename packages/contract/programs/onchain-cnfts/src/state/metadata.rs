use anchor_lang::prelude::*;

#[account]
#[derive(Default, Debug)]
pub struct Metadata {
    pub authority: Pubkey,
    // actual json buffer is hidden to avoid deserialization
}
