import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react'

type Project = {
  id: string
  name: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  submitter: string
  submitTime: string
  votes: number
  funding: number
}

const mockProjects: Project[] = [
  {
    id: 'liqpass',
    name: 'LiqPass',
    description: 'AI量化交易风险管理系统',
    status: 'approved',
    submitter: 'zms',
    submitTime: '2024-01-15 10:30',
    votes: 156,
    funding: 156
  },
  {
    id: 'ai-quant-bot',
    name: 'AI量化机器人',
    description: '基于深度学习的量化交易策略',
    status: 'pending',
    submitter: 'quant_team',
    submitTime: '2024-01-16 14:20',
    votes: 0,
    funding: 0
  },
  {
    id: 'defi-protocol',
    name: 'DeFi协议优化',
    description: '优化现有DeFi协议的流动性机制',
    status: 'rejected',
    submitter: 'defi_dev',
    submitTime: '2024-01-14 09:15',
    votes: 0,
    funding: 0
  }
]

export const AdminProjectsPage: React.FC = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const filteredProjects = projects.filter(project => 
    filter === 'all' || project.status === filter
  )

  const handleApprove = (projectId: string) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, status: 'approved' } : project
    ))
  }

  const handleReject = (projectId: string) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, status: 'rejected' } : project
    ))
  }

  const handleDelete = (projectId: string) => {
    setProjects(projects.filter(project => project.id !== projectId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '已通过'
      case 'pending': return '待审核'
      case 'rejected': return '已拒绝'
      default: return '未知'
    }
  }

  const stats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'pending').length,
    approved: projects.filter(p => p.status === 'approved').length,
    rejected: projects.filter(p => p.status === 'rejected').length
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-secondary inline-flex items-center space-x-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              返回
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              项目管理 · Admin Panel
            </h1>
            <p className="text-gray-600 mt-2">
              审核和管理提交的项目申请
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">总项目数</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">待审核</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">已通过</div>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">已拒绝</div>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            全部 ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
          >
            待审核 ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
          >
            已通过 ({stats.approved})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
          >
            已拒绝 ({stats.rejected})
          </button>
        </div>

        {/* Projects Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    项目信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    提交信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    数据统计
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500">{project.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.submitter}</div>
                      <div className="text-sm text-gray-500">{project.submitTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">投票: {project.votes}</div>
                      <div className="text-sm text-gray-500">资金: ${project.funding}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/accelerator/projects/${project.id}`)}
                          className="btn btn-secondary inline-flex items-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          查看
                        </button>
                        {project.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(project.id)}
                              className="btn btn-primary inline-flex items-center space-x-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              通过
                            </button>
                            <button
                              onClick={() => handleReject(project.id)}
                              className="btn btn-secondary inline-flex items-center space-x-1"
                            >
                              <XCircle className="h-3 w-3" />
                              拒绝
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="btn btn-secondary inline-flex items-center space-x-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'all' ? '暂无项目' : `暂无${getStatusText(filter)}的项目`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' ? '还没有项目提交申请' : `当前没有${getStatusText(filter)}的项目`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProjectsPage