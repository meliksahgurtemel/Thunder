library data_structures;

use std::{
    address::Address,
    contract_id::ContractId,
};

pub struct Item {
    item_id: u64,
    contract_Id: ContractId,
    token_id: u64,
    price: u64,
    seller: Address,
    sold: bool,
}

impl Item {
    fn new(item_id: u64, contract_Id: ContractId, token_id: u64, price: u64, seller: Address, sold: bool) -> Self {
        Self {
            item_id: item_id,
            contract_Id: contract_Id,
            token_id: token_id,
            price: price,
            seller: seller,
            sold: sold,
        }
    }
}
