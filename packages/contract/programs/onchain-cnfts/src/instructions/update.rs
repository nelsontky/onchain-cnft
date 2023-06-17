use crate::{constants::METADATA_BUFFER_START, state::Metadata};
use anchor_lang::prelude::*;

pub fn update(ctx: Context<Update>, index: usize, bytes: Vec<u8>) -> Result<()> {
    let account_info = ctx.accounts.metadata.to_account_info();
    let mut account_data = account_info.data.borrow_mut();
    account_data[METADATA_BUFFER_START + index..METADATA_BUFFER_START + index + bytes.len()]
        .copy_from_slice(&bytes);
    Ok(())
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub metadata: Account<'info, Metadata>,
    pub authority: Signer<'info>,
}
