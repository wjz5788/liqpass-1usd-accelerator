import { useEffect } from 'react'

import {
  ProjectFilters,
  useProjectsStore,
} from '../domains/accelerator/store/projectsStore'

export function useProjects(
  initialFilters?: Partial<ProjectFilters>,
  useMock = true
) {
  const {
    projects,
    filteredProjects,
    isLoading,
    error,
    totalCount,
    filters,
    selectedProject,
    fetchProjects,
    fetchProjectById,
    setFilter,
    setFilters,
    applyFilters,
    resetFilters,
    searchProjects,
  } = useProjectsStore()

  // 初始加载项目
  useEffect(() => {
    fetchProjects(useMock)
  }, [fetchProjects, useMock])

  // 应用初始筛选条件
  useEffect(() => {
    if (initialFilters) {
      setFilters({ ...filters, ...initialFilters })
      applyFilters()
    }
  }, [initialFilters, setFilters, filters, applyFilters])

  // 更新单个筛选条件
  const updateFilter = <K extends keyof ProjectFilters>(
    key: K,
    value: ProjectFilters[K]
  ) => {
    setFilter(key, value)
    applyFilters()
  }

  // 更新多个筛选条件
  const updateFilters = (newFilters: Partial<ProjectFilters>) => {
    setFilters({ ...filters, ...newFilters })
    applyFilters()
  }

  // 搜索项目
  const handleSearch = (query: string) => {
    searchProjects(query)
  }

  // 重置筛选条件
  const handleResetFilters = () => {
    resetFilters()
  }

  // 获取单个项目
  const getProjectById = async (id: string, useMockId = useMock) => {
    return fetchProjectById(id, useMockId)
  }

  return {
    projects,
    filteredProjects,
    isLoading,
    error,
    totalCount,
    filters,
    selectedProject,
    fetchProjects,
    getProjectById,
    updateFilter,
    updateFilters,
    handleSearch,
    handleResetFilters,
  }
}
