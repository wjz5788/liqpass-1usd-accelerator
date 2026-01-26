import { pool } from './pool.js'

// 项目相关类型
export type ProjectRow = {
  id: string
  name: string
  ticker: string
  creator: string
  creator_avatar: string | null
  description: string
  image: string
  website: string | null
  twitter: string | null
  github: string | null
  category: string | null
  status: 'active' | 'completed' | 'pending'
  raised_usd: number
  participants: number
  market_cap_value: number
  tickets_sold: number
  created_at: Date
}

// 门票相关类型
export type TicketRow = {
  id: string
  project_id: string
  user_id: string
  amount_usd: number
  purchased_at: Date
  status: 'active' | 'used' | 'refunded'
}

// 里程碑相关类型
export type MilestoneRow = {
  id: string
  project_id: string
  name: string
  description: string
  target_usd: number
  reached: boolean
}

// 项目相关操作
export async function getProjects(filters?: {
  status?: 'active' | 'completed' | 'pending'
  category?: string
  sortBy?: 'created_at' | 'raised_usd' | 'participants' | 'market_cap_value'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}): Promise<ProjectRow[]> {
  const { 
    status, 
    category, 
    sortBy = 'created_at', 
    sortOrder = 'desc', 
    page = 1, 
    limit = 10 
  } = filters || {}
  
  const offset = (page - 1) * limit
  const params: any[] = []
  let whereClause = ''
  let paramIndex =