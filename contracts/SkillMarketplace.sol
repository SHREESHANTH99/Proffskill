// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SkillMarketplace
 * @notice Trustless escrow system for hiring verified talent
 * @dev Manages job listings, payments, and escrow
 */
contract SkillMarketplace is ReentrancyGuard {
    // State Variables
    uint256 public jobIdCounter;
    uint256 public listingIdCounter;
    uint256 public constant PLATFORM_FEE_PERCENT = 2; // 2% platform fee (immutable)
    uint256 public constant DISPUTE_WINDOW = 7 days; // Time for client to act after completion
    address public immutable platformWallet;

    // Job Structure (simplified to avoid stack too deep)
    struct Job {
        address provider;
        address client;
        uint256 price;
        uint8 status; // 0=pending, 1=accepted, 2=completed, 3=paid, 4=cancelled
        uint40 createdAt;
        uint40 completedAt; // Timestamp when marked complete (for dispute window)
    }

    // Service Listing Structure (simplified)
    struct ServiceListing {
        address provider;
        uint256 price;
        bool isActive;
    }

    // Mappings
    mapping(uint256 => Job) public jobs;
    mapping(uint256 => ServiceListing) public serviceListings;
    mapping(uint256 => string) public jobDescriptions;
    mapping(uint256 => string) public listingTitles;
    mapping(uint256 => string) public listingDescriptions;
    mapping(address => uint256[]) public providerJobs;
    mapping(address => uint256[]) public clientJobs;
    mapping(address => uint256[]) public providerListings;

    // Events
    event ServiceListed(
        uint256 indexed listingId,
        address indexed provider,
        uint256 price,
        uint256 timestamp
    );
    event ServiceDelisted(uint256 indexed listingId, uint256 timestamp);
    event JobCreated(
        uint256 indexed jobId,
        address indexed provider,
        address indexed client,
        uint256 price,
        uint256 timestamp
    );
    event JobAccepted(uint256 indexed jobId, uint256 timestamp);
    event JobCompleted(uint256 indexed jobId, uint256 timestamp);
    event PaymentReleased(
        uint256 indexed jobId,
        address indexed provider,
        uint256 amount,
        uint256 timestamp
    );
    event JobCancelled(uint256 indexed jobId, uint256 timestamp);
    event AutoClaimExecuted(
        uint256 indexed jobId,
        address indexed provider,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyProvider(uint256 _jobId) {
        require(jobs[_jobId].provider == msg.sender, "Not provider");
        _;
    }

    modifier onlyClient(uint256 _jobId) {
        require(jobs[_jobId].client == msg.sender, "Not client");
        _;
    }

    modifier jobExists(uint256 _jobId) {
        require(_jobId < jobIdCounter, "Job does not exist");
        _;
    }

    constructor(address _platformWallet) {
        require(_platformWallet != address(0), "Invalid platform wallet");
        platformWallet = _platformWallet;
    }

    function createServiceListing(
        string memory _title,
        string memory _description,
        uint256 _price
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title required");
        require(_price > 0, "Price must be > 0");

        uint256 listingId = listingIdCounter++;

        serviceListings[listingId] = ServiceListing({
            provider: msg.sender,
            price: _price,
            isActive: true
        });

        listingTitles[listingId] = _title;
        listingDescriptions[listingId] = _description;
        providerListings[msg.sender].push(listingId);

        emit ServiceListed(listingId, msg.sender, _price, block.timestamp);

        return listingId;
    }

    function delistService(uint256 _listingId) external {
        require(
            serviceListings[_listingId].provider == msg.sender,
            "Not owner"
        );
        require(serviceListings[_listingId].isActive, "Already delisted");

        serviceListings[_listingId].isActive = false;
        emit ServiceDelisted(_listingId, block.timestamp);
    }

    function hireService(
        address _provider,
        string memory _description
    ) external payable returns (uint256) {
        require(_provider != address(0), "Invalid provider");
        require(_provider != msg.sender, "Cannot hire yourself");
        require(msg.value > 0, "Payment required");

        uint256 jobId = jobIdCounter++;

        jobs[jobId] = Job({
            provider: _provider,
            client: msg.sender,
            price: msg.value,
            status: 0,
            createdAt: uint40(block.timestamp),
            completedAt: 0
        });

        jobDescriptions[jobId] = _description;
        providerJobs[_provider].push(jobId);
        clientJobs[msg.sender].push(jobId);

        emit JobCreated(
            jobId,
            _provider,
            msg.sender,
            msg.value,
            block.timestamp
        );

        return jobId;
    }

    function acceptJob(
        uint256 _jobId
    ) external jobExists(_jobId) onlyProvider(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == 0, "Job not pending");

        job.status = 1;
        emit JobAccepted(_jobId, block.timestamp);
    }

    function markJobComplete(
        uint256 _jobId
    ) external jobExists(_jobId) onlyProvider(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == 1, "Job not accepted");

        job.status = 2;
        job.completedAt = uint40(block.timestamp);
        emit JobCompleted(_jobId, block.timestamp);
    }

    function releasePayment(
        uint256 _jobId
    ) external jobExists(_jobId) onlyClient(_jobId) nonReentrant {
        Job storage job = jobs[_jobId];
        require(job.status == 2, "Job not completed");

        job.status = 3;

        uint256 platformFee = (job.price * PLATFORM_FEE_PERCENT) / 100;
        uint256 providerAmount = job.price - platformFee;

        (bool successProvider, ) = job.provider.call{value: providerAmount}("");
        require(successProvider, "Provider payment failed");

        (bool successPlatform, ) = platformWallet.call{value: platformFee}("");
        require(successPlatform, "Platform fee failed");

        emit PaymentReleased(
            _jobId,
            job.provider,
            providerAmount,
            block.timestamp
        );
    }

    function cancelJob(
        uint256 _jobId
    ) external jobExists(_jobId) onlyClient(_jobId) nonReentrant {
        Job storage job = jobs[_jobId];
        require(job.status == 0, "Cannot cancel accepted job");

        job.status = 4;

        (bool success, ) = job.client.call{value: job.price}("");
        require(success, "Refund failed");

        emit JobCancelled(_jobId, block.timestamp);
    }
    
    /**
     * @notice Provider can auto-claim payment if client doesn't act within dispute window
     * @param _jobId Job ID to claim payment for
     */
    function autoClaimPayment(
        uint256 _jobId
    ) external jobExists(_jobId) onlyProvider(_jobId) nonReentrant {
        Job storage job = jobs[_jobId];
        require(job.status == 2, "Job not completed");
        require(job.completedAt > 0, "Invalid completion timestamp");
        require(
            block.timestamp >= job.completedAt + DISPUTE_WINDOW,
            "Dispute window not expired"
        );

        job.status = 3;

        uint256 platformFee = (job.price * PLATFORM_FEE_PERCENT) / 100;
        uint256 providerAmount = job.price - platformFee;

        (bool successProvider, ) = job.provider.call{value: providerAmount}("");
        require(successProvider, "Provider payment failed");

        (bool successPlatform, ) = platformWallet.call{value: platformFee}("");
        require(successPlatform, "Platform fee failed");

        emit AutoClaimExecuted(_jobId, job.provider, block.timestamp);
        emit PaymentReleased(
            _jobId,
            job.provider,
            providerAmount,
            block.timestamp
        );
    }

    function getProviderJobs(
        address _provider
    ) external view returns (uint256[] memory) {
        return providerJobs[_provider];
    }

    function getClientJobs(
        address _client
    ) external view returns (uint256[] memory) {
        return clientJobs[_client];
    }

    function getProviderListings(
        address _provider
    ) external view returns (uint256[] memory) {
        return providerListings[_provider];
    }

    function getJob(
        uint256 _jobId
    ) external view jobExists(_jobId) returns (Job memory) {
        return jobs[_jobId];
    }

    function getJobDescription(
        uint256 _jobId
    ) external view returns (string memory) {
        return jobDescriptions[_jobId];
    }

    function getListing(
        uint256 _listingId
    )
        external
        view
        returns (
            string memory title,
            string memory description,
            ServiceListing memory listing
        )
    {
        return (
            listingTitles[_listingId],
            listingDescriptions[_listingId],
            serviceListings[_listingId]
        );
    }
    
    /**
     * @notice Get comprehensive user profile data (gas-optimized batch read)
     * @param _user Address to get profile for
     * @return providerJobIds Jobs as provider
     * @return clientJobIds Jobs as client
     * @return listingIds Service listings
     */
    function getUserProfile(
        address _user
    )
        external
        view
        returns (
            uint256[] memory providerJobIds,
            uint256[] memory clientJobIds,
            uint256[] memory listingIds
        )
    {
        return (
            providerJobs[_user],
            clientJobs[_user],
            providerListings[_user]
        );
    }
    
    /**
     * @notice Get multiple jobs in one call (gas-optimized)
     * @param _jobIds Array of job IDs to fetch
     * @return jobs Array of Job structs
     */
    function getMultipleJobs(
        uint256[] calldata _jobIds
    ) external view returns (Job[] memory) {
        Job[] memory jobsArray = new Job[](_jobIds.length);
        for (uint256 i = 0; i < _jobIds.length; i++) {
            if (_jobIds[i] < jobIdCounter) {
                jobsArray[i] = jobs[_jobIds[i]];
            }
        }
        return jobsArray;
    }
}
