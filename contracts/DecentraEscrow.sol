// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DecentraEscrow {

    // --- Escrow statuses ---
    enum EscrowStatus {
        Created,
        Funded,
        WorkSubmitted,
        Approved,
        Refunded,
        Disputed,
        Resolved
    }

    // --- Escrow data ---
    struct Escrow {
        uint256 jobId;
        string title;
        address payable client;
        address payable freelancer;
        uint256 amount;          // in wei
        uint256 deadline;        // unix timestamp
        EscrowStatus status;
        string submissionUrl;
        string submissionMessage;
        string disputeReason;
        uint256 createdAt;
        uint256 fundedAt;
        uint256 submittedAt;
        uint256 completedAt;
    }

    address public arbiter;
    mapping(uint256 => Escrow) public escrows;
    uint256[] public jobIds;
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
        require(msg.sender == escrows[_jobId].client, "Only client can call this");
        _;
    }

    modifier onlyFreelancer(uint256 _jobId) {
        require(msg.sender == escrows[_jobId].freelancer, "Only freelancer can call this");
        _;
    }

    modifier onlyParties(uint256 _jobId) {
        require(
            msg.sender == escrows[_jobId].client || msg.sender == escrows[_jobId].freelancer,
            "Only client or freelancer can call this"
        );
        _;
    }

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "Only arbiter can call this");
        _;
    }

    modifier inStatus(uint256 _jobId, EscrowStatus _expected) {
        require(escrows[_jobId].status == _expected, "Invalid escrow status for this action");
        _;
    }

    constructor() {
        arbiter = msg.sender;
    }

    // --- Create escrow without immediate funding ---
    function createEscrow(
        uint256 _jobId,
        string calldata _title,
        address payable _freelancer,
        uint256 _amount,
        uint256 _deadline
    ) external {
        require(escrows[_jobId].client == address(0), "Job ID already exists");
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_freelancer != msg.sender, "Client and freelancer cannot be same");
        require(_amount > 0, "Amount must be > 0");
        require(_deadline > block.timestamp, "Deadline must be in future");

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

    // --- Create and fund escrow simultaneously ---
    function createAndFundEscrow(
        uint256 _jobId,
        string calldata _title,
        address payable _freelancer,
        uint256 _deadline
    ) external payable nonReentrant {
        require(escrows[_jobId].client == address(0), "Job ID already exists");
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_freelancer != msg.sender, "Client and freelancer cannot be same");
        require(msg.value > 0, "Funding amount must be > 0");
        require(_deadline > block.timestamp, "Deadline must be in future");

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

    // --- Fund an existing escrow ---
    function fundEscrow(uint256 _jobId)
        external
        payable
        onlyClient(_jobId)
        inStatus(_jobId, EscrowStatus.Created)
        nonReentrant
    {
        Escrow storage escrow = escrows[_jobId];
        require(msg.value == escrow.amount, "Funding value mismatch");
        escrow.status = EscrowStatus.Funded;
        escrow.fundedAt = block.timestamp;
        emit EscrowFunded(_jobId, msg.sender, msg.value, block.timestamp);
    }

    // --- Freelancer submits work ---
    function submitWork(
        uint256 _jobId,
        string calldata _submissionUrl,
        string calldata _submissionMessage
    )
        external
        onlyFreelancer(_jobId)
        inStatus(_jobId, EscrowStatus.Funded)
    {
        require(bytes(_submissionUrl).length > 0, "Submission URL required");
        Escrow storage escrow = escrows[_jobId];
        escrow.submissionUrl = _submissionUrl;
        escrow.submissionMessage = _submissionMessage;
        escrow.status = EscrowStatus.WorkSubmitted;
        escrow.submittedAt = block.timestamp;
        emit WorkSubmitted(_jobId, msg.sender, _submissionUrl, block.timestamp);
    }

    // --- Client approves work and releases payment ---
    function approveAndReleasePayment(uint256 _jobId)
        external
        onlyClient(_jobId)
        inStatus(_jobId, EscrowStatus.WorkSubmitted)
        nonReentrant
    {
        Escrow storage escrow = escrows[_jobId];
        escrow.status = EscrowStatus.Approved;
        escrow.completedAt = block.timestamp;
        uint256 amountToPay = escrow.amount;
        (bool sent, ) = escrow.freelancer.call{value: amountToPay}("");
        require(sent, "Failed to transfer payment");
        emit PaymentReleased(_jobId, escrow.freelancer, amountToPay, block.timestamp);
    }

    // --- Refund to client if deadline passed without submission ---
    function refund(uint256 _jobId)
        external
        onlyClient(_jobId)
        inStatus(_jobId, EscrowStatus.Funded)
        nonReentrant
    {
        Escrow storage escrow = escrows[_jobId];
        require(block.timestamp > escrow.deadline, "Deadline not passed yet");
        escrow.status = EscrowStatus.Refunded;
        escrow.completedAt = block.timestamp;
        uint256 refundAmount = escrow.amount;
        (bool sent, ) = escrow.client.call{value: refundAmount}("");
        require(sent, "Failed to send refund");
        emit EscrowRefunded(_jobId, escrow.client, refundAmount, block.timestamp);
    }

    // --- Raise dispute by client or freelancer ---
    function raiseDispute(uint256 _jobId, string calldata _reason)
        external
        onlyParties(_jobId)
    {
        Escrow storage escrow = escrows[_jobId];
        // Allow dispute only if Funded or WorkSubmitted
        require(
            escrow.status == EscrowStatus.Funded || escrow.status == EscrowStatus.WorkSubmitted,
            "Dispute not allowed at this stage"
        );
        escrow.status = EscrowStatus.Disputed;
        escrow.disputeReason = _reason;
        emit DisputeRaised(_jobId, msg.sender, _reason, block.timestamp);
    }

    // --- Arbiter resolves dispute and sends funds accordingly ---
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
        require(sent, "Dispute resolution transfer failed");
        emit DisputeResolved(_jobId, recipient, amount, block.timestamp);
    }

    // --- View escrow details ---
    function getEscrow(uint256 _jobId) external view returns (Escrow memory) {
        require(escrows[_jobId].client != address(0), "Escrow not found");
        return escrows[_jobId];
    }

    // --- Total escrow count ---
    function getEscrowCount() external view returns (uint256) {
        return jobIds.length;
    }
}
