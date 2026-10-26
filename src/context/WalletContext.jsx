// src/context/WalletContext.jsx
import React, { createContext, useState } from 'react';

export const WalletContext = createContext({
  account: null,
  isConnected: false,
  networkName: 'Sepolia Testnet',
  connectWallet: () => {},
  disconnectWallet: () => {},
});

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = () => {
    setAccount('0x0A3...72e');
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected: !!account,
        networkName: 'Sepolia Testnet',
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
