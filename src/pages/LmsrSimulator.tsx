import React, { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, CartesianGrid } from "recharts";
import { TrendingUp, FlaskConical, Zap, Share2, Link as LinkIcon, X } from "lucide-react";

/**
 * LMSR (binary) helpers
 * Cost: C(qY,qN) = b * ln(exp(qY/b) + exp(qN/b))
 * YES price: p = exp(qY/b) / (exp(qY/b)+exp(qN/b))
 */
function lmsrCost(b: number, qY: number, qN: number) {
  const ebY = Math.exp(qY / b);
  const ebN = Math.exp(qN / b);
  return b * Math.log(ebY + ebN);
}

function lmsrYesPrice(b: number, qY: number, qN: number) {
  const ebY = Math.exp(qY / b);
  const ebN = Math.exp(qN / b);
  return ebY / (ebY + ebN);
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

// Convert target probability to a symmetric (qY,qN) pair with qY - qN = b*ln(p/(1-p))
function quantitiesForProb(b: number, p: number) {
  const pp = clamp(p, 0.001, 0.999);
  const qDiff = b * Math.log(pp / (1 - pp));
  return { qY: qDiff / 2, qN: -qDiff / 2 };
}

function usd(n: number) {
  return `$${n.toFixed(2)}`;
}

function pct(n: number) {
  // 用 2 位小数，避免 b 大 / 下单小 时看起来“完全不动”
  return `${(n * 100).toFixed(2)}%`;
}

export default function LMSRLandingPage() {
  // UI parameters
  const [b, setB] = useState(20);
  const [p0, setP0] = useState(0.5);
  const [amount, setAmount] = useState(5);
  const [simOpen, setSimOpen] = useState(false);

  // Market state (qY,qN) is derived from p0 initially, but after trades it becomes independent.
  const [qY, setQY] = useState(() => quantitiesForProb(20, 0.5).qY);
  const [qN, setQN] = useState(() => quantitiesForProb(20, 0.5).qN);

  // When b or p0 changes, reset market (keeps demo intuitive)
  React.useEffect(() => {
    const { qY: ny, qN: nn } = quantitiesForProb(b, p0);
    setQY(ny);
    setQN(nn);
  }, [b, p0]);

  const yesPrice = useMemo(() => lmsrYesPrice(b, qY, qN), [b, qY, qN]);
  const noPrice = 1 - yesPrice;

  const currentCost = useMemo(() => lmsrCost(b, qY, qN), [b, qY, qN]);
  const buyYesCost = useMemo(() => lmsrCost(b, qY + amount, qN) - currentCost, [b, qY, qN, amount, currentCost]);
  const buyNoCost = useMemo(() => lmsrCost(b, qY, qN + amount) - currentCost, [b, qY, qN, amount, currentCost]);

  const chartData = useMemo(() => {
    // Plot cost curve as a function of target probability (conceptual view)
    // Use symmetric quantities for each probability to visualize C(p).
    const pts: Array<{ p: number; prob: number; cost: number }> = [];
    for (let i = 1; i <= 99; i += 1) {
      const prob = i / 100;
      const { qY: ty, qN: tn } = quantitiesForProb(b, prob);
      const c = lmsrCost(b, ty, tn);
      pts.push({ p: i, prob, cost: c });
    }
    return pts;
  }, [b]);

  const currentPoint = useMemo(() => {
    const p = clamp(yesPrice, 0.01, 0.99);
    const { qY: ty, qN: tn } = quantitiesForProb(b, p);
    return { p: Math.round(p * 100), prob: p, cost: lmsrCost(b, ty, tn) };
  }, [b, yesPrice]);

  function onBuy(side: "YES" | "NO") {
    if (side === "YES") setQY((v) => v + amount);
    else setQN((v) => v + amount);
  }

  const amountPresets = [1, 5, 10, 50];

  return (
    <div className="min-h-screen bg-stripe-50">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-accent-600/15 blur-3xl" />
        <div className="absolute top-1/2 right-[-220px] h-[460px] w-[460px] -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="mx-auto h-full max-w-[1200px] min-h-0 px-6 py-4">
        <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[1fr] gap-6 lg:grid-cols-[1fr_460px]">
          {/* LEFT: content */}
          <main className="min-h-0 overflow-hidden pr-2 lg:pr-3">
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-stripe-200 bg-white/5 px-3 py-1 text-xs text-stripe-700">
                <TrendingUp className="h-4 w-4 text-accent-500" />
                LMSR 市场模拟器
                <span className="ml-1 rounded-full bg-accent-500/20 px-2 py-0.5 text-[11px] text-accent-600">可传播</span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                <span className="text-stripe-900">共识</span>
                <br />
                <span className="bg-gradient-to-r from-accent-500 via-accent-400 to-blue-300 bg-clip-text text-transparent">源自混沌</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-stripe-500">
                预测市场把观点变成价格。拖动流动性、设置初始概率，然后买入份额，看价格如何随交易变化。
                <span className="text-stripe-700"> 它永远会给出报价。</span>
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  className="h-11 rounded-xl bg-accent-500 px-4 text-sm font-semibold text-white shadow-lg shadow-accent-500/20 hover:bg-accent-400"
                  onClick={() => setAmount(10)}
                >
                  开始模拟
                </button>
                <button
                  className="h-11 rounded-xl border border-stripe-200 bg-white/5 px-4 text-sm font-semibold text-stripe-700 hover:bg-white/10"
                  onClick={() => {
                    const params = new URLSearchParams({
                      b: String(b),
                      p0: String(p0),
                      qY: String(qY),
                      qN: String(qN),
                      amt: String(amount),
                    });
                    navigator.clipboard?.writeText(`${location.origin}${location.pathname}?${params.toString()}`);
                  }}
                  title="复制带参数的分享链接"
                >
                  <span className="inline-flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" /> 复制链接
                  </span>
                </button>
                <button
                  className="h-11 rounded-xl border border-stripe-200 bg-white/5 px-4 text-sm font-semibold text-stripe-700 hover:bg-white/10"
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `我把价格推到 ${pct(yesPrice)}（b=${b}，下单=${amount}）。来试试：${location.origin}${location.pathname}`
                    );
                  }}
                  title="复制分享文案"
                >
                  <span className="inline-flex items-center gap-2">
                    <Share2 className="h-4 w-4" /> 复制文案
                  </span>
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                <section className="rounded-2xl border border-stripe-200 bg-white p-5">
                  <div className="text-sm font-semibold text-stripe-900">一分钟懂 LMSR</div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-stripe-200 bg-stripe-50 p-4">
                      <div className="text-xs font-semibold text-stripe-700">原理</div>
                      <div className="mt-1 text-xs text-stripe-500">自动做市，连续报价，价格随交易更新。</div>
                      <div className="mt-2 rounded-xl bg-stripe-100 p-3 text-[11px] text-stripe-700">
                        <span className="text-stripe-500">Cost：</span> C = b · ln(e^(qYES/b) + e^(qNO/b))
                      </div>
                    </div>

                    <div className="rounded-2xl border border-stripe-200 bg-stripe-50 p-4">
                      <div className="text-xs font-semibold text-stripe-700">怎么用</div>
                      <ol className="mt-2 space-y-1.5 text-xs text-stripe-500">
                        <li>1）调 b 和初始概率</li>
                        <li>2）买入 YES / NO 份额</li>
                        <li>3）看价格变化和成本</li>
                        <li>4）复制链接一键复现</li>
                      </ol>
                    </div>

                    <div className="rounded-2xl border border-stripe-200 bg-stripe-50 p-4">
                      <div className="text-xs font-semibold text-stripe-700">为什么有用</div>
                      <ul className="mt-2 space-y-1.5 text-xs text-stripe-500">
                        <li>• 观点变成概率信号</li>
                        <li>• 小资金也能推动价格</li>
                        <li>• b 控制滑点与敏感度</li>
                        <li>• 结果可分享、可复现</li>
                      </ul>
                    </div>
                  </div>

                  <details className="mt-3 rounded-2xl border border-stripe-200 bg-stripe-50 p-4">
                    <summary className="cursor-pointer text-xs font-semibold text-stripe-700">展开更多说明（可选）</summary>
                    <div className="mt-2 text-xs leading-relaxed text-stripe-500">
                      LMSR（对数市场计分规则）使用凸成本函数来保证“永远有对手盘”。当你买入 YES 份额时，qYES 增加，YES 价格上升；反之亦然。
                      b 越大，价格曲线越平滑（滑点更小）；b 越小，价格更敏感（滑点更明显）。
                    </div>
                  </details>
                </section>
              </div>
            </div>
          </main>

          {/* RIGHT: narrow sticky console (desktop) */}
          <aside className="hidden lg:block lg:sticky lg:top-6 lg:self-start">
            <SimulatorPanel
              b={b}
              p0={p0}
              amount={amount}
              setAmount={setAmount}
              yesPrice={yesPrice}
              noPrice={noPrice}
              currentCost={currentCost}
              buyYesCost={buyYesCost}
              buyNoCost={buyNoCost}
              chartData={chartData}
              currentPoint={currentPoint}
              onBuy={onBuy}
              onReset={() => {
                setQY(quantitiesForProb(b, p0).qY);
                setQN(quantitiesForProb(b, p0).qN);
              }}
              qY={qY}
              qN={qN}
              setB={setB}
              setP0={setP0}
            />
          </aside>
        </div>
      </div>

      {/* Mobile: open simulator drawer */}
      <button
        className="lg:hidden fixed bottom-5 right-5 z-40 h-12 rounded-xl bg-white px-4 text-sm font-semibold text-stripe-900 shadow-xl"
        onClick={() => setSimOpen(true)}
      >
        打开模拟器
      </button>

      {simOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSimOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[92dvh] rounded-t-3xl border border-stripe-200 bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-stripe-900">模拟器</div>
              <button
                className="grid h-10 w-10 place-items-center rounded-xl border border-stripe-200 bg-stripe-50 text-stripe-700"
                onClick={() => setSimOpen(false)}
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[80dvh] overflow-y-auto overscroll-contain pr-2">
              <SimulatorPanel
                b={b}
                p0={p0}
                amount={amount}
                setAmount={setAmount}
                yesPrice={yesPrice}
                noPrice={noPrice}
                currentCost={currentCost}
                buyYesCost={buyYesCost}
                buyNoCost={buyNoCost}
                chartData={chartData}
                currentPoint={currentPoint}
                onBuy={onBuy}
                onReset={() => {
                  setQY(quantitiesForProb(b, p0).qY);
                  setQN(quantitiesForProb(b, p0).qN);
                }}
                qY={qY}
                qN={qN}
                setB={setB}
                setP0={setP0}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SimulatorPanel(props: {
  b: number;
  p0: number;
  amount: number;
  setAmount: (v: number) => void;
  yesPrice: number;
  noPrice: number;
  currentCost: number;
  buyYesCost: number;
  buyNoCost: number;
  chartData: Array<{ p: number; prob: number; cost: number }>;
  currentPoint: { p: number; prob: number; cost: number };
  onBuy: (side: "YES" | "NO") => void;
  onReset: () => void;
  qY: number;
  qN: number;
  setB: (v: number) => void;
  setP0: (v: number) => void;
}) {
  const amountPresets = [1, 5, 10, 50];

  return (
    <div className="rounded-2xl border border-stripe-200 bg-white p-3 shadow-xl shadow-stripe-100/40">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-500/15">
          <TrendingUp className="h-4 w-4 text-accent-600" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-stripe-900">LMSR 控制台</div>
          <div className="text-xs text-stripe-500">二元自动做市</div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {/* 参数 */}
        <div className="rounded-2xl border border-stripe-200 bg-stripe-50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-stripe-700">b（流动性）</div>
            <div className="rounded-md bg-stripe-100 px-2 py-0.5 text-[11px] text-stripe-700">{props.b.toFixed(1)}</div>
          </div>
          <input
            className="w-full accent-accent-400"
            type="range"
            min={5}
            max={200}
            step={0.5}
            value={props.b}
            onChange={(e) => props.setB(parseFloat(e.target.value))}
          />

          <div className="mt-1 flex items-center justify-between">
            <div className="text-xs font-semibold text-stripe-700">初始概率</div>
            <div className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-700">{pct(props.p0)}</div>
          </div>
          <input
            className="w-full accent-emerald-400"
            type="range"
            min={0.01}
            max={0.99}
            step={0.01}
            value={props.p0}
            onChange={(e) => props.setP0(parseFloat(e.target.value))}
          />

          <div className="flex items-center justify-between text-[11px] text-stripe-500">
            <span>小 b：更敏感</span>
            <span>大 b：更平滑</span>
          </div>
        </div>

        {/* chart */}
        <div className="rounded-2xl border border-stripe-200 bg-stripe-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs text-stripe-500">价格曲线</div>
            <div className="text-xs text-stripe-500">b={props.b.toFixed(1)}</div>
          </div>
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={props.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} stroke="#e2e8f0" />
                <XAxis
                  dataKey="p"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={{ stroke: "#cbd5e1" }}
                  width={34}
                />
                <Tooltip
                  contentStyle={{ background: "rgba(255, 255, 255, 0.95)", border: "1px solid rgba(148,163,184,0.18)", borderRadius: 12, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                  labelStyle={{ color: "#1e293b" }}
                  formatter={(v: any) => [Number(v).toFixed(2), "C"]}
                  labelFormatter={(l) => `p=${l}%`}
                />
                <Line type="monotone" dataKey="cost" strokeWidth={2.5} dot={false} stroke="#6366f1" />
                <ReferenceDot x={props.currentPoint.p} y={props.currentPoint.cost} r={5} stroke="white" strokeWidth={2} fill="rgba(99,102,241,1)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stripe-500">
            <span>当前</span>
            <span className="text-stripe-900">{pct(props.yesPrice)}</span>
          </div>
        </div>

        {/* 交易面板 */}
        <div className="rounded-2xl border border-stripe-200 bg-stripe-50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-stripe-500">当前价格</div>
              <div className="text-[11px] text-stripe-500">成本池：{props.currentCost.toFixed(2)}</div>
            </div>
            <button
              className="h-9 rounded-xl border border-stripe-200 bg-white/40 px-3 text-xs font-semibold text-stripe-700 hover:bg-white/60"
              onClick={props.onReset}
              title="重置市场状态"
            >
              重置
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white p-2">
              <div className="text-[11px] text-stripe-500">YES</div>
              <div className="text-lg font-semibold text-stripe-900">{pct(props.yesPrice)}</div>
              <div className="mt-0.5 text-[11px] text-stripe-500">Δ {(props.yesPrice * 100 - 50).toFixed(2)}%</div>
            </div>
            <div className="rounded-xl bg-white p-2 text-right">
              <div className="text-[11px] text-stripe-500">NO</div>
              <div className="text-lg font-semibold text-stripe-900">{pct(props.noPrice)}</div>
              <div className="mt-0.5 text-[11px] text-stripe-500">Δ {(props.noPrice * 100 - 50).toFixed(2)}%</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold tracking-wide text-stripe-700">下单数量</div>
            <div className="flex items-center gap-1">
              {amountPresets.map((v) => (
                <button
                  key={v}
                  className={
                    "h-7 rounded-lg px-2 text-[11px] " +
                    (props.amount === v ? "bg-accent-100 text-accent-700" : "border border-stripe-200 bg-white/5 text-stripe-700 hover:bg-white/10")
                  }
                  onClick={() => props.setAmount(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              className="h-10 w-full rounded-xl border border-stripe-200 bg-white/40 px-4 text-sm text-stripe-900 outline-none focus:border-accent-400/40"
              type="number"
              min={0.1}
              step={0.5}
              value={props.amount}
              onChange={(e) => props.setAmount(clamp(parseFloat(e.target.value || "0"), 0.1, 1000))}
            />
            <div className="text-xs text-stripe-500">份额</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              className="h-10 rounded-2xl bg-emerald-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/15 hover:bg-emerald-400"
              onClick={() => props.onBuy("YES")}
            >
              买入 YES
              <div className="mt-0.5 text-[11px] font-medium text-emerald-100/90">{usd(props.buyYesCost)}</div>
            </button>
            <button
              className="h-10 rounded-2xl bg-rose-500 px-4 text-sm font-semibold text-white shadow-lg shadow-rose-500/15 hover:bg-rose-400"
              onClick={() => props.onBuy("NO")}
            >
              买入 NO
              <div className="mt-0.5 text-[11px] font-medium text-rose-100/90">{usd(props.buyNoCost)}</div>
            </button>
          </div>

          <div className="text-[11px] text-stripe-500">b 越大越平滑；b 越小越敏感（滑点更明显）。</div>
        </div>
      </div>
    </div>
  );
}
