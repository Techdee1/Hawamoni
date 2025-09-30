use anchor_lang::prelude::*;

declare_id!("ERPfFiDL6Hvh215HZKQUYMrktMzJnFq5vTiAn417DL9P");

#[program]
pub mod hawamoni_treasury {
    use super::*;

    pub fn create_treasury(
        ctx: Context<CreateTreasury>,
        group_id: String,
        approvals_required: u8,
        withdrawal_limit: u64,
        timelock_duration: i64,
    ) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        let creator = &ctx.accounts.creator;
        let clock = Clock::get()?;

        // Validate inputs
        require!(approvals_required > 0, TreasuryError::InvalidApprovalsRequired);
        require!(withdrawal_limit > 0, TreasuryError::InvalidWithdrawalAmount);
        require!(group_id.len() <= 32, TreasuryError::InvalidGroupId);

        // Initialize treasury
        treasury.group_id = group_id;
        treasury.creator = creator.key();
        treasury.members = vec![creator.key()];
        treasury.approvals_required = approvals_required;
        treasury.withdrawal_limit = withdrawal_limit;
        treasury.timelock_duration = timelock_duration;
        treasury.balance = 0;
        treasury.next_request_id = 1;
        treasury.created_at = clock.unix_timestamp;
        treasury.is_paused = false;
        treasury.bump = ctx.bumps.treasury;

        msg!("Treasury created: {}", treasury.key());
        Ok(())
    }

    pub fn add_member(ctx: Context<ManageMember>, new_member: Pubkey) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        
        require!(!treasury.is_paused, TreasuryError::TreasuryPaused);
        require!(!treasury.members.contains(&new_member), TreasuryError::AlreadyMember);
        require!(treasury.members.len() < 10, TreasuryError::TooManyMembers);

        treasury.members.push(new_member);
        
        msg!("Member added: {}", new_member);
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        
        require!(!treasury.is_paused, TreasuryError::TreasuryPaused);
        require!(amount > 0, TreasuryError::InvalidWithdrawalAmount);

        // Transfer SOL from depositor to treasury
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.depositor.key(),
            &treasury.key(),
            amount,
        );
        
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.depositor.to_account_info(),
                treasury.to_account_info(),
            ],
        )?;

        treasury.balance = treasury.balance.checked_add(amount).ok_or(TreasuryError::ArithmeticOverflow)?;

        msg!("Deposited {} lamports. New balance: {}", amount, treasury.balance);
        Ok(())
    }

    pub fn propose_withdrawal(
        ctx: Context<ProposeWithdrawal>,
        amount: u64,
        recipient: Pubkey,
        description: String,
    ) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        let withdrawal_request = &mut ctx.accounts.withdrawal_request;
        let proposer = &ctx.accounts.proposer;
        let clock = Clock::get()?;

        require!(!treasury.is_paused, TreasuryError::TreasuryPaused);
        require!(treasury.members.contains(&proposer.key()), TreasuryError::NotAMember);
        require!(amount > 0, TreasuryError::InvalidWithdrawalAmount);
        require!(amount <= treasury.withdrawal_limit, TreasuryError::WithdrawalLimitExceeded);
        require!(amount <= treasury.balance, TreasuryError::InsufficientFunds);
        require!(description.len() <= 200, TreasuryError::InvalidDescription);

        // Initialize withdrawal request
        withdrawal_request.treasury = treasury.key();
        withdrawal_request.proposer = proposer.key();
        withdrawal_request.recipient = recipient;
        withdrawal_request.amount = amount;
        withdrawal_request.description = description;
        withdrawal_request.approvals = vec![proposer.key()]; // Auto-approve by proposer
        withdrawal_request.proposed_at = clock.unix_timestamp;
        withdrawal_request.timelock_expiry = clock.unix_timestamp + treasury.timelock_duration;
        withdrawal_request.status = WithdrawalStatus::Pending;
        withdrawal_request.request_id = treasury.next_request_id;
        withdrawal_request.bump = ctx.bumps.withdrawal_request;

        treasury.next_request_id += 1;

        // Check if already has enough approvals
        if withdrawal_request.approvals.len() >= treasury.approvals_required as usize {
            withdrawal_request.status = WithdrawalStatus::Approved;
        }

        msg!("Withdrawal proposed: {} lamports to {}", amount, recipient);
        Ok(())
    }

    pub fn approve_withdrawal(ctx: Context<ApproveWithdrawal>) -> Result<()> {
        let treasury = &ctx.accounts.treasury;
        let withdrawal_request = &mut ctx.accounts.withdrawal_request;
        let approver = &ctx.accounts.approver;

        require!(!treasury.is_paused, TreasuryError::TreasuryPaused);
        require!(treasury.members.contains(&approver.key()), TreasuryError::NotAMember);
        require!(withdrawal_request.status == WithdrawalStatus::Pending, TreasuryError::WithdrawalNotPending);
        require!(!withdrawal_request.approvals.contains(&approver.key()), TreasuryError::AlreadyApproved);

        withdrawal_request.approvals.push(approver.key());

        // Check if now has enough approvals
        if withdrawal_request.approvals.len() >= treasury.approvals_required as usize {
            withdrawal_request.status = WithdrawalStatus::Approved;
        }

        msg!("Withdrawal approved by: {}", approver.key());
        Ok(())
    }

    pub fn execute_withdrawal(ctx: Context<ExecuteWithdrawal>) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        let withdrawal_request = &mut ctx.accounts.withdrawal_request;
        let clock = Clock::get()?;

        require!(!treasury.is_paused, TreasuryError::TreasuryPaused);
        require!(withdrawal_request.status == WithdrawalStatus::Approved, TreasuryError::WithdrawalNotApproved);
        require!(clock.unix_timestamp >= withdrawal_request.timelock_expiry, TreasuryError::TimelockNotExpired);
        require!(treasury.balance >= withdrawal_request.amount, TreasuryError::InsufficientFunds);

        // Transfer SOL from treasury to recipient
        **treasury.to_account_info().try_borrow_mut_lamports()? -= withdrawal_request.amount;
        **ctx.accounts.recipient.try_borrow_mut_lamports()? += withdrawal_request.amount;

        treasury.balance = treasury.balance.checked_sub(withdrawal_request.amount).ok_or(TreasuryError::ArithmeticOverflow)?;
        withdrawal_request.status = WithdrawalStatus::Executed;

        msg!("Withdrawal executed: {} lamports to {}", withdrawal_request.amount, withdrawal_request.recipient);
        Ok(())
    }
}

// Account Structs
#[derive(Accounts)]
#[instruction(group_id: String)]
pub struct CreateTreasury<'info> {
    #[account(
        init,
        payer = creator,
        space = Treasury::LEN,
        seeds = [b"treasury", group_id.as_bytes()],
        bump
    )]
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ManageMember<'info> {
    #[account(
        mut,
        constraint = treasury.creator == admin.key() @ TreasuryError::NotAuthorized
    )]
    pub treasury: Account<'info, Treasury>,
    
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub depositor: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: u64, recipient: Pubkey, description: String)]
pub struct ProposeWithdrawal<'info> {
    #[account(mut)]
    pub treasury: Account<'info, Treasury>,
    
    #[account(
        init,
        payer = proposer,
        space = WithdrawalRequest::LEN,
        seeds = [
            b"withdrawal_request",
            treasury.key().as_ref(),
            &treasury.next_request_id.to_le_bytes()
        ],
        bump
    )]
    pub withdrawal_request: Account<'info, WithdrawalRequest>,
    
    #[account(mut)]
    pub proposer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveWithdrawal<'info> {
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub withdrawal_request: Account<'info, WithdrawalRequest>,
    
    pub approver: Signer<'info>,
}

#[derive(Accounts)]
pub struct ExecuteWithdrawal<'info> {
    #[account(mut)]
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub withdrawal_request: Account<'info, WithdrawalRequest>,
    
    /// CHECK: This is the recipient account that will receive funds
    #[account(mut)]
    pub recipient: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

// State Structs
#[account]
pub struct Treasury {
    pub group_id: String,           
    pub creator: Pubkey,            
    pub members: Vec<Pubkey>,       
    pub approvals_required: u8,     
    pub withdrawal_limit: u64,      
    pub timelock_duration: i64,     
    pub balance: u64,               
    pub next_request_id: u64,       
    pub created_at: i64,            
    pub is_paused: bool,            
    pub bump: u8,                   
}

impl Treasury {
    pub const LEN: usize = 8 + // discriminator
        4 + 32 + // group_id
        32 + // creator
        4 + (32 * 10) + // members
        1 + // approvals_required
        8 + // withdrawal_limit
        8 + // timelock_duration
        8 + // balance
        8 + // next_request_id
        8 + // created_at
        1 + // is_paused
        1; // bump
}

#[account]
pub struct WithdrawalRequest {
    pub treasury: Pubkey,           
    pub proposer: Pubkey,           
    pub recipient: Pubkey,          
    pub amount: u64,                
    pub description: String,        
    pub approvals: Vec<Pubkey>,     
    pub proposed_at: i64,           
    pub timelock_expiry: i64,       
    pub status: WithdrawalStatus,   
    pub request_id: u64,            
    pub bump: u8,                   
}

impl WithdrawalRequest {
    pub const LEN: usize = 8 + // discriminator
        32 + // treasury
        32 + // proposer
        32 + // recipient
        8 + // amount
        4 + 200 + // description
        4 + (32 * 10) + // approvals
        8 + // proposed_at
        8 + // timelock_expiry
        1 + // status
        8 + // request_id
        1; // bump
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum WithdrawalStatus {
    Pending,
    Approved,
    Executed,
    Rejected,
}

// Error Types
#[error_code]
pub enum TreasuryError {
    #[msg("Invalid approvals required")]
    InvalidApprovalsRequired,
    #[msg("Invalid withdrawal amount")]
    InvalidWithdrawalAmount,
    #[msg("Invalid group ID")]
    InvalidGroupId,
    #[msg("Treasury is paused")]
    TreasuryPaused,
    #[msg("Member already exists")]
    AlreadyMember,
    #[msg("Too many members")]
    TooManyMembers,
    #[msg("Not a member")]
    NotAMember,
    #[msg("Not authorized")]
    NotAuthorized,
    #[msg("Withdrawal limit exceeded")]
    WithdrawalLimitExceeded,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Invalid description")]
    InvalidDescription,
    #[msg("Withdrawal not pending")]
    WithdrawalNotPending,
    #[msg("Already approved")]
    AlreadyApproved,
    #[msg("Withdrawal not approved")]
    WithdrawalNotApproved,
    #[msg("Timelock not expired")]
    TimelockNotExpired,
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
}
