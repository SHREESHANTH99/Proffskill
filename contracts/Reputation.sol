// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISkillMarketplace {
    struct Job {
        address provider;
        address client;
        uint256 price;
        uint8 status;
        uint40 createdAt;
        uint40 completedAt;
    }

    function jobs(uint256) external view returns (Job memory);
}

/**
 * @title Reputation
 * @notice On-chain reputation system for service providers
 * @dev Tracks ratings and prevents duplicate ratings per job
 */
contract Reputation {
    // State Variables
    ISkillMarketplace public marketplace;

    // Rating data
    mapping(address => uint256) public totalScore;
    mapping(address => uint256) public totalJobs;
    mapping(address => uint256) public totalJobValue; // For weighted reputation
    mapping(address => uint256) public weightedScore; // score * jobValue
    mapping(uint256 => bool) public jobRated; // Prevent duplicate ratings
    mapping(uint256 => Rating) public jobRatings;

    // Rating structure
    struct Rating {
        uint256 jobId;
        address provider;
        address client;
        uint8 score; // 1-5 stars
        string review;
        uint256 timestamp;
    }

    // Provider stats
    struct ProviderStats {
        uint256 totalScore;
        uint256 totalJobs;
        uint256 averageRating; // Scaled by 100 (e.g., 450 = 4.50 stars)
        uint256 weightedAverage; // Value-weighted average (scaled by 100)
        uint256 totalJobValue; // Total ETH earned
    }

    // Events
    event ProviderRated(
        uint256 indexed jobId,
        address indexed provider,
        address indexed client,
        uint8 score,
        uint256 timestamp
    );

    // Modifiers
    modifier validRating(uint8 _score) {
        require(
            _score >= 1 && _score <= 5,
            "Reputation: rating must be between 1 and 5"
        );
        _;
    }

    /**
     * @notice Constructor
     * @param _marketplace Address of the SkillMarketplace contract
     */
    constructor(address _marketplace) {
        require(
            _marketplace != address(0),
            "Reputation: invalid marketplace address"
        );
        marketplace = ISkillMarketplace(_marketplace);
    }

    /**
     * @notice Rate a provider after job completion
     * @param _jobId Job ID to rate
     * @param _score Rating score (1-5)
     * @param _review Optional review text
     */
    function rateProvider(
        uint256 _jobId,
        uint8 _score,
        string memory _review
    ) external validRating(_score) {
        // Prevent duplicate ratings
        require(!jobRated[_jobId], "Reputation: job already rated");

        // Get job details from marketplace
        ISkillMarketplace.Job memory job = marketplace.jobs(_jobId);

        // Validate rating conditions
        // status: 0=pending, 1=accepted, 2=completed, 3=paid, 4=cancelled
        require(job.status == 3, "Reputation: job not paid");
        require(msg.sender == job.client, "Reputation: only client can rate");
        require(job.provider != address(0), "Reputation: invalid job");

        // Mark job as rated
        jobRated[_jobId] = true;

        // Update provider stats (traditional)
        totalScore[job.provider] += _score;
        totalJobs[job.provider] += 1;

        // Update weighted stats (economic value-based)
        totalJobValue[job.provider] += job.price;
        weightedScore[job.provider] += (_score * job.price);

        // Store rating details
        jobRatings[_jobId] = Rating({
            jobId: _jobId,
            provider: job.provider,
            client: job.client,
            score: _score,
            review: _review,
            timestamp: block.timestamp
        });

        emit ProviderRated(
            _jobId,
            job.provider,
            job.client,
            _score,
            block.timestamp
        );
    }

    /**
     * @notice Get provider's reputation stats
     * @param _provider Provider address
     * @return ProviderStats struct with total score, jobs, and average rating
     */
    function getProviderStats(
        address _provider
    ) external view returns (ProviderStats memory) {
        uint256 jobs = totalJobs[_provider];
        uint256 score = totalScore[_provider];
        uint256 average = jobs > 0 ? (score * 100) / jobs : 0;

        // Calculate value-weighted average
        uint256 jobValue = totalJobValue[_provider];
        uint256 weighted = jobValue > 0
            ? (weightedScore[_provider] * 100) / jobValue
            : 0;

        return
            ProviderStats({
                totalScore: score,
                totalJobs: jobs,
                averageRating: average,
                weightedAverage: weighted,
                totalJobValue: jobValue
            });
    }

    /**
     * @notice Get average rating for a provider
     * @param _provider Provider address
     * @return uint256 Average rating scaled by 100 (e.g., 450 = 4.50 stars)
     */
    function getAverageRating(
        address _provider
    ) external view returns (uint256) {
        if (totalJobs[_provider] == 0) {
            return 0;
        }
        return (totalScore[_provider] * 100) / totalJobs[_provider];
    }

    /**
     * @notice Check if a job has been rated
     * @param _jobId Job ID
     * @return bool True if job has been rated
     */
    function isJobRated(uint256 _jobId) external view returns (bool) {
        return jobRated[_jobId];
    }

    /**
     * @notice Get rating details for a specific job
     * @param _jobId Job ID
     * @return Rating struct
     */
    function getJobRating(
        uint256 _jobId
    ) external view returns (Rating memory) {
        require(jobRated[_jobId], "Reputation: job not rated");
        return jobRatings[_jobId];
    }

    /**
     * @notice Get total number of completed jobs for a provider
     * @param _provider Provider address
     * @return uint256 Total jobs completed
     */
    function getTotalJobs(address _provider) external view returns (uint256) {
        return totalJobs[_provider];
    }

    /**
     * @notice Get total reputation score for a provider
     * @param _provider Provider address
     * @return uint256 Total cumulative score
     */
    function getTotalScore(address _provider) external view returns (uint256) {
        return totalScore[_provider];
    }
}
