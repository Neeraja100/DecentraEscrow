# **DecentraEscrow — Focused PRD & Prototype Development Plan**

**Project:** DecentraEscrow — Decentralized Escrow Marketplace  
**Team:** Tejas, Harshit, Nupur, Neeraja  
**Primary Technology:** Solidity, Remix IDE, MetaMask, Ethereum Sepolia Testnet  
**Project Type:** Blockchain-based freelancing escrow prototype

This PRD focuses on the **problem statement, core problems, proposed solution, recommended final scope, implementation methodology, and division of work among four team members**. The objective is to build a working prototype that demonstrates the value of blockchain-based escrow without unnecessarily expanding the project into a full freelancing platform.

---

## **1\. Problem Statement (PS)**

Freelancing transactions involve two parties who may not fully trust each other: a client who needs work completed and a freelancer who provides the service.

In conventional arrangements, clients may hesitate to pay upfront because they risk losing money if the freelancer fails to deliver. Freelancers face the opposite problem: they may complete the work but struggle to receive payment if the client delays or refuses to pay.

Traditional platforms can address these risks through centralized payment systems and dispute-resolution mechanisms. However, users must rely on the platform to manage payments and enforce its policies.

**Problem Statement:**

How can we use blockchain technology and smart contracts to create a transparent and secure payment mechanism for freelancing transactions, where the client's funds are held until predefined conditions are satisfied and released according to clearly defined rules?

### **Project Objective**

To develop a decentralized escrow prototype that demonstrates how smart contracts can manage payments between clients and freelancers, reduce payment-related trust issues, and provide transparent, verifiable transaction records.

---

## **2\. Main Problems We Are Addressing**

We are focusing on **payment security and trust**, rather than trying to solve every problem in freelancing.

| Problem | What can go wrong? | Our approach |
| ----- | ----- | ----- |
| Payment uncertainty | A freelancer completes the work but the client refuses to pay. | Lock the agreed payment in a smart contract before work begins. |
| Upfront payment risk | A client pays in advance but the freelancer does not deliver. | Keep the payment in escrow until the agreed release conditions are met. |
| Lack of transparency | Users cannot independently verify how a payment was handled. | Record escrow state changes and payment transactions on the blockchain. |
| Dependence on intermediaries | Users rely on a platform to execute payment rules. | Use a smart contract to enforce predefined payment and authorization rules. |
| Payment disputes | The parties disagree about whether the work was completed. | Define a basic dispute-resolution mechanism and explicit rules for releasing or refunding funds. |
| Unclear transaction status | Users do not know whether funds are locked, released, or refunded. | Display escrow status and blockchain transaction hashes. |

### **What Are We Actually Solving?**

Our central problem is:

**How do we ensure that the payment is secured before work begins and is transferred only according to predefined, verifiable conditions?**

We are not claiming to eliminate fraud completely or automatically determine whether work is good enough. We are improving the transparency and enforceability of the payment process.

---

## **3\. Our Proposed Approach**

We will build DecentraEscrow as a blockchain-based escrow application using Solidity smart contracts.

The buyer deposits cryptocurrency into a smart contract instead of transferring it directly to the freelancer. The contract holds the funds until an authorized action satisfies the agreed conditions.

### **Proposed Workflow**

1. **Client creates a job:** The client specifies the work and agreed payment.  
2. **Freelancer is selected:** The client selects a freelancer for the job.  
3. **Client funds the escrow:** The client deposits the agreed amount of test ETH into the smart contract.  
4. **Freelancer submits the work:** The freelancer submits a delivery description or link.  
5. **Client reviews the work:** The client approves the delivery or raises a dispute.  
6. **Payment is released:** After approval, the smart contract transfers the payment to the freelancer.  
7. **Refund or dispute handling:** If predefined conditions are met, an eligible refund or authorized dispute resolution is processed.  
8. **Transaction is verified:** The application displays the final escrow status and transaction hash.

### **How Is Blockchain Useful Here?**

* **Smart contracts:** Enforce payment rules programmatically.  
* **Ethereum-compatible blockchain:** Maintains a verifiable record of transactions.  
* **MetaMask:** Allows users to connect wallets and authorize transactions.  
* **Solidity:** Implements the escrow logic.  
* **Sepolia Testnet:** Allows us to demonstrate the system using test ETH without using real funds.

The blockchain provides transparent execution of the programmed rules. It does not independently verify off-chain work quality, and a dispute resolver may still be needed when the parties disagree.

---

## **4\. What Makes DecentraEscrow Different?**

Our project is specifically a **freelancing escrow system**, not a general procurement management system.

| Aspect | DecentraEscrow | Blockchain for Procurement |
| ----- | ----- | ----- |
| Primary purpose | Secure payments between clients and freelancers | Manage organizational purchasing and supplier transactions |
| Main users | Clients and freelancers | Buyers, suppliers, and procurement teams |
| Main problem | Payment uncertainty and trust between two parties | Transparency and efficiency in purchasing processes |
| Core functionality | Lock, release, and refund payments | Manage purchase orders, suppliers, approvals, and procurement records |
| Smart contract role | Enforce escrow payment conditions | Enforce procurement rules and purchasing workflows |
| Main outcome | More transparent and reliable freelance payments | More transparent procurement operations |

**Our unique focus:** The smart contract acts as a programmable escrow mechanism that controls when the freelancer can receive the client's funds.

We should keep this distinction clear in our project report and presentation.

---

# **5\. Recommended Final Scope**

The most important decision is to keep the prototype achievable while demonstrating enough blockchain functionality to make the project meaningful.

I recommend building a **functional escrow application with a minimal freelancing interface**, rather than attempting to recreate an entire platform like Fiverr.

## **A. Must-Have Features**

These features form the core prototype.

### **1\. Wallet Connection**

* Connect MetaMask.  
* Display the connected wallet address.  
* Use the Sepolia test network.  
* Display transaction status.

### **2\. Basic Job Management**

* Create a job with a title, description, and agreed budget.  
* Display available jobs.  
* Associate a selected freelancer with the job.

### **3\. Smart Contract Escrow**

* Create or initialize an escrow.  
* Allow the client to deposit the agreed amount of test ETH.  
* Store the buyer address, freelancer address, amount, and escrow status.  
* Prevent unauthorized users from modifying the escrow.

### **4\. Work Submission**

* Allow the freelancer to submit a delivery description or URL.  
* Update the escrow status to indicate that the work has been submitted.

### **5\. Payment Release**

* Allow only the authorized buyer to approve the submitted work.  
* Transfer the escrowed payment to the freelancer.  
* Prevent duplicate payment releases.  
* Record the transaction hash.

### **6\. Refund Mechanism**

* Implement at least one clearly defined refund scenario, such as a refund after an agreed submission deadline has passed without delivery.  
* Enforce eligibility in the smart contract.  
* Prevent a completed or refunded escrow from being processed again.

### **7\. Transaction History**

* Display the escrow status.  
* Show the deposited amount.  
* Show the payment or refund transaction hash.  
* Allow users to verify transactions on a Sepolia-compatible blockchain explorer.

## **B. Features to Include If Time Permits**

* Basic freelancer proposals.  
* A simple dispute mechanism using an authorized resolver.  
* A configurable platform commission.  
* IPFS-based delivery references.  
* Freelancer profile information.

These features should be added only after the core deposit, release, and refund workflows work correctly.

## **C. Features We Should Avoid for Now**

To keep development manageable, we should not prioritize:

* A complete freelancer registration and authentication system.  
* Complex reputation and rating algorithms.  
* DAO-based dispute resolution.  
* Multi-chain support.  
* A large backend and database architecture.  
* Real cryptocurrency payments.  
* AI-based freelancer matching.  
* Advanced notifications and analytics.

These features increase development effort without being necessary to demonstrate the central idea.

### **Final Scope Decision**

**Our prototype will demonstrate three main capabilities:**

1. **Secure deposit:** The client locks funds in the smart contract before work begins.  
2. **Conditional payment:** The freelancer receives payment only when the contract's release conditions are satisfied.  
3. **Transparent resolution:** Eligible refunds and transaction outcomes are governed by explicit rules and verifiable blockchain records.

Everything else supports these three capabilities.

---

# **6\. Proposed System Architecture**

Our prototype can use a relatively simple architecture.

               USER INTERFACE  
                 React Frontend  
                      \|  
                      \|  
                MetaMask Wallet  
                      \|  
                      \|  
                 ethers.js  
                      \|  
                      \|  
           DecentraEscrow Smart Contract  
                  Solidity  
                      \|  
                      \|  
             Sepolia Test Network  
                      \|  
                      \|  
          Blockchain Transactions & Events

### **Component Responsibilities**

| Component | Responsibility |
| ----- | ----- |
| React | Provides the marketplace interface and dashboards. |
| MetaMask | Connects the user's wallet and authorizes transactions. |
| ethers.js | Connects the frontend to the wallet and smart contract. |
| Solidity | Implements escrow, authorization, payment, and refund rules. |
| Remix IDE | Supports contract development, compilation, deployment, and testing. |
| Sepolia | Provides the test blockchain for transaction demonstrations. |
| Blockchain explorer | Allows users to verify transactions independently. |

### **Do We Need a Backend?**

**Not necessarily for the initial prototype.**

The simplest version can use a React frontend, a Solidity smart contract, MetaMask, and Sepolia.

For the demonstration, job information can be handled using a lightweight frontend data layer, with escrow-related information obtained from the smart contract.

However, if we want job listings and proposals to persist across sessions and be accessible to different users, we will need appropriate off-chain storage or an on-chain job registry.

We should decide the storage mechanism before implementing job management. We should not assume that a React interface alone provides shared, persistent marketplace data.

---

# **7\. Implementation Plan: Step by Step**

The implementation should proceed in the following order.

## **Phase 1: Finalize Requirements and Contract Design**

**Objective:** Decide exactly how the escrow will behave before coding it.

Tasks:

* Define buyer and freelancer roles.  
* Define escrow states.  
* Specify who can call each contract function.  
* Decide how payment release works.  
* Define refund eligibility.  
* Define deadline behavior.  
* Decide whether disputes are part of the initial implementation.

**Deliverable:** A finalized smart-contract workflow and function specification.

## **Phase 2: Implement the Solidity Smart Contract**

**Objective:** Build the core functionality first.

Implement functions for:

* Creating or initializing an escrow.  
* Funding the escrow.  
* Submitting work.  
* Approving work.  
* Releasing payment.  
* Processing eligible refunds.  
* Raising and resolving disputes, if included.

Maintain appropriate escrow states and emit events for important operations.

Test the contract in Remix before connecting it to the frontend.

**Deliverable:** A working contract with tested payment and authorization logic.

## **Phase 3: Deploy and Verify on Sepolia**

**Objective:** Demonstrate that the contract works on a real blockchain test network.

Tasks:

1. Connect MetaMask to Sepolia.  
2. Obtain Sepolia test ETH.  
3. Compile the Solidity contract in Remix.  
4. Deploy using MetaMask's injected provider.  
5. Record the deployed contract address.  
6. Save the contract ABI.  
7. Test deposits, releases, and refunds.  
8. Verify transaction hashes using a compatible blockchain explorer.

**Deliverable:** A deployed and tested escrow contract.

## **Phase 4: Develop the Frontend**

**Objective:** Build the interface around the working contract.

Create:

* Landing page.  
* Job listing page.  
* Job creation form.  
* Escrow details page.  
* Buyer dashboard.  
* Freelancer dashboard.  
* Transaction history.

The interface should make the escrow status easy to understand.

**Deliverable:** A usable React interface.

## **Phase 5: Integrate Frontend with the Smart Contract**

**Objective:** Make the interface perform real blockchain operations.

Tasks:

* Connect MetaMask using ethers.js.  
* Load the deployed contract using its address and ABI.  
* Read escrow details.  
* Submit deposit transactions.  
* Record work submissions.  
* Trigger authorized payment releases.  
* Trigger eligible refunds.  
* Display pending, successful, and failed transaction states.

**Deliverable:** An end-to-end working DApp.

## **Phase 6: Test the Complete Workflow**

**Objective:** Validate the system from both functional and security perspectives.

Test the following:

| Test | Expected result |
| ----- | ----- |
| Buyer deposits ETH | Funds are held in the contract. |
| Freelancer submits work | Escrow status updates correctly. |
| Buyer approves work | Payment is released according to contract rules. |
| Unauthorized user attempts release | Transaction reverts. |
| User attempts duplicate release | Transaction reverts. |
| Eligible refund is requested | Refund is processed correctly. |
| Ineligible refund is requested | Transaction reverts. |
| Transaction completes | Correct status and transaction hash are displayed. |

Also test invalid state transitions, failed transfers, and deadline conditions.

**Deliverable:** A tested prototype with demonstrable success and failure scenarios.

---

# **8\. Division of Work Among Four Team Members**

The work should be divided by **major responsibility**, with clear integration points. No team member should work on an isolated feature without coordinating with the others.

The following allocation is recommended.

## **Person 1: Tejas — Smart Contract Development**

**Primary responsibility:** Solidity and escrow logic.

### **Tasks**

* Design the escrow data structure.  
* Implement escrow creation and funding.  
* Implement work submission and payment release.  
* Implement refund conditions.  
* Implement access control.  
* Add escrow states and events.  
* Test contract functions in Remix.  
* Fix contract-level errors.

### **Deliverables**

1. Solidity contract source code.  
2. Contract function documentation.  
3. Test cases and results.  
4. Final deployed contract address and ABI, coordinated with the integration owner.

### **Completion Criteria**

The contract must correctly enforce the agreed payment rules and reject unauthorized or invalid operations.

---

## **Person 2: Harshit — Blockchain Deployment and Integration**

**Primary responsibility:** MetaMask, Remix deployment, Sepolia, and frontend-to-contract integration.

### **Tasks**

* Set up the MetaMask and Sepolia development environment.  
* Coordinate contract deployment with Tejas.  
* Maintain the contract address and ABI used by the frontend.  
* Integrate ethers.js with the deployed contract.  
* Implement wallet connection and network checks.  
* Connect frontend actions to contract functions.  
* Display transaction status and hashes.  
* Test end-to-end blockchain interactions.

### **Deliverables**

1. Working Sepolia deployment.  
2. Wallet integration.  
3. Contract interaction layer.  
4. Transaction feedback and explorer links.

### **Completion Criteria**

Users must be able to interact with the deployed contract from the application without relying on manual Remix interactions for the main workflow.

**Important:** Harshit should coordinate with Tejas before the ABI or contract interface is finalized. Integration cannot be completed reliably if the contract functions keep changing without notice.

---

## **Person 3: Nupur — Frontend and User Experience**

**Primary responsibility:** React interface and user workflows.

### **Tasks**

* Design the landing page.  
* Build the marketplace and job cards.  
* Create the job creation interface.  
* Build buyer and freelancer dashboards.  
* Develop the escrow details page.  
* Design the work submission and approval interface.  
* Display escrow statuses clearly.  
* Ensure the application is responsive and usable.

### **Deliverables**

1. React frontend.  
2. Marketplace and dashboard components.  
3. Job creation and delivery forms.  
4. Escrow status interface.  
5. Consistent UI styling.

### **Completion Criteria**

Users should be able to understand the transaction lifecycle and navigate through the application without confusion.

**Important:** Nupur should build the frontend using the contract interface agreed upon by Tejas and Harshit, so the UI does not need major restructuring during integration.

---

## **Person 4: Neeraja — Product Workflow, Testing, and Documentation**

**Primary responsibility:** Requirements, user-flow consistency, testing coordination, and project documentation.

### **Tasks**

* Finalize the project scope and functional requirements.  
* Document the complete buyer-to-freelancer workflow.  
* Prepare the user-flow diagram and system architecture diagram.  
* Define the escrow state-transition table.  
* Prepare test cases for valid and invalid operations.  
* Verify the integrated workflow with the team.  
* Maintain the implementation checklist.  
* Prepare the PRD, project report, screenshots, and demonstration script.

### **Deliverables**

1. Final PRD and scope document.  
2. User-flow and architecture diagrams.  
3. Escrow state-transition specification.  
4. Testing checklist and results.  
5. Project report and demonstration plan.

### **Completion Criteria**

The documented workflow must match the actual implementation, and the team must be able to demonstrate the complete transaction with supporting test evidence.

**Important:** Neeraja should participate in contract-design discussions from the beginning. Testing and documentation must be based on the actual implementation rather than assumptions about what the contract does.

---

## **9\. Team Responsibility Matrix**

| Activity | Tejas | Harshit | Nupur | Neeraja |
| ----- | ----- | ----- | ----- | ----- |
| Finalize escrow logic | Lead | Review | Consult | Coordinate |
| Develop Solidity contract | Lead | Support deployment | — | Define acceptance tests |
| Deploy to Sepolia | Support | Lead | — | Verify evidence |
| Wallet integration | Support | Lead | Coordinate UI | Test workflow |
| React frontend | Contract interface support | Integration support | Lead | Review user flow |
| Job and escrow interface | Contract data support | Integration support | Lead | Validate requirements |
| Test case design | Support | Support | UI testing | Lead |
| End-to-end testing | Lead on contract tests | Lead on integration tests | Lead on UI tests | Coordinate |
| Documentation and report | Provide contract details | Provide deployment details | Provide UI details | Lead |
| Final demonstration | Explain contract | Demonstrate transactions | Demonstrate interface | Explain problem, approach, and results |

This division gives everyone a clear area of ownership while allowing collaboration during integration.

---

# **10\. Methodology: How We Will Build the Prototype**

Our methodology will be **contract-first, incremental, and test-driven**.

Instead of building the entire interface first and trying to connect everything at the end, we will develop the critical blockchain functionality first and integrate it in stages.

## **Step 1: Agree on One Common Workflow**

Before coding, all four members should agree on the same transaction lifecycle.

For the initial version:

**Create Escrow → Fund Escrow → Submit Work → Approve Work → Release Payment**

A separate refund path should be defined alongside this workflow.

Everyone must use the same status names, roles, function names, and assumptions.

## **Step 2: Define the Contract Interface**

Tejas and Harshit should agree on the contract's public functions and events before major frontend development begins.

For example, the interface may include:

* `createEscrow()`  
* `fundEscrow()`  
* `submitWork()`  
* `releasePayment()`  
* `refund()`

These are proposed function names, not a claim that the functions already exist in the current contract.

The final signatures must match the actual implementation.

## **Step 3: Build and Test the Contract Independently**

Tejas should implement the core escrow functionality in Remix.

Before proceeding, verify:

* The correct buyer can fund an escrow.  
* The freelancer can submit work.  
* The buyer can approve work.  
* The freelancer receives the correct payment.  
* Unauthorized actions are rejected.  
* Duplicate payments are prevented.

Refund conditions must also be tested.

**Gate 1:** Do not begin full blockchain integration until the core contract functions behave correctly in isolated tests.

## **Step 4: Deploy a Stable Contract Version**

Once the contract passes the initial tests, deploy it to Sepolia.

Harshit should record:

* Contract address.  
* ABI.  
* Network details.  
* Transaction hashes for the deployment and test transactions.

The team should agree on when a contract interface change requires a new deployment or frontend update.

## **Step 5: Develop the Frontend in Parallel**

While Tejas tests the contract, Nupur can build the UI using mock data.

The interface should initially demonstrate:

* Available jobs.  
* Escrow cards.  
* Payment status.  
* Delivery submission.  
* Approval and refund actions.

This allows UI development to continue without waiting for every contract feature.

The mock data must later be replaced or supplemented by the agreed storage mechanism and real contract data.

## **Step 6: Connect the Frontend to Sepolia**

Harshit should integrate the deployed contract into the React application.

The team should verify one operation at a time:

1. Wallet connection.  
2. Reading escrow information.  
3. Funding an escrow.  
4. Submitting work.  
5. Releasing payment.  
6. Processing an eligible refund.

Each operation should be verified on-chain before proceeding to the next.

## **Step 7: Run Joint Testing**

All four members should test the application together.

Use at least two wallet accounts to represent the buyer and freelancer. A third account can be used to test unauthorized operations.

Check that:

* The buyer's funds are actually held by the contract.  
* The freelancer cannot withdraw funds before authorization.  
* Payment reaches the intended recipient.  
* An unauthorized account cannot release or refund funds.  
* The interface displays the actual contract status.  
* Every completed transaction can be independently verified.

## **Step 8: Prepare the Demonstration**

The final prototype demonstration should follow one complete scenario.

**Example:**

A client posts a website-development job with a budget of 0.05 test ETH. The client funds the escrow, the freelancer submits the completed work, and the client approves it. The smart contract releases the payment according to its configured rules. The team then displays the transaction hash and verifies the transfer on the Sepolia blockchain explorer.

Finally, demonstrate at least one failed unauthorized action or an eligible refund.

This shows both normal functionality and the enforcement of contract rules.

---

# **12\. Definition of a Successful Prototype**

The prototype will be considered successful when the team can demonstrate all of the following:

* A client and freelancer can be represented by separate wallet addresses.  
* The client deposits test ETH into the escrow contract.  
* The contract records the correct amount and escrow status.  
* The freelancer can submit a delivery reference.  
* The authorized client can approve the delivery.  
* The contract transfers payment correctly.  
* Unauthorized payment release is rejected.  
* An eligible refund can be processed without allowing a second conflicting transfer.  
* The frontend reflects the actual contract state.  
* Transactions can be verified on Sepolia.

A polished interface alone is not sufficient. The core payment workflow must execute through the deployed smart contract.

Similarly, a working contract without an understandable user interface would not fully demonstrate the intended marketplace experience.

**The final goal is a small but functional end-to-end DApp, not a large collection of partially implemented features.**

---

## **13\. Final Recommendation**

Keep DecentraEscrow focused on **secure deposits, conditional payment release, and transparent refunds**.

Tejas should own the contract logic, Harshit should own deployment and blockchain integration, Nupur should own the interface, and Neeraja should own the requirements, testing coordination, and documentation.

All four members should work against one agreed contract interface and one shared user workflow.

The most important milestone is getting a real Sepolia transaction to complete successfully from the application: the client deposits funds, the freelancer submits work, and the contract releases the payment according to the defined rules.

Once that works reliably, the team can add a basic refund mechanism and improve the interface.

That approach gives you a prototype that is technically demonstrable, clearly connected to the problem statement, and realistic to complete within a limited development period.

