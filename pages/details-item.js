import { ethers } from "ethers";
import { useEffect, useState } from "react";
import web3 from "web3";
import axios from "axios";
import Web3Modal from "web3modal";
import Image from "next/image";
import { nftmarketaddress, nftaddress } from "../config";

import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
//import { loadGetInitialProps } from "next/dist/next-server/lib/utils";
import { useRouter } from "next/router";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [details, setDetails] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
  useEffect(() => {
    loadNFTs(router.query);
  }, []);

  async function loadNFTs(tokenId) {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.testnet.fantom.network/"
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );
    console.log(tokenId.id);
    const data = await marketContract.fetchMarketItem(Number(tokenId.id));
    console.log(Number(data.price._hex));
    const tokenUri = await tokenContract.tokenURI(Number(tokenId.id));
    const meta = await axios.get(tokenUri);

    let price = Number((data.price._hex)/100000000);
    let item = {
      price,
      tokenId: Number(tokenId.id),
      name: meta.data.name,
      descripcion: meta.data.description,
      image: meta.data.image,
    };
    

    setNfts(item);
    const details = item;
    setDetails(details);
    console.log("details: ", details);
    
  }
  //if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
  return (
    <div className="flex justify-center">
      <div className="p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <img src={details.image} className="rounded" />

          <div className="p-4">
            <p className="font-bold text-purple">{details.name}</p>
            <p className="p-4">{details.descripcion}</p>
            <div className="border shadow rounded-xl overflow-hidden">
              <div className="rounded" />
              <div className="p-4">
                <p className="font-bold">Precio Actual</p>
                <br></br>
                <p className="text-2xl font-bold">{details.price} FTM</p>
                <br></br>
                <button className="rounded bg-gradient-to-r from-blue-500 via-purple-500 py-2 px-6 text-white font-bold">
                  Comprar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
