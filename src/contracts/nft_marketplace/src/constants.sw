library constants;

use std::{
    address::Address,
    contract_id::ContractId,
};

pub const ZERO_B256 = 0x0000000000000000000000000000000000000000000000000000000000000000;
pub const ZERO_ADDRESS = Address { value: ZERO_B256 };
pub const ZERO_CONTRACT_ID = ContractId { value: ZERO_B256 };
pub const BASE_TOKEN = ~ContractId::from(0x0000000000000000000000000000000000000000000000000000000000000000);
