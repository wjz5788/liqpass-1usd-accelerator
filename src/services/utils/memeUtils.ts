import { FundingTier, MemeToken } from '../../domain/meme';

export const getCreatedDays = (createdAt: string, createdDays?: number): number => {
    if (typeof createdDays === "number") return createdDays;
    const m = createdAt.match(/(\d+)\s*(d|h)\s*ago/i);
    if (!m) return 0;
    const n = parseInt(m[1], 10);
    return m[2].toLowerCase() === "d" ? n : 0;
};

export function getFundingTier(amount: number): FundingTier {
    if (amount < 1_000) return "cold";
    if (amount < 10_000) return "takeoff";
    return "hot";
}

export function getFundingPercent(amount: number): number {
    const tier = getFundingTier(amount);
    if (tier === "cold") return Math.min(1, amount / 1_000);
    if (tier === "takeoff") return Math.min(1, amount / 10_000);
    return Math.min(1, amount / 100_000);
}

// 进度条颜色
export function getFundingBarClass(tier: FundingTier): string {
    if (tier === "cold") {
        return "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]";
    }
    if (tier === "takeoff") {
        return "bg-gradient-to-r from-orange-400 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.4)]";
    }
    return "bg-gradient-to-r from-emerald-400 to-green-300 shadow-[0_0_10px_rgba(52,211,153,0.4)]";
}

export const formatUSD = (amount: number): string => {
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${Math.round(amount)}`;
};

export const getFundsAmount = (token: MemeToken): number =>
    typeof token.raisedUsd === "number" ? token.raisedUsd : token.marketCapValue;

export const getParticipants = (token: MemeToken): number =>
    typeof token.participants === "number" ? token.participants : token.replies;
