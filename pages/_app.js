import "../styles/globals.css";
import Link from "next/link";
import IconButton from "@material-ui/core/IconButton";
import {useState} from 'react';
import {
  ShoppingCart,
  AccountCircleRounded,
  AccountBalanceWallet,
} from "@material-ui/icons";

function MyApp({ Component, pageProps }) {
  const [search,setAge]=useState()
    
  const changeAge =()=>{
    setAge(40)
  }
  return (
    <div>
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <a href="#" className="flex">
            <img
              className="m-2 w-20 sm:w-40 self-center"
              src="../images/Fibbo-azul.png"
             
            />
          </a>
          <input
            placeholder="Buscar en Fibbo"
            className="mt-4 border rounded mr-10 p-4 px-28 "
            value={search} onChange={(e)=>setAge(e.target.value)}
          />
          <div className="hidden w-full md:block md:w-auto">
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
              <Link href="/">
                <li>
                  <a className="block py-2 pl-3 pr-4 text-purple-500 text-2xl font-bold text-base border-b border-gray-100 hover:bg-gray-50 cursor-pointer md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                    Home
                  </a>
                </li>
              </Link>

              <Link href="/create-item">
                <li>
                  <a className="block py-2 pl-3 pr-4 text-purple-500 text-2xl font-bold text-base border-b border-gray-100 hover:bg-gray-50 cursor-pointer md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                    Create NFT 
                  </a>
                </li>
              </Link>

              <Link href="/my-nfts">
                <li>
                  <a className="block py-2 pl-3 pr-4 text-purple-500 text-2xl font-bold text-base border-b border-gray-100 hover:bg-gray-50 cursor-pointer md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                    My NFTs
                  </a>
                </li>
              </Link>
              <Link href="/">
                <IconButton aria-label="show cart items" color="inherit">
                  <AccountCircleRounded fontSize="large" />
                </IconButton>
              </Link>
              <Link href="/">
                <IconButton aria-label="show cart items" color="inherit">
                  <AccountBalanceWallet fontSize="large" />
                </IconButton>
              </Link>
            </ul>
          </div>
        </div>
      </nav>
      <Component {...pageProps}  data={search} />
    </div>
  );
}

export default MyApp;
