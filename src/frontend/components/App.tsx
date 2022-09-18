import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home'
import Create from './Create'

//import MarketplaceAbi from '../contractsData/Marketplace.json'
import { Wallet } from "fuels";
import { NftMarketplaceAbi__factory } from '../src/contracts/nft_marketplace'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
//import NFTAbi from '../contractsData/NFT.json'
import { NftAbi__factory } from '../src/contracts/nft_abi'
import NFTAddress from '../contractsData/NFT-address.json'
import { useState } from 'react'
//import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'

import './App.css';

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})
  // Create Fuel wallet
  const web3Handler = async () => {
    const createWallet = Wallet.generate();
    const key = createWallet.privateKey
    setAccount(createWallet.address.toString());
    const wallet = new Wallet(key, "https://node-beta-1.fuel.network/graphql")
    loadContracts(wallet);
  }

  const loadContracts = async (signer: Wallet) => {
    // Get deployed copies of contracts
    const marketplace = NftMarketplaceAbi__factory.connect(MarketplaceAddress.address, signer);
    setMarketplace(marketplace)

    const nft = NftAbi__factory.connect(NFTAddress.address, signer);
    setNFT(nft)
    setLoading(false)
  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Wallet Creation...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home marketplace={marketplace} nft={nft} />
              } />
              <Route path="/create" element={
                <Create marketplace={marketplace} nft={nft} />
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
