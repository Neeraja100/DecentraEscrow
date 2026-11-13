
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { ethers } from 'ethers';
import {
  SEPOLIA_CHAIN_ID,
  SEPOLIA_CHAIN_ID_DECIMAL,
} from '../utils/contract.js';

export const WalletContext = createContext({
  account: null,
  signer: null,
  provider: null,
  isConnected: false,
  isConnecting: false,
  networkName: 'Not connected',
  isCorrectNetwork: false,
  connectWallet: async () => { },
  disconnectWallet: () => { },
  switchNetwork: async () => { },
});

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [networkName, setNetworkName] = useState('Not connected');

  const updateWallet = useCallback(async (accounts, chainId) => {
    if (!accounts || accounts.length === 0) {
      setAccount(null);
      setSigner(null);
      setProvider(null);
      setIsCorrectNetwork(false);
      setNetworkName('Not connected');
      return;
    }

    const bp = new ethers.BrowserProvider(window.ethereum);
    const network = await bp.getNetwork();
    const isSepolia = Number(network.chainId) === SEPOLIA_CHAIN_ID_DECIMAL;

    setAccount(accounts[0]);
    setProvider(bp);
    setSigner(await bp.getSigner());
    setIsCorrectNetwork(isSepolia);
    setNetworkName(
      isSepolia ? 'Sepolia Testnet' : `Wrong Network (${chainId || network.chainId})`
    );
  }, []);

  useEffect(() => {
    if (!window.ethereum) {
      setNetworkName('MetaMask not detected');
      return;
    }

    const handleAccountsChanged = async (accounts) => {
      try {
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });
        await updateWallet(accounts, chainId);
      } catch (error) {
        console.error('Account update failed:', error);
      }
    };

    const handleChainChanged = async (chainId) => {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        await updateWallet(accounts, chainId);
      } catch (error) {
        console.error('Network update failed:', error);
      }
    };

    window.ethereum.request({ method: 'eth_accounts' })
      .then(handleAccountsChanged)
      .catch((error) => console.error('Wallet check failed:', error));

    window.ethereum.on?.('accountsChanged', handleAccountsChanged);
    window.ethereum.on?.('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [updateWallet]);

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed.');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (error) {
      if (error.code !== 4902) {
        throw error;
      }

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: SEPOLIA_CHAIN_ID,
            chainName: 'Sepolia Test Network',
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://rpc.sepolia.org'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      });

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    }

    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    await updateWallet(accounts, SEPOLIA_CHAIN_ID);
  }, [updateWallet]);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install it first.');
    }

    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      await updateWallet(accounts, chainId);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [updateWallet]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
    setIsCorrectNetwork(false);
    setNetworkName('Not connected');
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        signer,
        provider,
        isConnected: !!account && !!signer && !!provider,
        isConnecting,
        networkName,
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
