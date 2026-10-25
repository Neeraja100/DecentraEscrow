// src/components/WalletButton.jsx
import React, { useContext } from 'react';
import { WalletContext } from '../context/WalletContext.jsx';

const WalletButton = () => {
  const { connectWallet, account, networkName, isCorrectNetwork } = useContext(WalletContext);

  return (
    <button className="wallet-button" onClick={connectWallet}>
      {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
      {account && !isCorrectNetwork && <span className="wallet-button__warning"> (Wrong network)</span>}
    </button>
  );
};

export default WalletButton;
