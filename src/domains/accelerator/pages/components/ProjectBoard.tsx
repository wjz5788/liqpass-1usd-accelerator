import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Project } from '../types'

const stageLabel: Record<Project['stage'], string> = {
  idea: 'Idea',
  mvp: 'MVP',
  live: '已上线',
}

export interface ProjectBoardProps {
  newProjects: Project[]      // 新提交
  heatingProjects: Project[]  // 升温中
  endingProjects: Project[]   // 即将结束
  rowsVisible?: number        // 每列显示多少行，默认 5
  rotateIntervalMs?: number   // 轮动间隔，默认 5000ms
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({
  newProjects,
  heatingProjects,
  endingProjects,
  rowsVisible = 5,
  rotateIntervalMs = 5000,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <RotatingColumn
        title="新提交 / New"
        projects={newProjects}
        rowsVisible={rowsVisible}
        rotateIntervalMs={rotateIntervalMs}
      />
      <RotatingColumn
        title="升温中 / Heating"
        projects={heatingProjects}
        rowsVisible={rowsVisible}
        rotateIntervalMs={rotateIntervalMs}
      />
      <RotatingColumn
        title="即将结束 / Ending soon"
        projects={endingProjects}
        rowsVisible={rowsVisible}
        rotateIntervalMs={rotateIntervalMs}
      />
    </div>
  )
}

interface RotatingColumnProps {
  title: string
  projects: Project[]
  rowsVisible: number
  rotateIntervalMs: number
}

const RotatingColumn: React.FC<RotatingColumnProps> = ({
  title,
  projects,
  rowsVisible,
  rotateIntervalMs,
}) => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // 计算距离结束时间
  const getTimeRemaining = (endAt: string) => {
    const endTime = new Date(endAt).getTime()
    const now = Date.now()
    const diff = endTime - now
    
    if (diff <= 0) return '已结束'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) {
      return `${days} 天`
    } else {
      return `${hours} 小时`
    }
  }

  // 轮动逻辑
  useEffect(() => {
    if (projects.length <= rowsVisible || isHovered) {
      return
    }

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % projects.length)
    }, rotateIntervalMs)

    return () => clearInterval(interval)
  }, [projects.length, rowsVisible, rotateIntervalMs, isHovered])

  // 获取当前可见的项目
  const getVisibleProjects = () => {
    if (projects.length <= rowsVisible) {
      return projects
    }

    const visible = []
    for (let i = 0; i < rowsVisible; i++) {
      const index = (currentIndex + i) % projects.length
      visible.push(projects[index])
    }
    return visible
  }

  const visibleProjects = getVisibleProjects()

  return (
    <div 
      className="card p-3 h-full flex flex-col bg-white/80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-xs font-semibold mb-2 text-gray-700">{title}</div>
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        {visibleProjects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => navigate(`/accelerator/projects/${project.id}`)}
          >
            {/* 左侧：头像 + 名称 + 阶段 */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                <span className="text-xs font-semibold text-gray-500">
                  {project.name.slice(0, 1).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-gray-900 truncate">
                  {project.name}
                </div>
                <div className="text-[11px] text-gray-400 truncate">
                  {project.chain} · {stageLabel[project.stage]}
                </div>
              </div>
            </div>

            {/* 中间：指标 */}
            <div className="flex flex-col items-end mr-2 flex-shrink-0">
              <div className="text-[11px] text-gray-500">
                已筹 ${project.raisedUsd.toFixed(2)}
              </div>
              <div className="text-[11px] text-gray-400">
                支持 {project.supporters} 人
              </div>
              <div className="text-[10px] text-orange-500">
                距离结束: {getTimeRemaining(project.createdAt)}
              </div>
            </div>

            {/* 右侧按钮 */}
            <button
              className="btn btn-primary btn-xs flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/accelerator/projects/${project.id}`)
              }}
            >
              支持
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}