import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const res = await nft.functions.total_supply().get()
    const itemCount = Number(res.value);
    console.log(itemCount)
    var items = []
    for (let i = 1; i <= itemCount; i++) {
      /* const res = await marketplace.functions.items(i).get()
      const item = res.value
      console.log(item) */
      const res1 = await nft.functions.token_uri(i).get();
      const uri = res1.value.base_uri

      const tokenUri = `https://gateway.pinata.cloud/ipfs/${uri}`
      console.log(tokenUri);
      var _key;
      try {
        const res = await fetch(tokenUri);
        const metadata = await res.json();
        const key = Object.keys(metadata);
        _key = key
      } catch(err) {
        console.log(err)
        continue
      }

      const obj = JSON.parse(_key[0])
      console.log(obj)
      console.log(obj.description)
      items.push({
        itemId: i,
        name: obj.name,
        description: obj.description,
        image: obj.image,
        price: obj.price
      })
    }
    setLoading(false)
    setItems(items)
  }

  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    loadMarketplaceItems()
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => buyMarketItem(item)} variant="outline-success" size="lg">
                        Buy for {item.price} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}
export default Home
