import { create } from 'zustand'

import { MemeToken } from '../../../domain/meme'
import { acceleratorAPI } from '../services/accelerator'
import { tokens } from '../../../services/mock/memeData'

export interface ProjectFilters {
  status?: 'active' | 'completed' | 'pending'
  category?: string
  sortBy?: 'createdAt' | 'raisedUsd' | 'participants' | 'marketCapValue'
  sortOrder?: 'asc' | 'desc'
  search?: string
  page?: number
  limit?: number
}

interface ProjectsStore {
  projects: MemeToken[]
  filteredProjects: MemeToken[]
  selectedProject: MemeToken | null
  filters: ProjectFilters
  isLoading: boolean
  error: string | null
  totalCount: number

  setProjects: (projects: MemeToken[]) => void
  setFilteredProjects: (projects: MemeToken[]) => void
  setSelectedProject: (project: MemeToken | null) => void
  setFilters: (filters: ProjectFilters) => void
  setFilter: <K extends keyof ProjectFilters>(key: K, value: ProjectFilters[K]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setTotalCount: (count: number) => void

  fetchProjects: (useMock?: boolean) => Promise<void>
  fetchProjectById: (id: string, useMock?: boolean) => Promise<MemeToken | null>
  applyFilters: () => void
  resetFilters: () => void
  searchProjects: (query: string) => void
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  filteredProjects: [],
  selectedProject: null,
  filters: {
    status: 'active',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12,
  },
  isLoading: false,
  error: null,
  totalCount: 0,
  
  setProjects: projects => set({ projects }),

  setFilteredProjects: filteredProjects => set({ filteredProjects }),

  setSelectedProject: selectedProject => set({ selectedProject }),

  setFilters: filters => set({ filters }),

  setFilter: (key, value) =>
    set(state => ({
      filters: { ...state.filters, [key]: value },
    })),

  setLoading: isLoading => set({ isLoading }),

  setError: error => set({ error }),

  setTotalCount: totalCount => set({ totalCount }),
  
  fetchProjects: async (useMock = true) => {
    const {
      filters,
      setProjects,
      setFilteredProjects,
      setLoading,
      setError,
      setTotalCount,
      applyFilters,
    } = get()
    setLoading(true)
    setError(null)

    try {
      let projects: MemeToken[]

      if (useMock) {
        // 使用Mock数据
        projects = tokens
      } else {
        // 调用真实API
        projects = await acceleratorAPI.getProjects(filters)
      }

      setProjects(projects)
      setTotalCount(projects.length)
      setFilteredProjects(projects)
      applyFilters()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  },
  
  fetchProjectById: async (id: string, useMock = true) => {
    const { setSelectedProject, setLoading, setError } = get()
    setLoading(true)
    setError(null)

    try {
      let project: MemeToken | null

      if (useMock) {
        // 从Mock数据中查找
        project = tokens.find(p => p.id === id) || null
      } else {
        // 调用真实API
        const projectDetail = await acceleratorAPI.getProjectById(id)
        project = projectDetail as unknown as MemeToken
      }

      setSelectedProject(project)
      return project
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch project')
      return null
    } finally {
      setLoading(false)
    }
  },
  
  applyFilters: () => {
    const { projects, filters, setFilteredProjects } = get()

    let filtered = [...projects]

    // 应用状态筛选
    if (filters.status) {
      // 这里可以根据实际情况调整筛选逻辑
      // 目前Mock数据中没有status字段，所以暂时不做筛选
    }

    // 应用排序
    if (filters.sortBy && filters.sortOrder) {
      filtered.sort((a, b) => {
        const aValue = a[filters.sortBy as keyof MemeToken] as number | string
        const bValue = b[filters.sortBy as keyof MemeToken] as number | string

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filters.sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        return 0
      })
    }

    // 应用搜索
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        project =>
        project.name.toLowerCase().includes(searchLower) ||
        project.ticker.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower)
      )
    }

    // 应用分页
    if (filters.page && filters.limit) {
      const startIndex = (filters.page - 1) * filters.limit
      const endIndex = startIndex + filters.limit
      filtered = filtered.slice(startIndex, endIndex)
    }

    setFilteredProjects(filtered)
  },
  
  resetFilters: () => {
    set({
      filters: {
        status: 'active',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        page: 1,
        limit: 12,
        search: undefined,
        category: undefined,
      },
    })
    get().applyFilters()
  },

  searchProjects: (query) => {
    set(state => ({
      filters: { ...state.filters, search: query, page: 1 },
    }))
    get().applyFilters()
  },
}))
