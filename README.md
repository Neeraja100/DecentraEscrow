# DecentraEscrow — Decentralized Freelancing Escrow Marketplace

A trust-minimized freelancing escrow platform powered by Ethereum smart contracts. DecentraEscrow eliminates payment uncertainty for freelancers and upfront delivery risk for clients by holding funds in programmatic escrow until work is delivered and approved.

---

## 🌟 Visual Mockup Alignment

The frontend implementation strictly matches the 8 screens specified in the project mockups and `DecentraEscrow.md`:

1. **Home Page (Landing):** Hero section with 3D isometric Ethereum shield graphic, value proposition, and 4 core value proposition feature cards.
2. **Browse Jobs:** Search bar, categorical breakdown with item counts, sort options, and detailed job cards with budget, client info, and "View Details".
3. **Job Details:** Meta chips (Budget, Posted, Deadline, Proposals), client credentials, full job description, requirements checklist, and payment security card.
4. **Create a Job (Client):** Form for posting job title, description, category, budget (ETH), and delivery deadline.
5. **Escrow Funding:** 3-step progress stepper (Details → Fund Escrow → Confirm), wallet deposit details table, Sepolia network badge, and MetaMask deposit action.
6. **Job Progress (Freelancer):** 4-stage vertical timeline (Escrow Funded, Work Submitted, Client Review, Payment Release) and deliverable submission box.
7. **Client Review:** Interactive browser preview frame ("Build Something Amazing"), deliverable GitHub link, freelancer message, and Approve & Release / Raise Dispute actions.
8. **Transaction Success:** Celebration checkmark with confetti particles, transaction summary table, Sepolia testnet hash link, and explorer navigation.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Smart Contract** | Solidity (`^0.8.20`) with ReentrancyGuard and Access Control |
| **Frontend Framework** | React 18, Vite |
| **Styling** | Vanilla CSS (Modern light Web3 theme, Plus Jakarta Sans, Inter) |
| **Web3 Provider** | ethers.js (`v6.7.0`), MetaMask |
| **Network** | Ethereum Sepolia Testnet (Chain ID `11155111`) |

---

## 📜 Smart Contract Architecture (`contracts/DecentraEscrow.sol`)

The contract enforces the following state lifecycle:

```
Created  ──>  Funded  ──>  WorkSubmitted  ──>  Approved (Funds Released)
   │             │              │
   │             ▼              ▼
   └─────>   Refunded        Disputed  ──>  Resolved
```

### Core Functions

- `createEscrow(uint256 _jobId, string _title, address payable _freelancer, uint256 _amount, uint256 _deadline)`
- `fundEscrow(uint256 _jobId)` (payable)
- `createAndFundEscrow(uint256 _jobId, string _title, address payable _freelancer, uint256 _deadline)` (payable)
- `submitWork(uint256 _jobId, string _submissionUrl, string _submissionMessage)`
- `approveAndReleasePayment(uint256 _jobId)`
- `refund(uint256 _jobId)`
- `raiseDispute(uint256 _jobId, string _reason)`
- `resolveDispute(uint256 _jobId, bool _releaseToFreelancer)`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:5173` (or the port shown in terminal) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 👥 Team Responsibilities (as per PRD)

- **Tejas:** Smart Contract Development (`contracts/DecentraEscrow.sol`, state machine, access control)
- **Harshit:** Blockchain Deployment & Integration (MetaMask, ethers.js, Sepolia testnet)
- **Nupur:** Frontend & User Experience (React components, UI mockups, responsive design)
- **Neeraja:** Product Workflow, Testing Coordination, and Documentation
