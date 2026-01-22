import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, TrendingDown, TrendingUp } from 'lucide-react'
import { Project } from '../types'
import { VideoModal } from './VideoModal'

interface ProjectCardProps {
  project: Project
}

const formatSignedPercent = (value: number) => {
  const abs = Math.abs(value)
  const fixed = abs >= 10 ? abs.toFixed(1) : abs.toFixed(2)
  return `${value >= 0 ? '+' : ''}${fixed}%`
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate()
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'idea':
        return 'bg-yellow-100 text-yellow-800'
      case 'mvp':
        return 'bg-blue-100 text-blue-800'
      case 'live':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStageText = (stage: string) => {
    switch (stage) {
      case 'idea':
        return 'Idea'
      case 'mvp':
        return 'MVP'
      case 'live':
        return '已上线'
      default:
        return stage
    }
  }

  return (
    <>
      <div className='card-hover p-6'>
        {/* 顶部：项目名称和阶段标签 */}
        <div className='flex items-center justify-between mb-4'>
          <div className='min-w-0'>
            <div className='flex items-center gap-2 min-w-0'>
              <h3 className='text-lg font-semibold text-gray-900 truncate'>
                {project.name}
              </h3>

              {typeof project.heatScore === 'number' && (
                <span className='inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200'>
                  <Flame className='w-3 h-3' />
                  {project.heatScore.toFixed(0)}
                </span>
              )}

              {typeof project.change24h === 'number' &&
                project.change24h !== 0 && (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      project.change24h >= 0
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {project.change24h >= 0 ? (
                      <TrendingUp className='w-3 h-3' />
                    ) : (
                      <TrendingDown className='w-3 h-3' />
                    )}
                    {formatSignedPercent(project.change24h)}
                  </span>
                )}

              {project.signals?.map((s: string) => (
                <span
                  key={s}
                  className='text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200'
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(project.stage)}`}
          >
            {getStageText(project.stage)}
          </span>
        </div>

        {/* 中间：一句话简介 */}
        <p className='text-gray-600 mb-4 line-clamp-2'>{project.tagline}</p>

        {/* 信息区 */}
        <div className='text-sm text-gray-500 space-y-1 mb-4'>
          <div>链 / Chain: {project.chain}</div>
          <div>👥 支持人数：{project.supporters}</div>
          <div>$ 已筹：${project.raisedUsd}</div>
        </div>

        {/* 底部按钮 */}
        <div className='flex gap-2'>
          <button
            onClick={() => navigate(`/accelerator/projects/${project.id}`)}
            className='btn btn-primary flex-1'
          >
            详情 / 支持 1 美元
          </button>

          {project.hasVideo && (
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className='btn btn-secondary'
            >
              演示视频
            </button>
          )}
        </div>
      </div>

      {/* 视频弹窗 */}
      {project.hasVideo && project.videoUrl && (
        <VideoModal
          videoUrl={project.videoUrl}
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
        />
      )}
    </>
  )
}

export default ProjectCard
