// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

import {LiqPassCheckout} from "../src/LiqPassCheckout.sol";

contract MockUSDC {
  string public name = "USD Coin";
  string public symbol = "USDC";
  uint8 public decimals = 6;

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  function mint(address to, uint256 amt) external {
    balanceOf[to] += amt;
  }

  function approve(address spender, uint256 amt) external returns (bool) {
    allowance[msg.sender][spender] = amt;
    return true;
  }

  function transfer(address to, uint256 amt) external returns (bool) {
    require(balanceOf[msg.sender] >= amt, "BAL");
    balanceOf[msg.sender] -= amt;
    balanceOf[to] += amt;
    return true;
  }

  function transferFrom(address from, address to, uint256 amt) external returns (bool) {
    uint256 allowed = allowance[from][msg.sender];
    require(allowed >= amt, "ALLOW");
    require(balanceOf[from] >= amt, "BAL");
    allowance[from][msg.sender] = allowed - amt;
    balanceOf[from] -= amt;
    balanceOf[to] += amt;
    return true;
  }
}

contract LiqPassCheckoutTest is Test {
  uint256 private constant QUOTE_SIGNER_PK = 0xA11CE;

  MockUSDC private usdc;
  LiqPassCheckout private checkout;

  address private treasury;
  address private quoteSigner;
  address private buyer;

  function setUp() public {
    treasury = makeAddr("treasury");
    quoteSigner = vm.addr(QUOTE_SIGNER_PK);
    buyer = makeAddr("buyer");

    usdc = new MockUSDC();
    checkout = new LiqPassCheckout(address(usdc), treasury, quoteSigner);
  }

  function domainSeparator(address verifyingContract) internal view returns (bytes32) {
    bytes32 typeHash = keccak256(
      "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );
    return keccak256(
      abi.encode(typeHash, keccak256(bytes("LiqPassQuote")), keccak256(bytes("1")), block.chainid, verifyingContract)
    );
  }

  function hashQuote(address verifyingContract, LiqPassCheckout.Quote memory q) internal view returns (bytes32) {
    bytes32 structHash = keccak256(
      abi.encode(
        checkout.QUOTE_TYPEHASH(),
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
    return keccak256(abi.encodePacked("\x19\x01", domainSeparator(verifyingContract), structHash));
  }

  function sign(bytes32 digest) internal pure returns (bytes memory) {
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(QUOTE_SIGNER_PK, digest);
    return abi.encodePacked(r, s, v);
  }

  function test_buyPolicy_validSignature_transfersPremium_and_setsReplayFlag() public {
    LiqPassCheckout.Quote memory q = LiqPassCheckout.Quote({
      buyer: buyer,
      instId: "BTC-USDT-SWAP",
      leverage: 50,
      principalUSDC: 500e6,
      payoutUSDC: 125e6,
      premiumUSDC: 5e6,
      expiry: uint64(block.timestamp + 300),
      orderId: keccak256("order-1")
    });

    bytes32 digest = hashQuote(address(checkout), q);
    bytes memory sig = sign(digest);

    usdc.mint(buyer, 10e6);
    vm.prank(buyer);
    usdc.approve(address(checkout), 10e6);

    uint256 treasuryBefore = usdc.balanceOf(treasury);
    vm.prank(buyer);
    checkout.buyPolicy(q, sig);

    assertTrue(checkout.usedOrderId(q.orderId));
    assertEq(usdc.balanceOf(treasury), treasuryBefore + q.premiumUSDC);
  }

  function test_buyPolicy_buyerMismatch_reverts() public {
    LiqPassCheckout.Quote memory q = LiqPassCheckout.Quote({
      buyer: buyer,
      instId: "BTC-USDT-SWAP",
      leverage: 50,
      principalUSDC: 500e6,
      payoutUSDC: 125e6,
      premiumUSDC: 5e6,
      expiry: uint64(block.timestamp + 300),
      orderId: keccak256("order-2")
    });

    bytes32 digest = hashQuote(address(checkout), q);
    bytes memory sig = sign(digest);

    vm.expectRevert(bytes("BUYER_MISMATCH"));
    checkout.buyPolicy(q, sig);
  }

  function test_buyPolicy_expired_reverts() public {
    LiqPassCheckout.Quote memory q = LiqPassCheckout.Quote({
      buyer: buyer,
      instId: "BTC-USDT-SWAP",
      leverage: 50,
      principalUSDC: 500e6,
      payoutUSDC: 125e6,
      premiumUSDC: 5e6,
      expiry: uint64(block.timestamp - 1),
      orderId: keccak256("order-3")
    });

    bytes32 digest = hashQuote(address(checkout), q);
    bytes memory sig = sign(digest);

    vm.prank(buyer);
    vm.expectRevert(bytes("QUOTE_EXPIRED"));
    checkout.buyPolicy(q, sig);
  }

  function test_buyPolicy_replay_reverts() public {
    LiqPassCheckout.Quote memory q = LiqPassCheckout.Quote({
      buyer: buyer,
      instId: "BTC-USDT-SWAP",
      leverage: 50,
      principalUSDC: 500e6,
      payoutUSDC: 125e6,
      premiumUSDC: 5e6,
      expiry: uint64(block.timestamp + 300),
      orderId: keccak256("order-4")
    });

    bytes32 digest = hashQuote(address(checkout), q);
    bytes memory sig = sign(digest);

    usdc.mint(buyer, 10e6);
    vm.prank(buyer);
    usdc.approve(address(checkout), 10e6);

    vm.prank(buyer);
    checkout.buyPolicy(q, sig);

    vm.prank(buyer);
    vm.expectRevert(bytes("ORDER_USED"));
    checkout.buyPolicy(q, sig);
  }

  function test_buyPolicy_badSignature_reverts() public {
    uint256 badPk = 0xB0B;
    address badSigner = vm.addr(badPk);
    checkout.setQuoteSigner(badSigner);

    LiqPassCheckout.Quote memory q = LiqPassCheckout.Quote({
      buyer: buyer,
      instId: "BTC-USDT-SWAP",
      leverage: 50,
      principalUSDC: 500e6,
      payoutUSDC: 125e6,
      premiumUSDC: 5e6,
      expiry: uint64(block.timestamp + 300),
      orderId: keccak256("order-5")
    });

    bytes32 digest = hashQuote(address(checkout), q);
    bytes memory sig = sign(digest);

    vm.prank(buyer);
    vm.expectRevert(bytes("BAD_SIG"));
    checkout.buyPolicy(q, sig);
  }
}
