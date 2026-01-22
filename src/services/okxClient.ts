import crypto from "crypto";
import axios from "axios";

function okxSign(ts: string, method: string, path: string, body: string, secret: string) {
  const prehash = ts + method + path + body;
  return crypto.createHmac("sha256", secret).update(prehash).digest("base64");
}

export async function okxGetPositions(opts: {
  apiKey: string; secret: string; passphrase: string;
  instId?: string;
}) {
  const method = "GET";
  const path = opts.instId
    ? `/api/v5/account/positions?instId=${encodeURIComponent(opts.instId)}`
    : `/api/v5/account/positions`;

  const ts = new Date().toISOString();
  const sign = okxSign(ts, method, path, "", opts.secret);

  const res = await axios.get(`https://www.okx.com${path}`, {
    headers: {
      "OK-ACCESS-KEY": opts.apiKey,
      "OK-ACCESS-SIGN": sign,
      "OK-ACCESS-TIMESTAMP": ts,
      "OK-ACCESS-PASSPHRASE": opts.passphrase,
    },
    timeout: 8000,
  });

  if (res.data?.code !== "0") throw new Error(`OKX_ERROR:${res.data?.msg ?? "UNKNOWN"}`);
  return res.data.data as any[];
}
