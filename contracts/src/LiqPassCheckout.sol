// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract LiqPassCheckout is Ownable, EIP712 {
  using SafeERC20 for IERC20;

  struct Quote {
    address buyer;
    string instId;
    uint16 leverage;
    uint256 principalUSDC;
    uint256 payoutUSDC;
    uint256 premiumUSDC;
    uint64 expiry;
    bytes32 orderId;
  }

  bytes32 public constant QUOTE_TYPEHASH = keccak256(
    "Quote(address buyer,string instId,uint16 leverage,uint256 principalUSDC,uint256 payoutUSDC,uint256 premiumUSDC,uint64 expiry,bytes32 orderId)"
  );

  IERC20 public immutable usdc;
  address public treasury;
  address public quoteSigner;
  mapping(bytes32 => bool) public usedOrderId;

  event PremiumPaid(
    bytes32 indexed orderId,
    address indexed buyer,
    uint256 premiumUSDC,
    uint256 payoutUSDC,
    string instId,
    uint16 leverage
  );

  constructor(address usdc_, address treasury_, address quoteSigner_) Ownable(msg.sender) EIP712("LiqPassQuote", "1") {
    require(usdc_ != address(0), "BAD_USDC");
    require(treasury_ != address(0), "BAD_TREASURY");
    require(quoteSigner_ != address(0), "BAD_SIGNER");
    usdc = IERC20(usdc_);
    treasury = treasury_;
    quoteSigner = quoteSigner_;
  }

  function setTreasury(address next) external onlyOwner {
    require(next != address(0), "BAD_TREASURY");
    treasury = next;
  }

  function setQuoteSigner(address next) external onlyOwner {
    require(next != address(0), "BAD_SIGNER");
    quoteSigner = next;
  }

  function buyPolicy(Quote calldata q, bytes calldata sig) external {
    require(msg.sender == q.buyer, "BUYER_MISMATCH");
    require(block.timestamp <= uint256(q.expiry), "QUOTE_EXPIRED");
    require(!usedOrderId[q.orderId], "ORDER_USED");

    bytes32 structHash = keccak256(
      abi.encode(
        QUOTE_TYPEHASH,
        q.buyer,
        keccak256(bytes(q.instId)),
        q.leverage,
        q.principalUSDC,
        q.payoutUSDC,
        q.premiumUSDC,
        q.expiry,
        q.orderId
      )
    );

    bytes32 digest = _hashTypedDataV4(structHash);
    address recovered = ECDSA.recover(digest, sig);
    require(recovered == quoteSigner, "BAD_SIG");

    usedOrderId[q.orderId] = true;
    usdc.safeTransferFrom(msg.sender, treasury, q.premiumUSDC);
    emit PremiumPaid(q.orderId, msg.sender, q.premiumUSDC, q.payoutUSDC, q.instId, q.leverage);
  }
}
