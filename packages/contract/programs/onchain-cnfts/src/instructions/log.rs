use anchor_lang::{prelude::*, solana_program::program::invoke};

use crate::{constants::METADATA_BUFFER_START, noop::Noop, state::Metadata};

pub fn log(ctx: Context<Log>) -> Result<()> {
    let account_info = ctx.accounts.metadata.to_account_info();
    let account_data = account_info.data.borrow();

    invoke(
        &spl_noop::instruction(
            account_data[METADATA_BUFFER_START..account_data.len()]
                .try_to_vec()
                .unwrap(),
        ),
        &[ctx.accounts.log_wrapper.to_account_info()],
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct Log<'info> {
    #[account(
        has_one = authority,
    )]
    pub metadata: Account<'info, Metadata>,
    pub authority: Signer<'info>,
    pub log_wrapper: Program<'info, Noop>,
}
