import './App.css';
import {useEffect, useState} from "react";
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  });
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider,
        });
      } else {
        console.error('Please, install Metamask.');
      }
    };

    void loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    }

    web3Api.web3 && void getAccount();
  }, [web3Api.web3]);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <strong>Account:</strong>
          <h1>{account ? account : 'not connected'}</h1>
          <div className="balance-view is-size-2">
            Current balance: <strong>10</strong> ETH
          </div>
          <button className="button mr-2">Donate</button>
          <button className="button">Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
