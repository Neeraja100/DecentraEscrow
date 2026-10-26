// src/hooks/useWallet.js
import { useContext } from 'react';
import { WalletContext } from '../context/WalletContext.jsx';

export const useWallet = () => useContext(WalletContext);
