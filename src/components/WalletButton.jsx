// src/components/WalletButton.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet.js';

const WalletButton = () => {
  const {
    account,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    networkName,
    isCorrectNetwork,
    switchNetwork,
  } = useWallet();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const formatShort = (addr) => {
    if (!addr) return '';
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <button className="wallet-btn" onClick={connectWallet} disabled={isConnecting}>
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="wallet-btn connected" onClick={() => setOpen(!open)}>
        <div className="wallet-avatar">
          {account.slice(2, 4).toUpperCase()}
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatShort(account)}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>▾</span>
      </button>

      {open && (
        <div className="wallet-dropdown">
          <div className="wallet-dropdown__network">
            <span className="wallet-dot" />
            <span>{networkName}</span>
          </div>

          {!isCorrectNetwork && (
            <button
              onClick={() => {
                switchNetwork();
                setOpen(false);
              }}
              style={{
                width: '100%',
                marginBottom: '0.75rem',
                padding: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: 'var(--purple-bg)',
                color: 'var(--purple-primary)',
                border: '1px solid var(--purple-border)',
                borderRadius: '0.35rem',
                cursor: 'pointer',
              }}
            >
              Switch to Sepolia
            </button>
          )}

          <div className="wallet-dropdown__actions">
            <button
              onClick={() => {
                disconnectWallet();
                setOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--red)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                padding: '0.2rem 0',
              }}
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletButton;
