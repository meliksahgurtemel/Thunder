library data_structures;

pub struct TokenMetaData {
    name: str[7],
    symbol: str[4],
}

pub struct TokenURI {
    base_uri: str[46],
    token_id: u64,
    token_uri: (str[46], u64),
}

impl TokenMetaData {
    fn new() -> Self {
        Self {
            name: "FuelNFT",
            symbol: "FNFT",
        }
    }
}

impl TokenURI {
    fn new(base_uri: str[46], token_id: u64) -> Self {
        Self {
            base_uri: base_uri,
            token_id: token_id,
            token_uri: (base_uri, token_id),
        }
    }
}
