use anchor_lang::prelude::*;

declare_id!("5gs2i4LfvDz5RMii8bfvJyLeN9s3FhCT73Gts3fQuwmv");

#[program]
pub mod hawamoni_treasury {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Hawamoni Treasury Program initialized!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}