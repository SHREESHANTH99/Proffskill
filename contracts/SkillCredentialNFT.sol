// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

interface IIssuerRegistry {
    function isApprovedIssuer(address _issuer) external view returns (bool);
}

/**
 * @title SkillCredentialNFT
 * @notice Soulbound NFT representing verified skill credentials
 * @dev ERC-721 with transfer restrictions (Soulbound)
 */
contract SkillCredentialNFT is ERC721, ERC721URIStorage {
    // State Variables
    uint256 private _tokenIdCounter;
    IIssuerRegistry public issuerRegistry;
    bool public isSoulbound;

    // Credential Structure
    struct Skill {
        string skillName;
        address issuer;
        uint256 issuedAt;
        string metadataHash; // IPFS hash
    }

    // Mappings
    mapping(uint256 => Skill) public credentials;
    mapping(address => uint256[]) public holderCredentials;

    // Events
    event CredentialMinted(
        uint256 indexed tokenId,
        address indexed holder,
        address indexed issuer,
        string skillName,
        uint256 timestamp
    );
    event SoulboundStatusChanged(bool isSoulbound);

    // EIP-5192: Minimal Soulbound NFT standard
    event Locked(uint256 indexed tokenId);

    // Modifiers
    modifier onlyApprovedIssuer() {
        require(
            issuerRegistry.isApprovedIssuer(msg.sender),
            "SkillCredentialNFT: caller is not an approved issuer"
        );
        _;
    }

    /**
     * @notice Constructor
     * @param _issuerRegistry Address of the IssuerRegistry contract
     * @param _isSoulbound Set to true to disable transfers (Soulbound)
     */
    constructor(
        address _issuerRegistry,
        bool _isSoulbound
    ) ERC721("ProofSkill Credential", "PSKILL") {
        require(
            _issuerRegistry != address(0),
            "SkillCredentialNFT: invalid registry"
        );
        issuerRegistry = IIssuerRegistry(_issuerRegistry);
        isSoulbound = _isSoulbound;
    }

    /**
     * @notice Mint a new skill credential (Issuer only)
     * @param _holder Address of the credential holder
     * @param _skillName Name of the skill
     * @param _metadataURI IPFS URI for metadata
     * @param _metadataHash IPFS hash for verification
     */
    function mintCredential(
        address _holder,
        string memory _skillName,
        string memory _metadataURI,
        string memory _metadataHash
    ) external onlyApprovedIssuer returns (uint256) {
        require(
            _holder != address(0),
            "SkillCredentialNFT: invalid holder address"
        );
        require(
            bytes(_skillName).length > 0,
            "SkillCredentialNFT: skill name required"
        );

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        // Mint NFT
        _safeMint(_holder, tokenId);
        _setTokenURI(tokenId, _metadataURI);

        // Store credential data
        credentials[tokenId] = Skill({
            skillName: _skillName,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            metadataHash: _metadataHash
        });

        // Track holder's credentials
        holderCredentials[_holder].push(tokenId);

        emit CredentialMinted(
            tokenId,
            _holder,
            msg.sender,
            _skillName,
            block.timestamp
        );

        // EIP-5192: Emit Locked event if soulbound
        if (isSoulbound) {
            emit Locked(tokenId);
        }

        return tokenId;
    }

    /**
     * @notice EIP-5192: Check if token is locked (Soulbound)
     * @param tokenId Token ID to check
     * @return bool True if token is locked (non-transferable)
     */
    function locked(uint256 tokenId) external view returns (bool) {
        require(
            _ownerOf(tokenId) != address(0),
            "SkillCredentialNFT: token does not exist"
        );
        return isSoulbound;
    }

    /**
     * @notice Get all credentials owned by a wallet
     * @param _holder Address of the credential holder
     * @return uint256[] Array of token IDs
     */
    function getHolderCredentials(
        address _holder
    ) external view returns (uint256[] memory) {
        return holderCredentials[_holder];
    }

    /**
     * @notice Get credential details
     * @param _tokenId Token ID of the credential
     * @return Skill struct with credential details
     */
    function getCredential(
        uint256 _tokenId
    ) external view returns (Skill memory) {
        require(
            _ownerOf(_tokenId) != address(0),
            "SkillCredentialNFT: credential does not exist"
        );
        return credentials[_tokenId];
    }

    /**
     * @notice Verify the issuer of a credential
     * @param _tokenId Token ID of the credential
     * @return address Issuer address
     */
    function verifyCredentialIssuer(
        uint256 _tokenId
    ) external view returns (address) {
        require(
            _ownerOf(_tokenId) != address(0),
            "SkillCredentialNFT: credential does not exist"
        );
        return credentials[_tokenId].issuer;
    }

    /**
     * @notice Toggle Soulbound status (Admin function - can be restricted further)
     * @param _isSoulbound New soulbound status
     */
    function setSoulboundStatus(bool _isSoulbound) external {
        // In production, add proper access control here
        isSoulbound = _isSoulbound;
        emit SoulboundStatusChanged(_isSoulbound);
    }

    /**
     * @notice Override transfer functions to implement Soulbound behavior
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);

        // Allow minting (from == address(0))
        // Block transfers if Soulbound is enabled
        if (from != address(0) && isSoulbound) {
            revert(
                "SkillCredentialNFT: Soulbound tokens cannot be transferred"
            );
        }

        return super._update(to, tokenId, auth);
    }

    /**
     * @notice Get total number of credentials minted
     * @return uint256 Total supply
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    // Required overrides
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
