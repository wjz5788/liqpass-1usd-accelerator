import React, { useMemo } from "react";
import { wadToPct } from "../services/utils/format";

type Props = {
  pNowWad: string;   // 1e18
  pAfterWad: string; // 1e18
  targetPct: number; // 1..99
  bLabel?: string;   // optional display like "b=60"
};

function wadToUnit(wadStr: string) {
  const n = Number(wadStr);
  if (!Number.isFinite(n)) return 0.5;
  return Math.max(0, Math.min(1, n / 1e18));
}

export default function ProbCurveMini({ pNowWad, pAfterWad, targetPct, bLabel }: Props) {
  const pNow = wadToUnit(pNowWad);
  const pAfter = wadToUnit(pAfterWad);

  // SVG params
  const W = 800;
  const H = 240;
  const padL = 60;
  const padR = 60;
  const padT = 20;
  const padB = 40;

  const xPct = (pct: number) => padL + ((pct - 1) / 98) * (W - padL - padR);
  const yProb = (p: number) => padT + (1 - p) * (H - padT - padB);

  const xNow = xPct(Math.round(pNow * 100));
  const yNow = yProb(pNow);
  const xAfter = xPct(targetPct);
  const yAfter = yProb(pAfter);

  const pathD = useMemo(() => {
    // 你之前示意那种“中间略下凹”的曲线骨架
    const y0 = yProb(pNow);
    const midX = (padL + (W - padR)) / 2;
    const midY = Math.min(H - padB, y0 + 40);
    return `M ${padL} ${y0} Q ${midX} ${midY} ${W - padR} ${y0}`;
  }, [pNow]);

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-3">
        <div className="font-bold text-stripe-900">价格/概率曲线</div>
        <div className="text-sm font-medium text-stripe-500">{bLabel ?? ""}</div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[280px]">
        {/* axes */}
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#E5E7EB" strokeWidth="1" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#E5E7EB" strokeWidth="1" />

        {/* y ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const y = yProb(p);
          const label = Math.round(p * 100);
          return (
            <g key={p}>
              <line x1={padL - 2} y1={y} x2={padL} y2={y} stroke="#E5E7EB" strokeWidth="1" />
              <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#6B7280">{label}</text>
            </g>
          );
        })}

        {/* x ticks: 1..99 sparse */}
        {[1, 25, 50, 75, 99].map((v) => {
          const x = xPct(v);
          return (
            <g key={v}>
              <line x1={x} y1={H - padB} x2={x} y2={H - padB + 2} stroke="#E5E7EB" strokeWidth="1" />
              <text x={x} y={H - 12} textAnchor="middle" fontSize="10" fill="#6B7280">{v}</text>
            </g>
          );
        })}

        {/* base curve */}
        <path d={pathD} fill="none" stroke="#CBD5E1" strokeWidth="2" />

        {/* target vertical line */}
        <line x1={xAfter} y1={padT} x2={xAfter} y2={H - padB} stroke="#D1FAE5" strokeWidth="2" />

        {/* current dot */}
        <circle cx={xNow} cy={yNow} r={5} fill="#111827" />
        <text x={xNow + 8} y={yNow - 8} fontSize="10" fill="#111827">now</text>

        {/* after dot */}
        <circle cx={xAfter} cy={yAfter} r={6} fill="#10B981" />
        <text x={xAfter + 8} y={yAfter - 8} fontSize="10" fill="#059669">target</text>
      </svg>

      <div className="flex items-center justify-between mt-2">
        <div className="text-sm text-stripe-500">
          Current: <span className="font-bold text-stripe-900">{wadToPct(pNowWad)}</span>
        </div>
        <div className="text-sm text-stripe-500">
          After: <span className="font-bold text-green-600">{wadToPct(pAfterWad)}</span>
        </div>
      </div>
    </div>
  );
}