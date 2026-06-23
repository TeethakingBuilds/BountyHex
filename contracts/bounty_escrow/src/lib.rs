#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, Symbol, token::Client as TokenClient
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    BountyAmount,
    BountyToken,
    Maintainer,
    OracleBot,
    IsSettled,
}

#[contract]
pub struct BountyEscrowContract;

#[contractimpl]
impl BountyEscrowContract {
    pub fn initialize(
        env: Env,
        maintainer: Address,
        oracle_bot: Address,
        token_address: Address,
        amount: u64,
    ) {
        if env.storage().instance().has(&DataKey::Maintainer) {
            panic!("Contract is already initialized");
        }

        env.storage().instance().set(&DataKey::Maintainer, &maintainer);
        env.storage().instance().set(&DataKey::OracleBot, &oracle_bot);
        env.storage().instance().set(&DataKey::BountyToken, &token_address);
        env.storage().instance().set(&DataKey::BountyAmount, &amount);
        env.storage().instance().set(&DataKey::IsSettled, &false);
    }

    pub fn release_bounty(env: Env, contributor: Address) {
        let is_settled: bool = env.storage().instance().get(&DataKey::IsSettled).unwrap_or(false);
        if is_settled {
            panic!("Bounty has already been released or refunded");
        }

        let oracle_bot: Address = env.storage().instance().get(&DataKey::OracleBot).unwrap();
        oracle_bot.require_auth();

        let token_address: Address = env.storage().instance().get(&DataKey::BountyToken).unwrap();
        let amount: u64 = env.storage().instance().get(&DataKey::BountyAmount).unwrap();

        let token_client = TokenClient::new(&env, &token_address);

        token_client.transfer(&env.current_contract_address(), &contributor, &(amount as i128));

        env.storage().instance().set(&DataKey::IsSettled, &true);

        env.events().publish(
            (Symbol::new(&env, "bounty_paid"), contributor),
            amount
        );
    }

    pub fn refund_bounty(env: Env) {
        let is_settled: bool = env.storage().instance().get(&DataKey::IsSettled).unwrap_or(false);
        if is_settled {
            panic!("Bounty has already been processed");
        }

        let maintainer: Address = env.storage().instance().get(&DataKey::Maintainer).unwrap();
        maintainer.require_auth();

        let token_address: Address = env.storage().instance().get(&DataKey::BountyToken).unwrap();
        let amount: u64 = env.storage().instance().get(&DataKey::BountyAmount).unwrap();

        let token_client = TokenClient::new(&env, &token_address);
        token_client.transfer(&env.current_contract_address(), &maintainer, &(amount as i128));

        env.storage().instance().set(&DataKey::IsSettled, &true);

        env.events().publish(
            (Symbol::new(&env, "bounty_refunded"), maintainer),
            amount
        );
    }
}

#[cfg(test)]
mod test;
