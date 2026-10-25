// src/context/WalletContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Create a context that will hold wallet state and actions
export const WalletContext = createContext({
  account: null,
  provider: null,
  networkName: null,
  isCorrectNetwork: false,
  connectWallet: async () => {},
});

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  // Expected Sepolia chain ID (decimal)
  const SEPOLIA_CHAIN_ID = Number(import.meta.env.VITE_SEPOLIA_CHAIN_ID || 11155111);

  // Initialise provider if MetaMask is available
  useEffect(() => {
    if (window.ethereum) {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);
    }
  }, []);

  // Listen for account / network changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
      } else {
        setAccount(accounts[0]);
      }
    };
    const handleChainChanged = (chainIdHex) => {
      // chainId is hex string, convert to decimal
      const chainId = Number(chainIdHex);
      setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
      // Refresh provider to avoid stale network data
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);
    };
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask not detected. Please install MetaMask to use wallet features.');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        // Update network info after connection
        const network = await provider.getNetwork();
        setNetworkName(network.name);
        setIsCorrectNetwork(network.chainId === SEPOLIA_CHAIN_ID);
      }
    } catch (err) {
      console.error('Wallet connection rejected or failed:', err);
      alert('Wallet connection was rejected or failed.');
    }
  };

  // Expose values and actions via context
  const contextValue = {
    account,
    provider,
    networkName,
    isCorrectNetwork,
    connectWallet,
  };

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>;
};
