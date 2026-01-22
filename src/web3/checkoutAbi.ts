export const checkoutAbi = [
  {
    type: "function",
    name: "payPremium",
    stateMutability: "nonpayable",
    inputs: [
      { name: "purchaseOrderId", type: "bytes32" },
      { name: "amount", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "event",
    name: "PremiumPaid",
    inputs: [
      { indexed: true, name: "payer", type: "address" },
      { indexed: true, name: "purchaseOrderId", type: "bytes32" },
      { indexed: false, name: "amount", type: "uint256" }
    ]
  }
] as const;

export const usdcAbi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  }
] as const;
