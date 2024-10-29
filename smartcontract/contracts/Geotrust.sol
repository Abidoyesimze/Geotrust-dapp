// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract BlockchainLandRegistry is ERC721, AccessControl {
    address public landInspector;

    struct Land {
        string location;
        string documentHash;
        uint256 price;
        bool isVerified;
        address owner; 
        string description;
        string imageHash;
        uint8 numberOfRooms;
    }

    mapping(uint256 => Land) public lands;
    mapping(uint256 => address[]) public ownershipHistory;
    mapping(address => uint256[]) public userProperties;

    uint256 private _nextTokenId;

    uint256 public platformFeePercentage = 1;

    event PropertyListed(uint256 indexed tokenId, uint256 price, string location);
    event LandTransferred(address indexed seller, address indexed buyer, uint256 indexed tokenId, uint256 price);
    event LandVerified(uint256 indexed tokenId, address inspector);
    event PlatformFeeUpdated(uint256 newFeePercentage);

    constructor() ERC721("LandRegistry", "LAND") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        landInspector = msg.sender;
        _nextTokenId = 1;
    }

    modifier onlyLandInspector() {
        require(msg.sender == landInspector, "Caller is not the land inspector");
        _;
    }

    modifier validTokenId(uint256 tokenId) {
        require(tokenId > 0 && tokenId < _nextTokenId, "Invalid token ID");
        _;
    }

    function registerLand(
        string calldata location,
        string calldata description,
        string calldata documentHash,
        uint256 price,
        string calldata imageHash,
        uint8 numberOfRooms
    ) external {
        require(bytes(location).length > 0, "Empty location");
        require(bytes(documentHash).length > 0, "Empty document hash");

        uint256 newTokenId = _nextTokenId++;
        lands[newTokenId] = Land({
            location: location,
            documentHash: documentHash,
            price: price,
            description: description,
            imageHash: imageHash,
            isVerified: false,
            owner: msg.sender,
            numberOfRooms: numberOfRooms
        });

        _safeMint(msg.sender, newTokenId);
        ownershipHistory[newTokenId].push(msg.sender);
        userProperties[msg.sender].push(newTokenId);
    }

    function markForSale(uint256 tokenId, uint256 price) 
        external 
        validTokenId(tokenId) 
    {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(lands[tokenId].isVerified, "Land not verified");
        require(price > 0, "Price must be greater than 0");

        lands[tokenId].price = price;
        emit PropertyListed(tokenId, price, lands[tokenId].location);
    }

    function buyLand(uint256 tokenId) 
        external 
        payable  
        validTokenId(tokenId) 
    {
        require(lands[tokenId].isVerified, "Land not verified");
        require(msg.value == lands[tokenId].price, "Incorrect payment amount");
        require(msg.sender != ownerOf(tokenId), "Cannot buy own land");

        address seller = ownerOf(tokenId);
        uint256 sellerAmount = lands[tokenId].price - (lands[tokenId].price * platformFeePercentage) / 100;

        lands[tokenId].owner = msg.sender;  
        _safeTransfer(seller, msg.sender, tokenId, "");

        (bool success, ) = payable(seller).call{value: sellerAmount}("");
        require(success, "Transfer to seller failed");

        ownershipHistory[tokenId].push(msg.sender);
        emit LandTransferred(seller, msg.sender, tokenId, lands[tokenId].price);
    }

    function verifyLand(uint256 tokenId) 
        external
        onlyLandInspector
        validTokenId(tokenId) 
    {
        require(!lands[tokenId].isVerified, "Land already verified");
        lands[tokenId].isVerified = true;
        emit LandVerified(tokenId, msg.sender);
    }

    function setPlatformFee(uint256 newFeePercentage) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        platformFeePercentage = newFeePercentage;
        emit PlatformFeeUpdated(newFeePercentage);
    }

    // New function to retrieve details of a registered land by token ID
    function getRegisteredLand(uint256 tokenId)
        external
        view
        validTokenId(tokenId)
        returns (
            string memory location,
            string memory description,
            string memory documentHash,
            uint256 price,
            string memory imageHash,
            uint8 numberOfRooms,
            bool isVerified,
            address owner
        )
    {
        Land memory land = lands[tokenId];
        return (
            land.location,
            land.description,
            land.documentHash,
            land.price,
            land.imageHash,
            land.numberOfRooms,
            land.isVerified,
            land.owner
        );
    }

    // Optional function to retrieve all registered land properties
    function getAllRegisteredLands() 
        external 
        view 
        returns (Land[] memory) 
    {
        Land[] memory allLands = new Land[](_nextTokenId - 1);
        for (uint256 i = 1; i < _nextTokenId; i++) {
            allLands[i - 1] = lands[i];
        }
        return allLands;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    receive() external payable {
        revert("Direct payments not allowed");
    }
}
