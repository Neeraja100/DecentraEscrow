// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DecentraEscrow
 * @dev Decentralized freelancing escrow smart contract for the DecentraEscrow platform.
 *      Enforces secure client deposits, conditional payment releases to freelancers,
 *      and transparent refund / dispute resolution on Ethereum (Sepolia Testnet).
 *
 * Team: Tejas (Smart Contract Lead), Harshit (Deployment & Integration),
 *       Nupur (Frontend & UX), Neeraja (Workflow, Testing & Documentation)
 */
contract DecentraEscrow {

    // --- State Definitions ---
    enum EscrowStatus {
        Created,        // Escrow initialized but not yet funded
        Funded,         // Client has deposited ETH into escrow
        WorkSubmitted,  // Freelancer has submitted delivery details/URL
        Approved,       // Client approved the delivery, funds released to freelancer
        Refunded,       // Funds refunded back to client (e.g. deadline expired)
        Disputed,       // Client or freelancer raised a dispute
        Resolved        // Dispute resolved by arbiter
    }

    struct Escrow {
        uint256 jobId;
        string title;
        address payable client;
        address payable freelancer;
        uint256 amount;
        uint256 deadline;       // Unix timestamp
        EscrowStatus status;
        string submissionUrl;
        string submissionMessage;
        string disputeReason;
        uint256 createdAt;
        uint256 fundedAt;
        uint256 submittedAt;
        uint256 completedAt;
    }

    // Platform Arbiter (e.g. for dispute resolution)
    address public arbiter;

    // Mapping from jobId to Escrow details
    mapping(uint256 => Escrow) public escrows;
    uint256[] public jobIds;

    // Mutex guard against reentrancy
    bool private _locked;

    // --- Events ---
    event EscrowCreated(uint256 indexed jobId, address indexed client, address indexed freelancer, uint256 amount, uint256 deadline);
    event EscrowFunded(uint256 indexed jobId, address indexed client, uint256 amount, uint256 timestamp);
    event WorkSubmitted(uint256 indexed jobId, address indexed freelancer, string submissionUrl, uint256 timestamp);
    event PaymentReleased(uint256 indexed jobId, address indexed freelancer, uint256 amount, uint256 timestamp);
    event EscrowRefunded(uint256 indexed jobId, address indexed client, uint256 amount, uint256 timestamp);
    event DisputeRaised(uint256 indexed jobId, address indexed initiator, string reason, uint256 timestamp);
    event DisputeResolved(uint256 indexed jobId, address recipient, uint256 amount, uint256 timestamp);

    // --- Modifiers ---
    modifier nonReentrant() {
        require(!_locked, "ReentrancyGuard: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    modifier onlyClient(uint256 _jobId) {
        require(msg.sender == escrows[_jobId].client, "DecentraEscrow: Only client can call this");
        _;
    }

    modifier onlyFreelancer(uint256 _jobId) {
        require(msg.sender == escrows[_jobId].freelancer, "DecentraEscrow: Only freelancer can call this");
        _;
    }

    modifier onlyParties(uint256 _jobId) {
        require(
            msg.sender == escrows[_jobId].client || msg.sender == escrows[_jobId].freelancer,
            "DecentraEscrow: Only client or freelancer can call this"
        );
        _;
    }

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "DecentraEscrow: Only arbiter can call this");
        _;
    }

    modifier inStatus(uint256 _jobId, EscrowStatus _expected) {
        require(escrows[_jobId].status == _expected, "DecentraEscrow: Invalid escrow status");
        _;
    }

    constructor() {
        arbiter = msg.sender;
    }

    /**
     * @notice Create a new escrow agreement without immediate funding.
     */
    function createEscrow(
        uint256 _jobId,
        string calldata _title,
        address payable _freelancer,
        uint256 _amount,
        uint256 _deadline
    ) external {
        require(escrows[_jobId].client == address(0), "DecentraEscrow: Job ID already exists");
        require(_freelancer != address(0), "DecentraEscrow: Invalid freelancer address");
        require(_freelancer != msg.sender, "DecentraEscrow: Freelancer cannot be client");
        require(_amount > 0, "DecentraEscrow: Amount must be greater than zero");

        escrows[_jobId] = Escrow({
            jobId: _jobId,
            title: _title,
            client: payable(msg.sender),
            freelancer: _freelancer,
            amount: _amount,
            deadline: _deadline,
            status: EscrowStatus.Created,
            submissionUrl: "",
            submissionMessage: "",
            disputeReason: "",
            createdAt: block.timestamp,
            fundedAt: 0,
            submittedAt: 0,
            completedAt: 0
        });

        jobIds.push(_jobId);

        emit EscrowCreated(_jobId, msg.sender, _freelancer, _amount, _deadline);
    }

    /**
     * @notice Client deposits ETH into the escrow for an existing job.
     */
    function fundEscrow(uint256 _jobId)
        external
        payable
        onlyClient(_jobId)
        inStatus(_jobId, EscrowStatus.Created)
        nonReentrant
    {
        Escrow storage escrow = escrows[_jobId];
        require(msg.value == escrow.amount, "DecentraEscrow: Sent value must match agreed amount");

        escrow.status = EscrowStatus.Funded;
        escrow.fundedAt = block.timestamp;

        emit EscrowFunded(_jobId, msg.sender, msg.value, block.timestamp);
    }

    /**
     * @notice Convenience function to create and fund an escrow in a single transaction.
     */
    function createAndFundEscrow(
        uint256 _jobId,
        string calldata _title,
        address payable _freelancer,
        uint256 _deadline
    ) external payable nonReentrant {
        require(escrows[_jobId].client == address(0), "DecentraEscrow: Job ID already exists");
        require(_freelancer != address(0), "DecentraEscrow: Invalid freelancer address");
        require(_freelancer != msg.sender, "DecentraEscrow: Freelancer cannot be client");
        require(msg.value > 0, "DecentraEscrow: Amount must be greater than zero");

        escrows[_jobId] = Escrow({
            jobId: _jobId,
            title: _title,
            client: payable(msg.sender),
            freelancer: _freelancer,
            amount: msg.value,
            deadline: _deadline,
            status: EscrowStatus.Funded,
            submissionUrl: "",
            submissionMessage: "",
            disputeReason: "",
            createdAt: block.timestamp,
            fundedAt: block.timestamp,
            submittedAt: 0,
            completedAt: 0
        });

        jobIds.push(_jobId);

        emit EscrowCreated(_jobId, msg.sender, _freelancer, msg.value, _deadline);
        emit EscrowFunded(_jobId, msg.sender, msg.value, block.timestamp);
    }

    /**
     * @notice Freelancer submits deliverables (URL and message).
     */
    function submitWork(
        uint256 _jobId,
        string calldata _submissionUrl,
        string calldata _submissionMessage
    )
        external
        onlyFreelancer(_jobId)
        inStatus(_jobId, EscrowStatus.Funded)
    {
        bytes memory urlBytes = bytes(_submissionUrl);
        require(urlBytes.length > 0, "DecentraEscrow: Submission URL is required");

        Escrow storage escrow = escrows[_jobId];
        escrow.status = EscrowStatus.WorkSubmitted;
        escrow.submissionUrl = _submissionUrl;
        escrow.submissionMessage = _submissionMessage;
        escrow.submittedAt = block.timestamp;

        emit WorkSubmitted(_jobId, msg.sender, _submissionUrl, block.timestamp);
    }

    /**
     * @notice Client reviews and approves submitted work, releasing locked funds to freelancer.
     */
    function approveAndReleasePayment(uint256 _jobId)
        external
        onlyClient(_jobId)
        inStatus(_jobId, EscrowStatus.WorkSubmitted)
        nonReentrant
    {
        Escrow storage escrow = escrows[_jobId];
        escrow.status = EscrowStatus.Approved;
        escrow.completedAt = block.timestamp;

        uint256 paymentAmount = escrow.amount;
        (bool sent, ) = escrow.freelancer.call{value: paymentAmount}("");
        require(sent, "DecentraEscrow: Failed to send Ether to freelancer");

        emit PaymentReleased(_jobId, escrow.freelancer, paymentAmount, block.timestamp);
    }

    /**
     * @notice Client can request a full refund if the deadline has passed without work submission.
     */
    function refund(uint256 _jobId)
        external
        onlyClient(_jobId)
        inStatus(_jobId, EscrowStatus.Funded)
        nonReentrant
    {
        Escrow storage escrow = escrows[_jobId];
        require(
            block.timestamp > escrow.deadline || escrow.deadline == 0,
            "DecentraEscrow: Deadline has not passed yet"
        );

        escrow.status = EscrowStatus.Refunded;
        escrow.completedAt = block.timestamp;

        uint256 refundAmount = escrow.amount;
        (bool sent, ) = escrow.client.call{value: refundAmount}("");
        require(sent, "DecentraEscrow: Failed to send refund to client");

        emit EscrowRefunded(_jobId, escrow.client, refundAmount, block.timestamp);
    }

    /**
     * @notice Raise a dispute if either party disagrees with delivery or payment.
     */
    function raiseDispute(uint256 _jobId, string calldata _reason)
        external
        onlyParties(_jobId)
    {
        Escrow storage escrow = escrows[_jobId];
        require(
            escrow.status == EscrowStatus.Funded || escrow.status == EscrowStatus.WorkSubmitted,
            "DecentraEscrow: Cannot dispute at this stage"
        );

        escrow.status = EscrowStatus.Disputed;
        escrow.disputeReason = _reason;

        emit DisputeRaised(_jobId, msg.sender, _reason, block.timestamp);
    }

    /**
     * @notice Arbiter resolves dispute by sending funds to either freelancer or client.
     */
    function resolveDispute(uint256 _jobId, bool _releaseToFreelancer)
        external
        onlyArbiter
        inStatus(_jobId, EscrowStatus.Disputed)
        nonReentrant
    {
        Escrow storage escrow = escrows[_jobId];
        escrow.status = EscrowStatus.Resolved;
        escrow.completedAt = block.timestamp;

        address payable recipient = _releaseToFreelancer ? escrow.freelancer : escrow.client;
        uint256 amount = escrow.amount;

        (bool sent, ) = recipient.call{value: amount}("");
        require(sent, "DecentraEscrow: Dispute resolution transfer failed");

        emit DisputeResolved(_jobId, recipient, amount, block.timestamp);
    }

    /**
     * @notice Read complete escrow details for a job.
     */
    function getEscrow(uint256 _jobId) external view returns (Escrow memory) {
        require(escrows[_jobId].client != address(0), "DecentraEscrow: Escrow not found");
        return escrows[_jobId];
    }

    /**
     * @notice Returns total number of registered escrows.
     */
    function getEscrowCount() external view returns (uint256) {
        return jobIds.length;
    }
}
