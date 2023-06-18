use anchor_lang::{prelude::*, solana_program::program::invoke};

use crate::{constants::{METADATA_BUFFER_START, BYTES_PER_CPI}, noop::Noop, state::Metadata};

pub fn log(ctx: Context<Log>, start: u32, end: u32, next_tx_id: String) -> Result<()> {
    let account_info = ctx.accounts.metadata.to_account_info();
    let account_data = account_info.data.borrow();

    for i in (start..end).step_by(BYTES_PER_CPI) {
        let left = METADATA_BUFFER_START + (i as usize);
        let right = std::cmp::min(
            METADATA_BUFFER_START + ((i as usize) + BYTES_PER_CPI),
            METADATA_BUFFER_START + end as usize,
        );

        invoke(
            &spl_noop::instruction(account_data[left..right].to_vec()),
            &[ctx.accounts.log_wrapper.to_account_info()],
        )?;
    }

    // log the next_tx_id, thus creating a linked list of transactions
    invoke(
        &spl_noop::instruction(next_tx_id.as_bytes().to_vec()),
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
