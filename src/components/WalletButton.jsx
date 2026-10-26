// src/components/WalletButton.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet.js';

const WalletButton = () => {
  const { account, isConnected, connectWallet, disconnectWallet, networkName } = useWallet();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!isConnected) {
    return (
      <button className="wallet-btn" onClick={connectWallet}>
        🔗 Connect Wallet
      </button>
    );
  }

  return (
    <div ref={ref} style={{position: 'relative'}}>
      <button className="wallet-btn connected" onClick={() => setOpen(!open)}>
        <span className="wallet-dot" />
        {account}
      </button>
      {open && (
        <div style={{position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          right: 0,
          background: 'var(--bg-card)',
          border: '1px solid var(--purple-border)',
          borderRadius: 'var(--border-radius-sm)',
          padding: '0.75rem',
          minWidth: '180px',
          boxShadow: 'var(--shadow)',
          zIndex: 1001,}}>
          <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>{networkName}</div>
          <button
            onClick={() => { disconnectWallet(); setOpen(false); }}
            style={{background: 'none', border: 'none', color: 'var(--red)', fontSize: '0.875rem', cursor: 'pointer', padding: 0, fontFamily: 'inherit'}}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletButton;
