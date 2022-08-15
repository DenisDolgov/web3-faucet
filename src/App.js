import './App.css';
import {useEffect, useState} from "react";
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";
import {loadContract} from "./utils/loadContract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract('Faucet', provider);

      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
        });
      } else {
        console.error('Please, install Metamask.');
      }
    };

    void loadProvider();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, 'ether'));
    };

    web3Api.contract && loadBalance();
  }, [web3Api]);

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
          <div className="is-flex is-align-items-center">
            <strong className="mr-2">Account:</strong>
            {
              account
                ? <span>{account}</span>
                : <button
                  onClick={() => web3Api.provider.request({method: 'eth_requestAccounts'})}
                  className="button is-info mr-2"
                >Connect Wallet</button>
            }
          </div>
          <div className="balance-view is-size-2 my-4">
            Current balance: <strong>{balance}</strong> ETH
          </div>
          <button className="button is-link mr-2">Donate</button>
          <button className="button is-primary">Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
