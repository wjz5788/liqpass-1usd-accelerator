import React, { useEffect, useState } from "react";
import type { OkxPosition } from "../../types/okx";

type Props = {
  apiAccountId: string;              // Step1 保存API后返回的id
  onBound: (bind: { bindId: string }) => void;
};

export default function Step3BindPosition({ apiAccountId, onBound }: Props) {
  const [instIdFilter, setInstIdFilter] = useState("");
  const [positions, setPositions] = useState<OkxPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sku, setSku] = useState<"LIQPASS_8H" | "LIQPASS_24H" | "DD_30D"> ("LIQPASS_24H");

  async function loadPositions() {
    setLoading(true); setErr(null);
    try {
      const qs = new URLSearchParams({ apiAccountId });
      if (instIdFilter.trim()) qs.set("instId", instIdFilter.trim());
      const res = await fetch(`/api/okx/positions?${qs.toString()}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPositions(data.positions as OkxPosition[]);
    } catch (e: any) {
      setErr(e?.message ?? "LOAD_POSITIONS_FAILED");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPositions(); }, []);

  async function bindPosition(p: OkxPosition) {
    setLoading(true); setErr(null);
    try {
      const res = await fetch("/api/insurance/bind-position", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiAccountId,
          instId: p.instId,
          mgnMode: p.mgnMode,
          posSide: p.posSide === "net" ? "net" : p.posSide,
          sku,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      onBound({ bindId: data.bindId });
    } catch (e: any) {
      setErr(e?.message ?? "BIND_FAILED");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border bg-white">
        <div className="font-semibold">Step 3：选择要绑定的合约仓位（instId + mgnMode + posSide）</div>
        <div className="text-sm text-gray-600 mt-1">只读拉取仓位，不下单不平仓。</div>
      </div>

      <div className="p-4 rounded-lg border bg-white space-y-3">
        <div className="flex gap-2">
          <input
            className="border rounded px-3 py-2 flex-1"
            placeholder="可选：固定交易对，如 BTC-USDT-SWAP"
            value={instIdFilter}
            onChange={(e) => setInstIdFilter(e.target.value)}
          />
          <button className="px-4 py-2 rounded bg-black text-white" onClick={loadPositions} disabled={loading}>
            刷新
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600">选择SKU：</span>
          <select className="border rounded px-2 py-2" value={sku} onChange={(e) => setSku(e.target.value as any)}>
            <option value="LIQPASS_8H">8h 时段保</option>
            <option value="LIQPASS_24H">24h 当日爆仓保</option>
            <option value="DD_30D">30天回撤保</option>
          </select>
        </div>

        {err && <div className="text-sm text-red-600">{err}</div>}
        {loading && <div className="text-sm text-gray-600">加载中…</div>}

        <div className="space-y-3">
          {positions.map((p, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div className="font-semibold">{p.instId}</div>
                <div className="text-sm">
                  <span className="px-2 py-1 rounded border mr-2">{p.mgnMode}</span>
                  <span className="px-2 py-1 rounded border">{p.posSide}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-700">
                <div>杠杆：{p.lever}x</div>
                <div>持仓：{p.pos}</div>
                <div>均价：{p.avgPx ?? "-"}</div>
                <div>标记：{p.markPx ?? "-"}</div>
                <div>强平：{p.liqPx ?? "-"}</div>
                <div>浮动：{p.uplRatio ?? "-"}</div>
              </div>

              <div className="mt-3">
                <button
                  className="px-4 py-2 rounded bg-black text-white"
                  onClick={() => bindPosition(p)}
                  disabled={loading}
                >
                  选择投保这个仓位
                </button>
              </div>
            </div>
          ))}
          {(!loading && positions.length === 0) && (
            <div className="text-sm text-gray-600">未读取到仓位：要么没有仓位，要么 Read 权限/账户不一致。</div>
          )}
        </div>
      </div>
    </div>
  );
}
