export type ProjectStage = 'idea' | 'mvp' | 'live';

export interface Project {
  id: string;
  name: string;
  tagline: string;
  stage: ProjectStage;
  chain: string;
  supporters: number;
  raisedUsd: number;
  poolTarget: number;
  totalTickets: number;
  hasVideo: boolean;
  videoUrl?: string;
  videoType?: 'external' | 'native';
  roundGoal: string;
  milestones: string[];
  fundingPlan?: string;
  website?: string;
  github?: string;
  twitter?: string;
  telegram?: string;
  email?: string;
  createdAt: string;
}

export interface UserEarnings {
  invested: number;
  tickets: number;
  realized: number;
  estimated: number;
  pnl: number;
  multiplier: number;
  poolAvgMultiplier: number;
  topMultiplier: number;
}

export interface PoolFinances {
  currentPool: number;
  targetPool: number;
  moneyIn: {
    supportTickets: number;
    rake: number;
    sponsorship: number;
    hackathonPrize: number;
  };
  moneyOut: {
    lottery: number;
    settlement: number;
    operations: number;
  };
  reserved: number;
}

export interface ActivityLog {
  id: string;
  type: string;
  timestamp: string;
  amount?: number;
  description: string;
  recipient?: string;
  verificationUrl?: string;
}
