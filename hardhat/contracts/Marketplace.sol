// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is Ownable, ReentrancyGuard {
  IERC20 public gwcToken;
  IERC721 public nftContract;

  struct Listing {
    address seller;
    uint256 price;
    bool isActive;
  }

  // tokenId => Listing
  mapping(uint256 => Listing) public listings;

  // Platform fee percentage (2%)
  uint256 public platformFee = 200;
  uint256 public constant BASIS_POINTS = 10000;

  event NFTListed(
    uint256 indexed tokenId,
    address indexed seller,
    uint256 price
  );
  event NFTSold(
    uint256 indexed tokenId,
    address indexed seller,
    address indexed buyer,
    uint256 price
  );
  event NFTUnlisted(uint256 indexed tokenId, address indexed seller);

  constructor(address _gwcToken, address _nftContract) Ownable() {
    gwcToken = IERC20(_gwcToken);
    nftContract = IERC721(_nftContract);
  }

  function listNFT(uint256 tokenId, uint256 price) external {
    require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
    require(price > 0, "Price must be greater than 0");
    require(
      nftContract.getApproved(tokenId) == address(this),
      "Marketplace not approved"
    );

    listings[tokenId] = Listing({
      seller: msg.sender,
      price: price,
      isActive: true
    });

    emit NFTListed(tokenId, msg.sender, price);
  }

  function buyNFT(uint256 tokenId) external nonReentrant {
    Listing memory listing = listings[tokenId];
    require(listing.isActive, "Listing not active");
    require(msg.sender != listing.seller, "Cannot buy your own NFT");

    uint256 price = listing.price;
    uint256 platformFeeAmount = (price * platformFee) / BASIS_POINTS;
    uint256 sellerAmount = price - platformFeeAmount;

    // Transfer GWC tokens from buyer to seller and platform
    require(
      gwcToken.transferFrom(msg.sender, listing.seller, sellerAmount),
      "Token transfer to seller failed"
    );
    require(
      gwcToken.transferFrom(msg.sender, owner(), platformFeeAmount),
      "Token transfer to platform failed"
    );

    // Transfer NFT to buyer
    nftContract.transferFrom(listing.seller, msg.sender, tokenId);

    // Update listing
    listings[tokenId].isActive = false;

    emit NFTSold(tokenId, listing.seller, msg.sender, price);
  }

  function unlistNFT(uint256 tokenId) external {
    require(listings[tokenId].seller == msg.sender, "Not the seller");
    require(listings[tokenId].isActive, "Listing not active");

    listings[tokenId].isActive = false;
    emit NFTUnlisted(tokenId, msg.sender);
  }

  function updatePlatformFee(uint256 newFee) external onlyOwner {
    require(newFee <= 1000, "Fee too high"); // Max 10%
    platformFee = newFee;
  }
}
