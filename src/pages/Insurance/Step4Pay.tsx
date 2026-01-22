import React, { useEffect, useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, toHex } from "viem";
import { checkoutAbi, usdcAbi } from "../../web3/checkoutAbi";

type Props = { bindId: string; checkoutAddress: `0x${string}`; usdcAddress: `0x${string}`; onPaid: () => void; };

export default function Step4Pay({ bindId, checkoutAddress, usdcAddress, onPaid }: Props) {
  const { address } = useAccount();
  const [order, setOrder] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const approveWrite = useWriteContract();
  const payWrite = useWriteContract();

  const approveWait = useWaitForTransactionReceipt({ hash: approveWrite.data });
  const payWait = useWaitForTransactionReceipt({ hash: payWrite.data });

  useEffect(() => {
    (async () => {
      setErr(null);
      const res = await fetch("/api/insurance/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bindId }),
      });
      if (!res.ok) { setErr(await res.text()); return; }
      const data = await res.json();
      setOrder(data);
    })();
  }, [bindId]);

  async function doApprove() {
    setErr(null);
    const amt = BigInt(order.premiumAmount); // 已是6位最小单位
    await approveWrite.writeContractAsync({
      address: usdcAddress,
      abi: usdcAbi,
      functionName: "approve",
      args: [checkoutAddress, amt],
    });
  }

  async function doPay() {
    setErr(null);
    const amt = BigInt(order.premiumAmount);

    // purchaseOrderId 建议后端直接返回 bytes32；这里给你一个最简单可跑：把字符串转bytes32（32字节）
    // 更稳：后端就存 bytes32，并返回 "0x..." 形式
    const po = order.purchaseOrderId as `0x${string}`;

    await payWrite.writeContractAsync({
      address: checkoutAddress,
      abi: checkoutAbi,
      functionName: "payPremium",
      args: [po, amt],
    });
  }

  // 支付成功后：回填后端（记录 txHash 用于对账/幂等）
  useEffect(() => {
    (async () => {
      if (!payWait.isSuccess || !payWrite.data) return;
      await fetch("/api/insurance/submit-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseOrderId: order.purchaseOrderId,
          payTxHash: payWrite.data,
          payer: address,
        }),
      });
      onPaid();
    })();
  }, [payWait.isSuccess]);

  if (!order) return <div className="p-4">生成订单中…</div>;

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="text-xl font-semibold">Step 4：支付保费（USDC）</div>
      <div className="text-sm text-gray-700">
        订单：{order.purchaseOrderId}<br/>
        保费：{order.premiumUsd} USDC<br/>
        生效：购买后 +{order.coverageDelaySec}s
      </div>

      {err && <div className="text-sm text-red-600">{err}</div>}

      <div className="flex gap-2">
        <button className="px-4 py-2 rounded bg-black text-white" onClick={doApprove} disabled={approveWrite.isPending}>
          1) Approve USDC
        </button>
        <button className="px-4 py-2 rounded bg-black text-white" onClick={doPay} disabled={payWrite.isPending || !approveWait.isSuccess}>
          2) 支付保费
        </button>
      </div>

      <div className="text-xs text-gray-600">
        Approve：{approveWait.isSuccess ? "✅" : approveWrite.isPending ? "处理中…" : "-"}<br/>
        Pay：{payWait.isSuccess ? "✅" : payWrite.isPending ? "处理中…" : "-"}
      </div>
    </div>
  );
}
