use anchor_lang::prelude::*;

pub mod constants;
pub mod noop;

mod instructions;
mod state;

use instructions::*;

declare_id!("cNFTxJQTzQsvVd1sy8GxUQKHLJeMEMsacJfvs3oeizr");

#[program]
pub mod on_chain_cnft {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, total_metadata_bytes: usize) -> Result<()> {
        instructions::initialize(ctx, total_metadata_bytes)
    }

    pub fn update(ctx: Context<Update>, index: usize, bytes: Vec<u8>) -> Result<()> {
        instructions::update(ctx, index, bytes)
    }

    pub fn log(ctx: Context<Log>) -> Result<()> {
        instructions::log(ctx)
    }

    pub fn close(ctx: Context<Close>) -> Result<()> {
        instructions::close(ctx)
    }
}
