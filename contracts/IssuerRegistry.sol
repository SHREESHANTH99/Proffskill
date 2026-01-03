// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IssuerRegistry
 * @notice Controls who is allowed to issue credentials on the ProofSkill platform
 * @dev Admin-only contract that manages trusted credential issuers
 */
contract IssuerRegistry {
    // State Variables
    address public admin;
    mapping(address => bool) public issuers;

    // Events
    event IssuerAdded(address indexed issuer, uint256 timestamp);
    event IssuerRemoved(address indexed issuer, uint256 timestamp);
    event AdminTransferred(
        address indexed previousAdmin,
        address indexed newAdmin
    );

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "IssuerRegistry: caller is not admin");
        _;
    }

    modifier validAddress(address _address) {
        require(_address != address(0), "IssuerRegistry: invalid address");
        _;
    }

    // Constructor
    constructor() {
        admin = msg.sender;
        emit AdminTransferred(address(0), msg.sender);
    }

    /**
     * @notice Add a new trusted issuer (Admin only)
     * @param _issuer Address of the issuer to add
     */
    function addIssuer(
        address _issuer
    ) external onlyAdmin validAddress(_issuer) {
        require(!issuers[_issuer], "IssuerRegistry: issuer already exists");
        require(_issuer != admin, "IssuerRegistry: admin cannot be issuer");

        issuers[_issuer] = true;
        emit IssuerAdded(_issuer, block.timestamp);
    }

    /**
     * @notice Remove an issuer (Admin only)
     * @param _issuer Address of the issuer to remove
     */
    function removeIssuer(
        address _issuer
    ) external onlyAdmin validAddress(_issuer) {
        require(issuers[_issuer], "IssuerRegistry: issuer does not exist");

        issuers[_issuer] = false;
        emit IssuerRemoved(_issuer, block.timestamp);
    }

    /**
     * @notice Verify if an address is an approved issuer
     * @param _issuer Address to verify
     * @return bool True if the address is an approved issuer
     */
    function isApprovedIssuer(address _issuer) external view returns (bool) {
        return issuers[_issuer];
    }

    /**
     * @notice Transfer admin role to a new address
     * @param _newAdmin Address of the new admin
     */
    function transferAdmin(
        address _newAdmin
    ) external onlyAdmin validAddress(_newAdmin) {
        require(_newAdmin != admin, "IssuerRegistry: already admin");

        address previousAdmin = admin;
        admin = _newAdmin;

        emit AdminTransferred(previousAdmin, _newAdmin);
    }

    /**
     * @notice Get the current admin address
     * @return address Current admin
     */
    function getAdmin() external view returns (address) {
        return admin;
    }
}
