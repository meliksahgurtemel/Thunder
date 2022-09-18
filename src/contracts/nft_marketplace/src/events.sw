library events;

use std::{
    address::Address,
    contract_id::ContractId,
};

pub struct ListEvent {
    item_id: u64,
    contract_Id: ContractId,
    token_id: u64,
    price: u64,
    seller: Address,
}

pub struct PurchaseEvent {
    item_id: u64,
    contract_Id: ContractId,
    token_id: u64,
    price: u64,
    seller: Address,
    buyer: Address,
}
