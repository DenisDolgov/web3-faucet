import './App.css';
import {useCallback, useEffect, useState} from "react";
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";
import {loadContract} from "./utils/loadContract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
    isProviderLoaded: false,
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, reload] = useState(false);
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);

  const setListeners = provider => {
    provider.on('accountsChanged', accounts => setAccount(accounts[0]));
    provider._jsonRpcConnection.events.on('notification', payload => {
      const { method, params } = payload;

      if (method === 'metamask_unlockStateChanged') {
        if (params.isUnlocked) {
          setAccount(params.accounts[0]);
        } else {
          setAccount(null);
        }
      }
    });
  }

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        setListeners(provider);

        const contract = await loadContract('Faucet', provider);
        setWeb3Api({
          web3: new Web3(provider),
          isProviderLoaded: true,
          provider,
          contract,
        });
      } else {
        setWeb3Api({
          ...web3Api,
          isProviderLoaded: true,
        })
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
  }, [web3Api, shouldReload]);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    }

    web3Api.web3 && void getAccount();
  }, [web3Api.web3]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei('1', 'ether'),
    });

    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  const withdraw = useCallback(async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei('0.1', 'ether');
    await contract.withdraw(withdrawAmount, { from: account });

    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          {
            web3Api.isProviderLoaded
              ? (<div className="is-flex is-align-items-center">
                  <strong className="mr-2">Account:</strong>
                  {
                    account
                      ? <span>{account}</span>
                      : !web3Api.provider
                        ? (
                          <>
                            <div className="notification is-size-6 is-rounded is-warning">
                              Wallet is not detected!{' '}
                              <a target="_blank" href="https://metamask.io/download/">Install Metamask</a>
                            </div>
                          </>
                        )
                        : (
                          <button
                            onClick={() => web3Api.provider.request({method: 'eth_requestAccounts'})}
                            className="button is-info mr-2"
                          >Connect Wallet</button>
                        )
                  }
                </div>)
              : (<span>Looking for Web3...</span>)
          }
          <div className="balance-view is-size-2 my-4">
            Current balance: <strong>{balance}</strong> ETH
          </div>
          <button disabled={!account} className="button is-link mr-2" onClick={addFunds}>Donate 1 eth</button>
          <button disabled={!account} className="button is-primary" onClick={withdraw}>Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
