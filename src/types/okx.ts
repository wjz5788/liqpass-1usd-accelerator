export type OkxPosition = {
  instId: string;      // BTC-USDT-SWAP
  mgnMode: "isolated" | "cross";
  posSide: "long" | "short" | "net";
  ccy?: string;
  lever: number;
  pos: string;
  avgPx?: string;
  markPx?: string;
  liqPx?: string;
  uplRatio?: string;
};
