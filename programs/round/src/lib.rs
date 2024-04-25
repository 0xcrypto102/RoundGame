use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;
pub mod constants;

use instructions::*;
declare_id!("2syx5EcebeicG91udd1x5g6gPzP4kTjnBbkM16WkWhqR");

#[program]
pub mod round {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, slot_token_price: u64) -> Result<()> {
        instructions::initialize(ctx,slot_token_price)
    }

    pub fn create_round(ctx: Context<CreateRound>, round_index: u32) -> Result<()> {
        instructions::create_round(ctx,round_index)
    }

    pub fn buy_slot(ctx: Context<BuySlot>, round_index: u32, amount: u64) -> Result<()> {
        instructions::buy_slot(ctx,round_index, amount)
    }

    pub fn claim_slot(ctx: Context<ClaimSlot>, round_index: u32) -> Result<()> {
        instructions::claim_slot(ctx, round_index)
    }
}
