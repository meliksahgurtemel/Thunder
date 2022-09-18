import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import Pinata from './pinata-config.json'
import { AddressInput } from '../src/contracts/nft_abi/NftAbi'

const user: AddressInput = { value: "0x0b2ebce8f247bdcece37363ae3b32624a4903af308f72d9c872d00d385d2724d" }
const admin: AddressInput = { value: "0x15a25f1b0eb7d9fcf3619dc1d4f8b73afaa6afbdf54dc5d9d956678ebee271bd" }

//import { create as ipfsHttpClient } from 'ipfs-http-client'
//const client = ipfsHttpClient("http://127.0.0.1:5002/api/v0");
//require('dotenv').config()

const key = Pinata.key;
const secret = Pinata.secret;

const axios = require('axios');
const FormData = require('form-data');

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  /* const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result)
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  const createNFT = async () => {
    if (!image || !price || !name || !description) return
    try{
      const result = await client.add(JSON.stringify({image, price, name, description}))
      mintThenList(result)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  } */

  const createNFT = async () => {
    if (!image || !price || !name || !description) return
    try{
      const { message, success } = await uploadJSONToIPFS(JSON.stringify({
        "image": image,
        "price": price,
        "name": name,
        "description": description
      }))
      if(success) {
        mintThenList(message)
      }
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }

  const uploadJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata
    return axios
      .post(url, JSONBody, {
        headers: {
            pinata_api_key: key,
            pinata_secret_api_key: secret,
        }
      })
      .then((response) => {
        return {
            success: true,
            message: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        };
      })
      .catch((error) => {
        console.log(error)
        return {
            success: false,
            message: `error: ${error.message}`,
        }
    });
  };

  const uploadToIPFS = async(event) => {
    event.preventDefault()
    const file = event.target.files[0]

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //making axios POST request to Pinata

    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    return axios
      .post(url, data, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: key,
          pinata_secret_api_key: secret,
        }
      })
      .then(function (response) {
        console.log("image uploaded", response.data.IpfsHash)
        setImage(`https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`)
        return {
          success: true,
          message: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        };
      })
      .catch(function (error) {
        console.log(error)
        return {
          success: false,
          message: error.message,
        }
      });
  };

  const mintThenList = async (result) => {
    // mint nft
    const CID = result.substring(result.length - 46, result.length)
    const market: AddressInput = { value: "0xb1d24a7d14e9b92b6a82428e31e0d3bb30cefccbe44c364fb44a9921846ccbe5" }
    const nftAddress: AddressInput = { value: "0x6c48ada9b5f6af020fb117540f6dfe0a57617e568c0b6136376508bb045c64db" }

    console.log("Minting")
    await nft.functions.mint(1, CID).txParams({gasPrice:1}).call();
    console.log("Minted")
    // get tokenId of new nft
    const res = await nft.functions.total_supply().get()
    const id = Number(res.value)
    // approve marketplace to spend nft
    await nft.functions.set_approval_for_all(true, market).txParams({gasPrice:1}).call();
    console.log("Approved")
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    console.log("Listing")
    await marketplace.functions.make_item(nftAddress, id, price).txParams({gasPrice:1}).call();
    console.log("Listedd")
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="outline-success" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create
