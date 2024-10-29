// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Geotrust.sol";

contract LandRegistry is ERC721, Ownable {
    struct Land {
        string location;
        string documentHash;
        uint256 price;
        bool isForSale;
        bool isVerified;
        
    }

    // Mapping from tokenId to Land details
    mapping(uint256 => Land) public lands;

    uint256 private _currentTokenId;
    uint256 public platformFeePercentage; // Platform fee percentage

    event LandRegistered(uint256 indexed tokenId, string location, uint256 price);
    event LandPriceUpdated(uint256 indexed tokenId, uint256 newPrice);
    event LandSaleStatusUpdated(uint256 indexed tokenId, bool isForSale);
    event LandVerified(uint256 indexed tokenId); // Event for land verification

    constructor(uint256 _platformFeePercentage) ERC721("LandOwnership", "LAND") Ownable(msg.sender) {
        _currentTokenId = 0;
        platformFeePercentage = _platformFeePercentage; 
    }

    // Register a new Land token
    function registerLand(string memory location, string memory documentHash, uint256 price) external onlyOwner {
        uint256 newTokenId = _getNextTokenId();
        lands[newTokenId] = Land(location, documentHash, price, false, false);
        _safeMint(msg.sender, newTokenId);
        _incrementTokenId();

        emit LandRegistered(newTokenId, location, price);
    }

    // Update land price
    function updateLandPrice(uint256 tokenId, uint256 newPrice) external {
        require(
            msg.sender == ownerOf(tokenId) || getApproved(tokenId) == msg.sender || isApprovedForAll(ownerOf(tokenId), msg.sender),
            "Caller is not owner nor approved"
        );
        lands[tokenId].price = newPrice;
        emit LandPriceUpdated(tokenId, newPrice);
    }

    // Set land for sale status
    function setLandForSale(uint256 tokenId, bool isForSale) external {
        require(
            msg.sender == ownerOf(tokenId) || getApproved(tokenId) == msg.sender || isApprovedForAll(ownerOf(tokenId), msg.sender),
            "Caller is not owner nor approved"
        );
        lands[tokenId].isForSale = isForSale;
        emit LandSaleStatusUpdated(tokenId, isForSale);
    }

    // Purchase land
    function buyLand(uint256 tokenId) external payable {
        require(lands[tokenId].isForSale, "Not for sale");
        require(lands[tokenId].isVerified, "Land not verified");
        require(msg.value == lands[tokenId].price, "Incorrect payment amount");
        require(msg.sender != ownerOf(tokenId), "Cannot buy own land");

        address seller = ownerOf(tokenId);
        uint256 platformFee = (lands[tokenId].price * platformFeePercentage) / 100;
        uint256 sellerAmount = lands[tokenId].price - platformFee;

        lands[tokenId].isForSale = false;
        
        _safeTransfer(seller, msg.sender, tokenId, "");

        (bool success, ) = payable(seller).call{value: sellerAmount}("");
        require(success, "Transfer to seller failed");
    }

    

    // Verify land
    function verifyLand(uint256 tokenId) external onlyOwner {
        require(lands[tokenId].isVerified == false, "Land already verified");
        lands[tokenId].isVerified = true;
        emit LandVerified(tokenId);
    }

    // Fetch land details
    function getLandDetails(uint256 tokenId) external view returns (string memory, string memory, uint256, bool) {
        require(bytes(lands[tokenId].location).length > 0, "Token does not exist");
        Land memory land = lands[tokenId];
        return (land.location, land.documentHash, land.price, land.isForSale);
    }

    // Internal function to get the next token ID
    function _getNextTokenId() private view returns (uint256) {
        return _currentTokenId + 1;
    }

    // Internal function to increment the token ID
    function _incrementTokenId() internal {
        _currentTokenId++;
    }
}
