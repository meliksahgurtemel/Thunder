library errors;

pub enum Error {
    ZeroAddress: (),
    ZeroAmount: (),
    NotListed: (),
    AlreadySold: (),
    InvalidRange: (),
    WrongAsset: (),
    WrongAssetAmount: (),
}
