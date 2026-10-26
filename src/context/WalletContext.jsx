// src/context/WalletContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { SEPOLIA_CHAIN_ID, SEPOLIA_CHAIN_ID_DECIMAL } from '../utils/contract.js';

export const WalletContext = createContext({
  account: null,
  signer: null,
  provider: null,
  isConnected: false,
  isConnecting: false,
  networkName: 'Sepolia Testnet',
  isCorrectNetwork: true,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  switchNetwork: async () => {},
});

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  // Check existing connection on mount
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const bp = new ethers.BrowserProvider(window.ethereum);
          setProvider(bp);
          bp.getSigner().then(setSigner).catch(console.error);
        } else {
          setAccount(null);
          setSigner(null);
        }
      };

      const handleChainChanged = (chainIdHex) => {
        const isSepolia =
          chainIdHex === SEPOLIA_CHAIN_ID || parseInt(chainIdHex, 16) === SEPOLIA_CHAIN_ID_DECIMAL;
        setIsCorrectNetwork(isSepolia);
        window.location.reload();
      };

      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts && accounts.length > 0) {
            handleAccountsChanged(accounts);
          }
        })
        .catch(console.error);

      window.ethereum.on?.('accountsChanged', handleAccountsChanged);
      window.ethereum.on?.('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener?.('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const switchNetwork = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      setIsCorrectNetwork(true);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia Test Network',
                nativeCurrency: { name: 'Sepolia ETH', symbol: 'SEP', decimals: 18 },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          setIsCorrectNetwork(true);
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError);
        }
      } else {
        console.error('Failed to switch network:', switchError);
      }
    }
  };

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const bp = new ethers.BrowserProvider(window.ethereum);
          setProvider(bp);
          const sig = await bp.getSigner();
          setSigner(sig);

          const network = await bp.getNetwork();
          const isSepolia = Number(network.chainId) === SEPOLIA_CHAIN_ID_DECIMAL;
          setIsCorrectNetwork(isSepolia);
        }
      } else {
        // Fallback demo connection (matching mock wallet address from mockup)
        setAccount('0x0A3...7f2e');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      // Fallback demo address so user can test the UI regardless
      setAccount('0x0A3...7f2e');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        signer,
        provider,
        isConnected: !!account,
        isConnecting,
        networkName: 'Sepolia Testnet',
        isCorrectNetwork,
        connectWallet,
        disconnectWallet,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
