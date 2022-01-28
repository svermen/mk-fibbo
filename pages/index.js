import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRef } from "react";
import web3 from "web3";
import axios from "axios";
import Web3Modal from "web3modal";
import Image from "next/image";
import Link from "next/link";

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function Home(props) {
  const [nfts, setNfts] = useState([]);
  const unique = Array.from(new Set(nfts.map(a => a.name)))
  .map(name => {
   return nfts.find(a => a.name === name)
  })
  const [loaded, setLoaded] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  let search = ""
  if(typeof(props.data) === 'undefined'){
    search = ''
  }else{
    search= props.data;
  }
    
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.testnet.fantom.network/"
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = web3.utils.fromWei(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    console.log("items: ", items);
    setNfts(items);
    setLoaded("loaded");
  }
  
  async function buyNft(nft) {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    const price = web3.utils.toWei(nft.price.toString(), "ether");

    console.log("price: ", price);

    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFTs();
  }

  if (loaded === "loaded" && !nfts.length)
    return <h1 className="p-20 text-4xl">No NFTs!</h1>;
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          { unique.filter(nf => nf.name.includes(search)).map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <Image
                src={nft.image}
                className="rounded"
                width="300px"
                height="250px"
              />
              <p style={{ height: "1px" }} className="text-2xl font-bold">
                {nft.name}
              </p>
              <br></br>
              <p className="text-2xl my-4 font-semibold">
                Price: {nft.price} FTM
              </p>

              <button
                className="bg-gradient-to-r from-blue-500 via-purple-500 text-white font-bold py-2 px-6 mx-4 rounded"
                onClick={() => buyNft(nft)}
              >
                Comprar
              </button>

              <Link
                href={{
                  pathname: "/details-item",
                  query: { id: nft.tokenId },
                }}
              >
                <button className="bg-gradient-to-r from-blue-500 via-purple-500 text-white font-bold py-2 px-6 mx-4 rounded">
                  Detalle
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
