
import { ethers } from 'ethers';
import DecentraEscrowABI from '../contracts/DecentraEscrowABI.json';

// Deployed DecentraEscrow contract on Sepolia
export const ESCROW_CONTRACT_ADDRESS =
  import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS ||
  '0xBe334a9722052C99a618970953fb69BE085c8b73';

export const SEPOLIA_CHAIN_ID = '0xaa36a7';
export const SEPOLIA_CHAIN_ID_DECIMAL = 11155111;

/**
 * Get contract instance
 */
export function getEscrowContract(signerOrProvider) {
  if (!signerOrProvider) {
    throw new Error('Wallet or provider is not connected.');
  }

  if (!ethers.isAddress(ESCROW_CONTRACT_ADDRESS)) {
    throw new Error('Invalid escrow contract address.');
  }

  return new ethers.Contract(
    ESCROW_CONTRACT_ADDRESS,
    DecentraEscrowABI,
    signerOrProvider
  );
}

/**
 * Validate wallet, network and deployed contract
 */
async function getValidatedContract(signer) {
  if (!signer) {
    throw new Error('Please connect your MetaMask wallet first.');
  }

  const provider = signer.provider;

  if (!provider) {
    throw new Error('Wallet provider is unavailable.');
  }

  const network = await provider.getNetwork();

  if (Number(network.chainId) !== SEPOLIA_CHAIN_ID_DECIMAL) {
    throw new Error('Please switch MetaMask to the Sepolia Test Network.');
  }

  const code = await provider.getCode(ESCROW_CONTRACT_ADDRESS);

  if (code === '0x') {
    throw new Error(
      'No smart contract was found at the configured address on Sepolia.'
    );
  }

  return getEscrowContract(signer);
}

/**
 * Validate transaction receipt
 */
async function waitForTransaction(tx) {
  const receipt = await tx.wait();

  if (!receipt || receipt.status !== 1) {
    throw new Error('Transaction failed on the blockchain.');
  }

  return {
    success: true,
    hash: receipt.hash || tx.hash,
    onChain: true,
  };
}

/**
 * Convert errors into readable messages
 */
function handleTransactionError(error) {
  console.error('Blockchain transaction failed:', error);

  if (
    error.code === 'ACTION_REJECTED' ||
    error.code === 4001
  ) {
    throw new Error('Transaction was rejected in MetaMask.');
  }

  if (error.code === 'INSUFFICIENT_FUNDS') {
    throw new Error('Insufficient Sepolia ETH for this transaction.');
  }

  if (error.code === 'CALL_EXCEPTION') {
    throw new Error(
      'Transaction reverted. Check the escrow status, wallet permissions and contract requirements.'
    );
  }

  throw new Error(error.message || 'Blockchain transaction failed.');
}

/**
 * Deposit ETH into an existing escrow
 */
export async function depositToEscrow({ jobId, amountEth, signer }) {
  try {
    const contract = await getValidatedContract(signer);
    const parsedAmount = ethers.parseEther(String(amountEth));

    const tx = await contract.fundEscrow(
      BigInt(jobId),
      { value: parsedAmount }
    );

    return await waitForTransaction(tx);
  } catch (error) {
    handleTransactionError(error);
  }
}

export async function createAndFundEscrowOnChain({
  jobId,
  title,
  freelancerAddress,
  amountEth,
  deadlineTimestamp,
  signer,
}) {
  try {
    const contract = await getValidatedContract(signer);

    if (!ethers.isAddress(freelancerAddress)) {
      throw new Error('Please provide a valid freelancer wallet address.');
    }

    if (!title || !title.trim()) {
      throw new Error('Job title is required.');
    }

    const amount = ethers.parseEther(String(amountEth));

    if (amount <= 0n) {
      throw new Error('Escrow amount must be greater than zero.');
    }

    if (Number(deadlineTimestamp) <= Math.floor(Date.now() / 1000)) {
      throw new Error('The deadline must be in the future.');
    }

    const tx = await contract.createAndFundEscrow(
      BigInt(jobId),
      title,
      freelancerAddress,
      BigInt(deadlineTimestamp),
      { value: amount }
    );

    return await waitForTransaction(tx);
  } catch (error) {
    handleTransactionError(error);
  }
}


/**
 * Submit work on-chain
 */
export async function submitWorkDeliverable({
  jobId,
  submissionUrl,
  submissionMessage,
  signer,
}) {
  try {
    const contract = await getValidatedContract(signer);

    const tx = await contract.submitWork(
      BigInt(jobId),
      submissionUrl,
      submissionMessage || 'Work submitted'
    );

    return await waitForTransaction(tx);
  } catch (error) {
    handleTransactionError(error);
  }
}

/**
 * Approve work and release funds to freelancer
 */
export async function approveAndReleaseEscrow({ jobId, signer }) {
  try {
    const contract = await getValidatedContract(signer);

    const tx = await contract.approveAndReleasePayment(BigInt(jobId));

    return await waitForTransaction(tx);
  } catch (error) {
    handleTransactionError(error);
  }
}

/**
 * Refund escrow to client
 */
export async function refundEscrow({ jobId, signer }) {
  try {
    const contract = await getValidatedContract(signer);

    const tx = await contract.refund(BigInt(jobId));

    return await waitForTransaction(tx);
  } catch (error) {
    handleTransactionError(error);
  }
}

/**
 * Sepolia Etherscan transaction link
 */
export function getExplorerTxUrl(txHash) {
  if (!txHash) return '#';

  return `https://sepolia.etherscan.io/tx/${txHash}`;
}

/**
 * Sepolia Etherscan address link
 */
export function getExplorerAddressUrl(address) {
  if (!address) return '#';

  return `https://sepolia.etherscan.io/address/${address}`;
}

export async function createAndFundEscrow({
  jobId,
  title,
  freelancerAddress,
  deadline,
  amountEth,
  signer,
}) {
  try {
    const contract = await getValidatedContract(signer);

    if (!ethers.isAddress(freelancerAddress)) {
      throw new Error('Please provide a valid freelancer wallet address.');
    }

    const amount = ethers.parseEther(String(amountEth));

    const tx = await contract.createAndFundEscrow(
      BigInt(jobId),
      title,
      freelancerAddress,
      BigInt(deadline),
      { value: amount }
    );

    return await waitForTransaction(tx);
  } catch (error) {
    handleTransactionError(error);
  }
}

