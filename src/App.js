import './App.css';
import {useEffect, useState} from "react";
import Web3 from 'web3';

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  })

  useEffect(() => {
    const loadProvider = async () => {
      let provider = null;

      if (window.ethereum) {
        provider = window.ethereum;

        try {
          await provider.enable();
        } catch {
          console.error('User denied accounts access!');
        }
      } else if (window.web3) {
        provider = window.web3.currentProvider;
      } else if (!process.env.production) {
        provider = new Web3.providers.HttpProvider('HTTP://localhost:7545');
      }

      setWeb3Api({
        web3: new Web3(provider),
        provider,
      })
    };

    void loadProvider();
  }, []);

  console.log(web3Api.web3);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="balance-view is-size-2">
            Current balance: <strong>10</strong> ETH
          </div>
          <button className="button mr-2" onClick={async () => {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log(accounts);
          }}>Enable Ethereum</button>
          <button className="button mr-2">Donate</button>
          <button className="button">Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
