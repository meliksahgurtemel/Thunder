contract;

dep utils;
dep errors;
dep data_structures;
dep interface;
dep events;
dep constants;

use interface::NFTMarketplace;
use events::*;
use constants::*;
use errors::Error;
use core::ops::*;
use nft_abi::NFT;
use utils::get_msg_sender_address_or_panic;
use data_structures::Item;
use std::{
    chain::auth::msg_sender,
    address::Address,
    logging::log,
    result::Result,
    revert::require,
    storage::StorageMap,
    context::{*, call_frames::*},
    contract_id::ContractId,
    token::*,
};

storage {
    item_counter: u64 = 0,
    items: StorageMap<u64, Item> = StorageMap {},
    fee_percent: u64 = 1,
}

#[storage(read)]
fn get_total_price(item_id: u64) -> u64 {
    let item = storage.items.get(item_id);
    let price = item.price;
    price.multiply(100 + storage.fee_percent).divide(100)
}

impl NFTMarketplace for Contract {
    #[storage(read)]
    fn item_count() -> u64 {
        storage.item_counter
    }

    #[storage(read)]
    fn items(id: u64) -> Item {
        storage.items.get(id)
    }

    #[storage(read, write)]
    fn make_item(contract_Id: ContractId, token_id: u64, price: u64) {
        require(price > 0, Error::ZeroAmount);
        require(contract_Id != ZERO_CONTRACT_ID, Error::ZeroAddress);

        storage.item_counter += 1;

        let this_contract_Id = contract_id();
        let this_address = Address { value: this_contract_Id.into() };
        let seller = get_msg_sender_address_or_panic();
        let nft = abi(NFT, contract_Id.into());
        nft.transfer_from(seller, this_address, token_id);

        let item_id = storage.item_counter;
        storage.items.insert(item_id, ~Item::new(item_id, contract_Id, token_id, price, seller, false));

        log(ListEvent {
            item_id,
            contract_Id,
            token_id,
            price,
            seller,
        });
    }

    #[storage(read, write)]
    fn purchase_item(item_id: u64) {
        let total_price = get_total_price(item_id);
        let mut item = storage.items.get(item_id);
        let current_counter = storage.item_counter;

        require(current_counter < (current_counter + 1), Error::InvalidRange);
        require(item.sold, Error::AlreadySold);
        require(msg_asset_id() == BASE_TOKEN, Error::WrongAsset);
        require(msg_amount() == total_price, Error::WrongAssetAmount);

        let amount = total_price - item.price;
        transfer_to_output(amount, BASE_TOKEN, item.seller);

        item.sold = true;
        let address = item.contract_Id;
        let nft = abi(NFT, address.into());
        let this_contract_Id = contract_id();
        let this_address = Address { value: this_contract_Id.into() };
        let contract_Id = item.contract_Id;
        let price = item.price;
        let seller = item.seller;
        let token_id = item.token_id;
        let buyer = get_msg_sender_address_or_panic();
        nft.transfer_from(this_address, buyer, item.token_id);

        log(PurchaseEvent {
            item_id,
            contract_Id,
            token_id,
            price,
            seller,
            buyer,
        });
    }
}
