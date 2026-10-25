// src/utils/formatAddress.js
/**
 * Truncate an Ethereum address for display.
 * Example: 0x1234...abcd
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
