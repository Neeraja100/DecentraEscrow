# DecentraEscrow – Decentralized Escrow Marketplace

## Project Title and Overview
Freelancers and clients often face payment disputes: payments are made upfront without guarantees of delivery, or work is delivered without being paid. **DecentraEscrow** solves this problem with a blockchain‑based escrow smart contract that holds funds in trust until predefined conditions are met, providing transparent, immutable, and automated payment settlements.

## Key Features
- **Job Marketplace** – Post, browse, and apply for freelance jobs.
- **Client Workflow** – Create a job, fund the escrow via MetaMask, and release payment after work approval.
- **Freelancer Workflow** – Accept a job, submit deliverables, and claim payment once the client releases the escrow.
- **MetaMask Integration** – All blockchain interactions are performed through MetaMask.
- **Escrow Funding & Conditional Release** – Funds are locked in the Solidity contract and released only after the client confirms completion.
- **Refunds** – Clients can reclaim funds if the job is cancelled before acceptance.
- **Transaction Verification** – Every operation (deposit, release, refund) is recorded on the Sepolia testnet and can be inspected via ethers.js.

> **Implemented** – All UI pages, wallet handling, and contract interaction are functional on the Sepolia testnet.
> **Planned** – Full test suite, multi‑currency support, and advanced dispute resolution.

## Tech Stack
| Layer | Technology |
|------|------------|
| Frontend | React, Vite, JavaScript, React Router, CSS (black & purple theme) |
| Smart Contract | Solidity (Escrow contract) |
| Blockchain Interaction | ethers.js, MetaMask |
| Development Tools | Remix IDE (contract editing), Node.js, npm |
| Network | Ethereum Sepolia Testnet |

## Prerequisites
- **Git** – to clone the repository.
- **Node.js (>= 18)** and **npm** – for dependency management and script execution.
- **MetaMask** browser extension – connected to the Sepolia testnet.

## Setup Instructions
```bash
# 1️⃣ Clone the repo
git clone https://github.com/Neeraja100/DecentraEscrow.git
cd DecentraEscrow

# 2️⃣ Install dependencies
npm install

# 3️⃣ (Optional) Create a .env file if you need custom env vars.
#    The project currently works without additional variables,
#    but you may add e.g. REACT_APP_SEPOLIA_RPC_URL if desired.
```

## Running the Application
```bash
# Development server (Vite)
npm run dev
# → Open http://localhost:3000 in your browser

# Production build
npm run build

# Preview the production build locally
npm run preview
```
The app runs on `http://localhost:3000` (or the port shown by Vite). Ensure MetaMask is unlocked and set to the **Sepolia** network before interacting with the escrow contract.

## Dashboard Overview
| Dashboard | Description |
|-----------|-------------|
| **Client Dashboard** | View posted jobs, fund escrow, monitor escrow status, and release or refund payments. |
| **Freelancer Dashboard** | Browse accepted jobs, see escrow balance, submit deliverables, and claim released funds. |
| **Marketplace** | Browse all open jobs, filter by budget or status, and apply to jobs. |
| **Escrow Workflow** | Funds are deposited into `DecentralizedEscrow.sol`, locked until the client calls `releasePayment`. Refunds are possible before job acceptance. |
| **Transaction History** | All escrow‑related transactions (deposit, release, refund) are displayed with transaction hashes, timestamps, and statuses. |

## Project Goal
Provide a **transparent, rule‑based platform** for freelance payments where trust is enforced by smart‑contract logic rather than third‑party intermediaries. The prototype demonstrates end‑to‑end escrow flow on a public testnet.

## Team
- Tejas
- Harshit
- Nupur
- Neeraja

## License
This repository is an **educational prototype**. Unless a specific license file is added later, the code is provided **as‑is** for learning and experimentation only.
