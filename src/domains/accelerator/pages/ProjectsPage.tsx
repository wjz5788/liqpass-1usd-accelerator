import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Project {
  id: string
  title: string
  description: string
  totalVolume: number
  participants: number
  status: 'active' | 'completed' | 'upcoming'
  tag: string
  image?: string
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'AI 驱动的链上数据分析工具',
    description: '为 DeFi 协议提供实时数据分析和风险预警',
    totalVolume: 12500,
    participants: 3125,
    status: 'active',
    tag: 'AI/数据',
  },
  {
    id: '2',
    title: '去中心化社交协议',
    description: '基于区块链的社交媒体平台，用户拥有数据所有权',
    totalVolume: 8900,
    participants: 2225,
    status: 'active',
    tag: 'SocialFi',
  },
  {
    id: '3',
    title: '跨链流动性聚合器',
    description: '整合多条链的流动性，提供最优交易路径',
    totalVolume: 15600,
    participants: 3900,
    status: 'completed',
    tag: 'DeFi',
  },
  {
    id: '4',
    title: 'NFT 租赁协议',
    description: '让 NFT 持有者可以通过租赁获得收益',
    totalVolume: 6700,
    participants: 1675,
    status: 'upcoming',
    tag: 'NFT',
  },
]

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate()

  const handleProjectClick = (projectId: string) => {
    navigate(`/accelerator/projects/${projectId}`)
  }

  const handleSupportProject = (e: React.MouseEvent, _projectId: string) => {
    e.stopPropagation()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <button
              onClick={() => navigate('/accelerator')}
              className='inline-flex items-center text-sm text-gray-500 hover:text-gray-700'
            >
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              返回加速器
            </button>
          </div>

          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            🚀 项目区 · Projects
          </h1>
          <p className='text-gray-600'>
            1U 不是纯彩票，而是投向一个个具体项目，帮他们验证市场、拉早期用户。
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <div className='rounded-xl bg-white p-4 border border-gray-200'>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              总项目数
            </p>
            <p className='text-lg font-semibold text-gray-900'>
              {mockProjects.length}
            </p>
          </div>
          <div className='rounded-xl bg-white p-4 border border-gray-200'>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              活跃项目
            </p>
            <p className='text-lg font-semibold text-gray-900'>
              {mockProjects.filter(p => p.status === 'active').length}
            </p>
          </div>
          <div className='rounded-xl bg-white p-4 border border-gray-200'>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              总筹资额
            </p>
            <p className='text-lg font-semibold text-gray-900'>
              $
              {mockProjects
                .reduce((sum, p) => sum + p.totalVolume, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className='rounded-xl bg-white p-4 border border-gray-200'>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              参与人数
            </p>
            <p className='text-lg font-semibold text-gray-900'>
              {mockProjects
                .reduce((sum, p) => sum + p.participants, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className='grid gap-4 md:grid-cols-2'>
          {mockProjects.map(project => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className='rounded-2xl border border-gray-200 bg-white p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 cursor-pointer'
            >
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(project.status)}`}
                  >
                    {project.status === 'active' && '进行中'}
                    {project.status === 'completed' && '已完成'}
                    {project.status === 'upcoming' && '即将开始'}
                  </span>
                  <span className='text-xs text-gray-500'>{project.tag}</span>
                </div>

                <h3 className='text-sm font-semibold text-gray-900 mb-2'>
                  {project.title}
                </h3>
                <p className='text-xs text-gray-600 mb-3'>
                  {project.description}
                </p>

                <div className='flex items-center gap-4 text-xs text-gray-600'>
                  <div>
                    <p className='text-gray-400'>本期筹集</p>
                    <p className='font-semibold'>
                      ${project.totalVolume.toLocaleString()} / 目标 TBD
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-400'>支持人数</p>
                    <p className='font-semibold'>
                      {project.participants.toLocaleString()} 人
                    </p>
                  </div>
                </div>
              </div>

              <div className='mt-4 flex gap-2'>
                <button
                  onClick={e => handleSupportProject(e, project.id)}
                  className='inline-flex flex-1 items-center justify-center rounded-xl border border-green-500 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-100'
                >
                  用 1U 支持
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                  }}
                  className='inline-flex flex-1 items-center justify-center rounded-xl bg-gray-100 px-3 py-2 text-xs font-medium hover:bg-gray-200'
                >
                  查看项目结果页
                </button>
              </div>
            </div>
          ))}

          {/* Submit New Project */}
          <div className='rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 flex flex-col justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-900 mb-2'>
                想把自己的项目丢进来试水？
              </p>
              <p className='text-xs text-gray-500 mb-4'>
                提交网站 + 3 秒短视频，我们用 1U
                门票帮你做一轮快速实验：有没有人愿意掏 1U 投你。
              </p>
            </div>
            <button
              onClick={() => navigate('/accelerator/submit-project')}
              className='inline-flex items-center justify-center rounded-xl border border-gray-400 px-3 py-2 text-xs font-medium hover:bg-gray-100'
            >
              提交新项目
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage
