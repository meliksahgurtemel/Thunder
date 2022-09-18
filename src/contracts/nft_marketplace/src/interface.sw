library interface;

dep data_structures;

use data_structures::Item;
use std::{address::Address,contract_id::ContractId};

abi NFTMarketplace {
    #[storage(read)]
    fn item_count() -> u64;

    #[storage(read)]
    fn items(id: u64) -> Item;

    #[storage(read, write)]
    fn make_item(contract_Id: ContractId, token_id: u64, price: u64);

    #[storage(read, write)]
    fn purchase_item(item_id: u64);
}
