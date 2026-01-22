import { httpClient } from '../../../services/http';
import { MemeToken } from '../../../domain/meme';

interface ProjectFilters {
  status?: 'active' | 'completed' | 'pending';
  category?: string;
  sortBy?: 'createdAt' | 'raisedUsd' | 'participants' | 'marketCapValue';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface ProjectCreateData {
  name: string;
  ticker: string;
  description: string;
  image: string;
  website?: string;
  twitter?: string;
  github?: string;
  category?: string;
}

interface TicketPurchaseData {
  projectId: string;
  amountUsd: number;
}

interface ProjectDetail {
  id: string;
  name: string;
  ticker: string;
  creator: string;
  creatorAvatar: string;
  createdAt: string;
  description: string;
  image: string;
  website?: string;
  twitter?: string;
  github?: string;
  status: 'active' | 'completed' | 'pending';
  raisedUsd: number;
  participants: number;
  marketCapValue: number;
  ticketsSold: number;
  milestones: Array<{
    id: string;
    name: string;
    description: string;
    targetUsd: number;
    reached: boolean;
  }>;
}

export const acceleratorAPI = {
  // 项目相关API
  getProjects: async (filters?: ProjectFilters): Promise<MemeToken[]> => {
    return httpClient.get('/accelerator/projects', filters);
  },

  getProjectById: async (id: string): Promise<ProjectDetail> => {
    return httpClient.get(`/accelerator/projects/${id}`);
  },

  createProject: async (data: ProjectCreateData): Promise<MemeToken> => {
    return httpClient.post('/accelerator/projects', data);
  },

  updateProject: async (id: string, data: Partial<ProjectCreateData>): Promise<MemeToken> => {
    return httpClient.patch(`/accelerator/projects/${id}`, data);
  },

  deleteProject: async (id: string): Promise<void> => {
    return httpClient.delete(`/accelerator/projects/${id}`);
  },

  // 门票相关API
  purchaseTicket: async (data: TicketPurchaseData): Promise<{
    ticketId: string;
    txHash: string;
  }> => {
    return httpClient.post('/accelerator/tickets', data);
  },

  getMyTickets: async (): Promise<Array<{
    id: string;
    projectId: string;
    projectName: string;
    projectTicker: string;
    amountUsd: number;
    purchasedAt: string;
    status: 'active' | 'used' | 'refunded';
  }>> => {
    return httpClient.get('/accelerator/tickets/me');
  },

  // 抽奖相关API
  getLotteryInfo: async (): Promise<{
    currentPool: number;
    nextDrawAt: string;
    recentWinners: Array<{
      address: string;
      amountUsd: number;
      timestamp: string;
    }>;
  }> => {
    return httpClient.get('/accelerator/lottery');
  },

  // 市场相关API
  getMarkets: async (): Promise<Array<{
    id: string;
    name: string;
    ticker: string;
    price: number;
    change24h: number;
    marketCap: number;
  }>> => {
    return httpClient.get('/accelerator/markets');
  },

  // 透明度相关API
  getTransparencyReport: async (): Promise<{
    totalRaised: number;
    totalParticipants: number;
    totalProjects: number;
    distribution: Array<{
      category: string;
      amountUsd: number;
      percentage: number;
    }>;
  }> => {
    return httpClient.get('/accelerator/transparency');
  },

  // 用户相关API
  getUserEarnings: async (): Promise<{
    totalEarnings: number;
    pendingEarnings: number;
    history: Array<{
      id: string;
      amountUsd: number;
      type: 'lottery' | 'referral' | 'reward';
      timestamp: string;
    }>;
  }> => {
    return httpClient.get('/accelerator/earnings');
  },

  // 短片墙相关API
  getShorts: async (): Promise<Array<{
    id: string;
    projectId: string;
    projectName: string;
    projectTicker: string;
    url: string;
    thumbnail: string;
    title: string;
    views: number;
    likes: number;
    createdAt: string;
  }>> => {
    return httpClient.get('/accelerator/shorts');
  },
};
