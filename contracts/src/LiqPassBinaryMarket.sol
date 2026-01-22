// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * LiqPass Binary Market v0 (Pari-mutuel)
 * - USDC collateral (Base mainnet)
 * - Buy YES/NO with caps
 * - Resolver resolves outcome
 * - Winners claim pro-rata from pot
 *
 * Safety:
 * - cap per market
 * - max per user
 * - fee bps
 * - pause
 */

interface IERC20 {
  function transfer(address to, uint256 amt) external returns (bool);
  function transferFrom(address from, address to, uint256 amt) external returns (bool);
  function balanceOf(address a) external view returns (uint256);
  function decimals() external view returns (uint8);
}

abstract contract ReentrancyGuard {
  uint256 private _locked = 1;
  modifier nonReentrant() {
    require(_locked == 1, "REENTRANT");
    _locked = 2;
    _;
    _locked = 1;
  }
}

abstract contract Ownable {
  address public owner;
  event OwnershipTransferred(address indexed prev, address indexed next);
  constructor() {
    owner = msg.sender;
    emit OwnershipTransferred(address(0), msg.sender);
  }
  modifier onlyOwner() {
    require(msg.sender == owner, "ONLY_OWNER");
    _;
  }
  function transferOwnership(address next) external onlyOwner {
    require(next != address(0), "BAD_OWNER");
    emit OwnershipTransferred(owner, next);
    owner = next;
  }
}

contract LiqPassBinaryMarket is Ownable, ReentrancyGuard {
  IERC20 public immutable usdc;

  // Config
  uint256 public feeBps; // e.g. 100 = 1%
  address public feeRecipient;
  address public resolver; // can resolve outcome
  bool public paused;

  // Market
  uint256 public cap; // max total stake (USDC 6 decimals)
  uint256 public maxPerUser; // max stake per user total (YES+NO)
  uint256 public totalYes;
  uint256 public totalNo;

  bool public resolved;
  bool public outcomeYes;

  mapping(address => uint256) public yesOf;
  mapping(address => uint256) public noOf;
  mapping(address => bool) public claimed;

  event Bought(
    address indexed user,
    bool yes,
    uint256 amountIn,
    uint256 fee,
    uint256 newTotalYes,
    uint256 newTotalNo
  );
  event Resolved(bool outcomeYes);
  event Claimed(address indexed user, uint256 payout);
  event ClaimRequested(bytes32 indexed orderId, address indexed claimant, uint256 timestamp);
  event Paused(bool v);
  event ConfigUpdated(
    uint256 feeBps,
    address feeRecipient,
    address resolver,
    uint256 cap,
    uint256 maxPerUser
  );

  modifier notPaused() {
    require(!paused, "PAUSED");
    _;
  }
  modifier onlyResolver() {
    require(msg.sender == resolver, "ONLY_RESOLVER");
    _;
  }

  constructor(
    address usdc_,
    uint256 feeBps_,
    address feeRecipient_,
    address resolver_,
    uint256 cap_,
    uint256 maxPerUser_
  ) {
    require(usdc_ != address(0), "BAD_USDC");
    require(feeRecipient_ != address(0), "BAD_FEE_RECIP");
    require(resolver_ != address(0), "BAD_RESOLVER");
    require(feeBps_ <= 500, "FEE_TOO_HIGH"); // <=5% for demo safety
    usdc = IERC20(usdc_);
    feeBps = feeBps_;
    feeRecipient = feeRecipient_;
    resolver = resolver_;
    cap = cap_;
    maxPerUser = maxPerUser_;

    emit ConfigUpdated(feeBps_, feeRecipient_, resolver_, cap_, maxPerUser_);
  }

  // ---------------------------
  // View helpers
  // ---------------------------

  function pot() public view returns (uint256) {
    return totalYes + totalNo;
  }

  // Probability in 1e6 (for UI): pYes = totalYes/(totalYes+totalNo)
  function pYes1e6() public view returns (uint256) {
    uint256 p = pot();
    if (p == 0) return 500_000;
    return (totalYes * 1_000_000) / p;
  }

  function userTotal(address u) public view returns (uint256) {
    return yesOf[u] + noOf[u];
  }

  // ---------------------------
  // Admin
  // ---------------------------

  function setPaused(bool v) external onlyOwner {
    paused = v;
    emit Paused(v);
  }

  function setConfig(
    uint256 feeBps_,
    address feeRecipient_,
    address resolver_,
    uint256 cap_,
    uint256 maxPerUser_
  ) external onlyOwner {
    require(feeRecipient_ != address(0), "BAD_FEE_RECIP");
    require(resolver_ != address(0), "BAD_RESOLVER");
    require(feeBps_ <= 500, "FEE_TOO_HIGH");
    feeBps = feeBps_;
    feeRecipient = feeRecipient_;
    resolver = resolver_;
    cap = cap_;
    maxPerUser = maxPerUser_;
    emit ConfigUpdated(feeBps_, feeRecipient_, resolver_, cap_, maxPerUser_);
  }

  // ---------------------------
  // Trading
  // ---------------------------

  function buyYes(uint256 amount) external nonReentrant notPaused {
    _buy(true, amount);
  }

  function buyNo(uint256 amount) external nonReentrant notPaused {
    _buy(false, amount);
  }

  function _buy(bool yes, uint256 amount) internal {
    require(!resolved, "RESOLVED");
    require(amount > 0, "ZERO");
    require(pot() + amount <= cap, "CAP");

    uint256 newUserTotal = userTotal(msg.sender) + amount;
    require(newUserTotal <= maxPerUser, "USER_CAP");

    // fee
    uint256 fee = (amount * feeBps) / 10_000;
    uint256 net = amount - fee;

    // pull USDC
    require(
      usdc.transferFrom(msg.sender, address(this), amount),
      "TRANSFER_FROM_FAIL"
    );
    if (fee > 0) {
      require(usdc.transfer(feeRecipient, fee), "FEE_TRANSFER_FAIL");
    }

    if (yes) {
      yesOf[msg.sender] += net;
      totalYes += net;
    } else {
      noOf[msg.sender] += net;
      totalNo += net;
    }

    emit Bought(msg.sender, yes, amount, fee, totalYes, totalNo);
  }

  // ---------------------------
  // Resolve & Claim
  // ---------------------------

  function resolve(bool outcomeYes_) external onlyResolver {
    require(!resolved, "ALREADY");
    resolved = true;
    outcomeYes = outcomeYes_;
    emit Resolved(outcomeYes_);
  }

  function claim() external nonReentrant {
    require(resolved, "NOT_RESOLVED");
    require(!claimed[msg.sender], "CLAIMED");
    claimed[msg.sender] = true;

    uint256 p = pot();
    if (p == 0) {
      emit Claimed(msg.sender, 0);
      return;
    }

    uint256 userWin = outcomeYes ? yesOf[msg.sender] : noOf[msg.sender];
    uint256 totalWin = outcomeYes ? totalYes : totalNo;

    if (userWin == 0 || totalWin == 0) {
      emit Claimed(msg.sender, 0);
      return;
    }

    // payout = userWin / totalWin * pot
    uint256 payout = (userWin * p) / totalWin;

    require(usdc.transfer(msg.sender, payout), "PAYOUT_FAIL");
    emit Claimed(msg.sender, payout);
  }

  function requestClaim(bytes32 orderId) external notPaused {
    emit ClaimRequested(orderId, msg.sender, block.timestamp);
  }

  // Emergency: owner can pull mistakenly sent tokens when paused & not resolved
  function emergencyWithdraw(address token, address to, uint256 amt)
    external
    onlyOwner
  {
    require(paused, "NOT_PAUSED");
    require(!resolved, "RESOLVED");
    require(to != address(0), "BAD_TO");
    IERC20(token).transfer(to, amt);
  }
}
