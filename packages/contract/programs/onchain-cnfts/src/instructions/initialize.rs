use crate::state::Metadata;
use anchor_lang::{prelude::*, Discriminator};

use crate::constants::METADATA_BUFFER_START;

pub fn initialize(ctx: Context<Initialize>, _total_metadata_bytes: usize) -> Result<()> {
    let metadata = Metadata {
        authority: ctx.accounts.authority.key(),
    };
    let mut struct_data = Metadata::discriminator().try_to_vec().unwrap();
    struct_data.append(&mut metadata.try_to_vec().unwrap());

    let metadata_account = &mut ctx.accounts.metadata;

    let mut account_data = metadata_account.data.borrow_mut();
    account_data[0..struct_data.len()].copy_from_slice(&struct_data);

    Ok(())
}

#[derive(Accounts)]
#[instruction(total_metadata_bytes: usize)]
pub struct Initialize<'info> {
    /// CHECK: account constraints checked in account trait
    #[account(
        zero,
        rent_exempt = skip,
        constraint = metadata.to_account_info().owner == program_id
            && metadata.to_account_info().data_len() >= METADATA_BUFFER_START + total_metadata_bytes
    )]
    pub metadata: UncheckedAccount<'info>,
    pub authority: Signer<'info>,
}
