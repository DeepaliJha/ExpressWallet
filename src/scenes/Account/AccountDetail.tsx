import React, { useEffect, useState } from 'react';
import { sendToken } from '../../utils/TransactionUtils';
import { goerli } from '../../models/Chain';
import { Account } from '../../models/Account';
import AccountTransactions from './AccountTransactions';
import { ethers } from 'ethers';
import { toFixedIfNecessary } from '../../utils/AccountUtils';
import fiftyrupee from "./fiftyrupees.jpg";
import fiftycoin from "./fiftycoinneww.jpg";
import fivehundred from "./fivehundredrupees.jpg";
import fiverupees from "./fiverupees.jpg";
import hundredrupees from "./hundredrupees.jpg";
import onerupees from "./onerupeesnew.jpg";
import twohundredrupees from "./twohundredrupees.jpg";
import tworupees from "./tworupees.jpg";
import twothousandrupees from "./twothousandrupees.jpg";
import './Account.css';

import expressPayLogo from './expressPayLogo.jpg'; // Import the Express Wallet logo image

interface AccountDetailProps {
  account: Account;
}

const AccountDetail: React.FC<AccountDetailProps> = ({ account }) => {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(account.balance);

  const [networkResponse, setNetworkResponse] = useState<{
    status: null | 'pending' | 'complete' | 'error';
    message: string | React.ReactElement;
  }>({
    status: null,
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const provider = new ethers.providers.JsonRpcProvider(goerli.rpcUrl);
      let accountBalance = await provider.getBalance(account.address);
      setBalance(String(toFixedIfNecessary(ethers.utils.formatEther(accountBalance))));
    };
    fetchData();
  }, [account.address]);

  function handleDestinationAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDestinationAddress(event.target.value);
  }
  
  function handleAmountImageClick(value: number) {
    setAmount(value);
  }

  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAmount(Number.parseFloat(event.target.value));
  }

  async function transfer() {
    // Set the network response status to "pending"
    setNetworkResponse({
      status: 'pending',
      message: '',
    });

    try {
      const { receipt } = await sendToken(amount, account.address, destinationAddress, account.privateKey);

      if (receipt.status === 1) {
        // Set the network response status to "complete" and the message to the transaction hash
        setNetworkResponse({
          status: 'complete',
          message: (
            <p>
              Transfer complete!{' '}
              <a href={`${goerli.blockExplorerUrl}/tx/${receipt.transactionHash}`} target="_blank" rel="noreferrer">
                View transaction
              </a>
            </p>
          ),
        });
        return receipt;
      } else {
        // Transaction failed
        console.log(`Failed to send ${receipt}`);
        // Set the network response status to "error" and the message to the receipt
        setNetworkResponse({
          status: 'error',
          message: JSON.stringify(receipt),
        });
        return { receipt };
      }
    } catch (error: any) {
      // An error occurred while sending the transaction
      console.error({ error });
      // Set the network response status to "error" and the message to the error
      setNetworkResponse({
        status: 'error',
        message: error.reason || JSON.stringify(error),
      });
    }
  }

  return (
    <div className="AccountDetail container" >
      <h4 className="fancy-balance">
  <span className="fancy-line-left"></span>
  Erupee Balance : {balance} e<span className="WebRupee">&#x20B9;</span>
  <span className="fancy-line-right"></span>
</h4>
      
      <h4>
        <img src={expressPayLogo} alt="Express Wallet Logo" className="express-wallet-logo" /> My Address:{' '}
        <a href={`https://goerli.etherscan.io/address/${account.address}`} target="_blank" rel="noreferrer">
          {account.address}
        </a>
        <br />
       </h4>

      <div className="form-group">
        <label>Receiver's Address:</label>
        <input
  className="form-control fancy-input"
  type="text"
  value={destinationAddress}
  onChange={handleDestinationAddressChange}
/>
      </div>
      <div className="amount-images-container">
        <div className="rupee-notes">
          <img src={fivehundred} alt="500 Rupee Note" onClick={() => handleAmountImageClick(500)} />
          <img src={fiftyrupee} alt="50 Rupee Note" onClick={() => handleAmountImageClick(50)} />
          <img src={fiverupees} alt="5 Rupee Note" onClick={() => handleAmountImageClick(5)} />
          <img src={hundredrupees} alt="100 Rupee Note" onClick={() => handleAmountImageClick(100)} />
          <img src={twohundredrupees} alt="200 Rupee Note" onClick={() => handleAmountImageClick(200)} />
          <img src={tworupees} alt="2 Rupee Note" onClick={() => handleAmountImageClick(2)} />
          <img src={twothousandrupees} alt="2000 Rupee Note" onClick={() => handleAmountImageClick(2000)} />
        </div>
        <div className="coin-notes">
          <div className="coin-images-row">
            <img src={onerupees} alt="1 Rupee coin" onClick={() => handleAmountImageClick(1)} />
            <img src={fiftycoin} alt="50 Paisa coin" onClick={() => handleAmountImageClick(0.5)} />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Amount:</label>
        <input className="form-control fancy-input" type="number" value={amount} onChange={handleAmountChange} />
      </div>

      <button
        className="btn"
        type="button"
        onClick={transfer}
        disabled={!amount || networkResponse.status === 'pending'}
      >
        Send {amount} e<span className="WebRupee">&#x20B9;</span>
      </button>
      <hr />

      {networkResponse.status && (
        <>
          {networkResponse.status === 'pending' && <p>Transfer is pending...</p>}
          {networkResponse.status === 'complete' && <p>{networkResponse.message}</p>}
          {networkResponse.status === 'error' && (
            <p>Error occurred while transferring tokens: {networkResponse.message}</p>
          )}
          
        </>
      )}

      <AccountTransactions account={account} />
    </div>
  );
};

export default AccountDetail;
