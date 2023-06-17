use anchor_lang::prelude::*;

use crate::state::Metadata;

pub fn close(_ctx: Context<Close>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(
        mut,
        has_one = authority,
        close = authority
    )]
    pub metadata: Account<'info, Metadata>,
    pub authority: Signer<'info>,
}
