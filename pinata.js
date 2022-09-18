require('dotenv').config()

const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;

const axios = require('axios');

const uploadJSONToIPFS = async() => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata
    return axios
      .post(url, JSON.stringify({price: "123", name: "Nna", description: "maraba"}), {
        headers: {
            pinata_api_key: key,
            pinata_secret_api_key: secret,
        }
      })
      .then((response) => {
          console.log(response)
        return {
            success: true,
            message: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        };
      })
      .catch((error) => {
        console.log(error)
        return {
            success: false,
            message: error.message,
        }
    });
  };

  uploadJSONToIPFS()
