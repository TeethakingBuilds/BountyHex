#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Env, Address};

#[test]
fn test_bounty_happy_path() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, BountyEscrowContract);
    let client = BountyEscrowContractClient::new(&env, &contract_id);

    let maintainer = Address::generate(&env);
    let oracle_bot = Address::generate(&env);
    let contributor = Address::generate(&env);
    
    let token_admin = Address::generate(&env);
    let token_contract_id = env.register_stellar_asset_contract(token_admin.clone());
    let token_client = token::StellarAssetClient::new(&env, &token_contract_id);
    let token_query = token::Client::new(&env, &token_contract_id);

    let bounty_amount: u64 = 5000;

    token_client.mint(&maintainer, &(bounty_amount as i128));
    token_query.transfer(&maintainer, &contract_id, &(bounty_amount as i128));

    client.initialize(&maintainer, &oracle_bot, &token_contract_id, &bounty_amount);

    client.release_bounty(&contributor);

    assert_eq!(token_query.balance(&contributor), bounty_amount as i128);
    assert_eq!(token_query.balance(&contract_id), 0);
}
