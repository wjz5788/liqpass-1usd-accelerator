export interface EventItem {
  id: string;
  title: string;
  topic: string;
  claim: string;
  phase: 'P1' | 'P2' | 'P3';
  status: 'OPEN' | 'HOT' | 'ENDING' | 'RESOLVED' | 'FROZEN';
  priceYes: number;
  change24h: number;
  volume24h: string;
  depth: 'Thin' | 'OK' | 'Deep';
  evidenceCount: number;
  lastEvidenceTime: string;
  deadline: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  verified: boolean;
  tags: string[];
  links: {
    demo?: string;
    repo?: string;
    docs?: string;
    x?: string;
    video?: string;
  };
  stats: {
    hackathon: { label: 'Hackathon', value: 0.32, change: 3.2, active: true };
    paidUsers: { label: 'PaidUsers', value: 0.58, change: -1.1, active: true };
    shipping: { label: 'Shipping', value: 0.74, change: 0.6, active: true };
    derivCnt: { label: 'DerivCnt', value: 0.41, change: 5.0, active: true };
  };
  window: {
    nextStart: string;
    nextEnd: string;
    phase: 'P2';
    systemRole: 'Backstop';
    status: 'Open';
  };
  opportunities: {
    highestVol: { title: 'DerivCnt', change: 5.0 };
    thinBook: { title: 'PaidUsers', side: 'NO' };
    newEvidence: { title: 'Shipping', time: '2 mins ago' };
    misplay: { title: 'Index Mispricing' };
  };
  events: EventItem[];
  evidence: {
    id: string;
    type: 'URL' | 'HASH' | 'ONCHAIN';
    submitter: string;
    time: string;
    target: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    impact: 'YES' | 'NO';
    title: string;
  }[];
  index: {
    price: string;
    deviation: string;
  };
}

export const mockProjectData: ProjectData = {
  id: '1',
  name: 'LiqPass Accelerator',
  description: 'AI-driven liquidity accelerator for Web3 projects. Verify shipping, user growth, and hackathon wins.',
  verified: true,
  tags: ['DeFi', 'AI', 'Accelerator'],
  links: {
    demo: '#',
    repo: '#',
    docs: '#',
    x: '#',
  },
  stats: {
    hackathon: { label: 'Hackathon', value: 0.32, change: 3.2, active: true },
    paidUsers: { label: 'PaidUsers', value: 0.58, change: -1.1, active: true },
    shipping: { label: 'Shipping', value: 0.74, change: 0.6, active: true },
    derivCnt: { label: 'DerivCnt', value: 0.41, change: 5.0, active: true },
  },
  window: {
    nextStart: '20:00',
    nextEnd: '20:30',
    phase: 'P2',
    systemRole: 'Backstop',
    status: 'Open',
  },
  opportunities: {
    highestVol: { title: 'DerivCnt', change: 5.0 },
    thinBook: { title: 'PaidUsers', side: 'NO' },
    newEvidence: { title: 'Shipping', time: '2 mins ago' },
    misplay: { title: 'Index Mispricing' },
  },
  events: [
    {
      id: 'e1',
      title: 'Win ETHGlobal Hackathon',
      topic: 'Hackathon',
      claim: 'Project wins a major prize at ETHGlobal London',
      phase: 'P2',
      status: 'HOT',
      priceYes: 0.32,
      change24h: 12.5,
      volume24h: '$45K',
      depth: 'OK',
      evidenceCount: 3,
      lastEvidenceTime: '2h ago',
      deadline: '2d 14h',
    },
    {
      id: 'e2',
      title: 'Reach 1000 Paid Users',
      topic: 'Growth',
      claim: 'Active paid users on-chain > 1000',
      phase: 'P3',
      status: 'OPEN',
      priceYes: 0.58,
      change24h: -1.1,
      volume24h: '$120K',
      depth: 'Thin',
      evidenceCount: 12,
      lastEvidenceTime: '5m ago',
      deadline: '15d',
    },
    {
      id: 'e3',
      title: 'Ship V2 Mainnet',
      topic: 'Product',
      claim: 'Deploy V2 contracts to Mainnet by end of Q1',
      phase: 'P2',
      status: 'OPEN',
      priceYes: 0.74,
      change24h: 0.6,
      volume24h: '$89K',
      depth: 'Deep',
      evidenceCount: 8,
      lastEvidenceTime: '1d ago',
      deadline: '21d',
    },
    {
      id: 'e4',
      title: 'Derivative Integration',
      topic: 'Partnership',
      claim: 'Integrated by at least 5 derivative protocols',
      phase: 'P1',
      status: 'ENDING',
      priceYes: 0.41,
      change24h: 5.0,
      volume24h: '$12K',
      depth: 'Thin',
      evidenceCount: 1,
      lastEvidenceTime: '4d ago',
      deadline: '12h',
    },
  ],
  evidence: [
    {
      id: 'ev1',
      type: 'URL',
      submitter: '0x12...89',
      time: '10m ago',
      target: 'Shipping',
      status: 'Pending',
      impact: 'YES',
      title: 'GitHub Release Tag v2.0.0 created',
    },
    {
      id: 'ev2',
      type: 'ONCHAIN',
      submitter: 'alice.eth',
      time: '2h ago',
      target: 'PaidUsers',
      status: 'Accepted',
      impact: 'YES',
      title: 'Dune Analytics query result #12345',
    },
    {
      id: 'ev3',
      type: 'HASH',
      submitter: 'bob.eth',
      time: '5h ago',
      target: 'Hackathon',
      status: 'Rejected',
      impact: 'NO',
      title: 'Invalid winner list screenshot',
    },
  ],
  index: {
    price: '$1.42',
    deviation: '+2.1%',
  },
};
