// src/hooks/useWallet.js
import { useContext } from 'react';
import { WalletContext } from '../context/WalletContext.jsx';

// Simple hook to expose wallet context values
export const useWallet = () => {
  return useContext(WalletContext);
};
