import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, ExternalLink } from 'lucide-react'
import type { ProjectShort, ProjectStage } from './types'

// 模拟短视频数据
const mockShorts: ProjectShort[] = [
  {
    projectId: 'liqpass',
    projectName: 'LiqPass 爆仓保',
    stage: 'mvp',
    chain: 'Base',
    thumbnailUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=600&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/example1'
  },
  {
    projectId: 'quantbot',
    projectName: 'QuantBot AI',
    stage: 'idea',
    chain: 'Solana',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/example2'
  },
  {
    projectId: 'defi-protocol',
    projectName: 'DeFi Protocol',
    stage: 'live',
    chain: 'Arbitrum',
    thumbnailUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=600&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/example3'
  },
  {
    projectId: 'nft-marketplace',
    projectName: 'NFT Marketplace',
    stage: 'mvp',
    chain: 'Base',
    thumbnailUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=600&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/example4'
  },
  {
    projectId: 'ai-trading',
    projectName: 'AI Trading Bot',
    stage: 'idea',
    chain: 'BNB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/example5'
  },
  {
    projectId: 'web3-social',
    projectName: 'Web3 Social',
    stage: 'live',
    chain: 'Arbitrum',
    thumbnailUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=600&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/example6'
  }
]

const chains = ['All', 'Base', 'Arbitrum', 'Solana', 'BNB', 'Not yet']
const stages = ['All', 'Idea', 'MVP', 'Live']

const stageMap: Record<string, ProjectStage> = {
  'Idea': 'idea',
  'MVP': 'mvp',
  'Live': 'live'
}

const stageColors = {
  idea: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  mvp: 'bg-blue-100 text-blue-800 border-blue-300',
  live: 'bg-green-100 text-green-800 border-green-300'
}

const stageLabels = {
  idea: 'Idea',
  mvp: 'MVP',
  live: 'Live'
}

export const ShortsWallPage: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState('All')
  const [selectedStage, setSelectedStage] = useState('All')
  const [selectedVideo, setSelectedVideo] = useState<ProjectShort | null>(null)
  const navigate = useNavigate()

  const filteredShorts = mockShorts.filter(short => {
    const chainMatch = selectedChain === 'All' || short.chain === selectedChain
    const stageMatch = selectedStage === 'All' || short.stage === stageMap[selectedStage]
    return chainMatch && stageMatch
  })

  const openVideoModal = (short: ProjectShort) => {
    setSelectedVideo(short)
  }

  const closeVideoModal = () => {
    setSelectedVideo(null)
  }

  const goToProjectPage = () => {
    if (selectedVideo) {
      navigate(`/accelerator/projects/${selectedVideo.projectId}`)
      closeVideoModal()
    }
  }

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/)([^\s&]+)/)
    return match ? match[1] : null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-secondary inline-flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              返回
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                挑战赛短视频墙 · Shorts Wall
              </h1>
              <p className="text-gray-600">
                观看 1 美元加速器项目的 3-5 秒短视频
              </p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                链 / Chain
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
              >
                {chains.map(chain => (
                  <option key={chain} value={chain}>{chain}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                阶段 / Stage
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
              >
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Video Wall */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShorts.map(short => {
            const youtubeId = extractYouTubeId(short.videoUrl)
            const thumbnailUrl = youtubeId 
              ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
              : short.thumbnailUrl

            return (
              <div 
                key={short.projectId}
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => openVideoModal(short)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-[9/16] bg-gray-200">
                  <img
                    src={thumbnailUrl}
                    alt={short.projectName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=600&fit=crop'
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                      <Play className="h-6 w-6 text-gray-900" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {short.projectName}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-xs border ${stageColors[short.stage]}`}>
                      {stageLabels[short.stage]}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div>{short.chain}</div>
                    <div className="flex items-center space-x-1">
                      <Play className="h-3 w-3" />
                      <div>观看</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredShorts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">没有找到匹配的视频</div>
            <p className="text-gray-400 mt-2">尝试调整筛选条件</p>
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                {extractYouTubeId(selectedVideo.videoUrl) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(selectedVideo.videoUrl)}?autoplay=1`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={selectedVideo.videoUrl}
                    className="w-full h-full"
                    controls
                    autoPlay
                  />
                )}
                
                {/* Close Button */}
                <button
                  onClick={closeVideoModal}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
                >
                  关闭
                </button>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedVideo.projectName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className={`px-2 py-1 rounded-full border ${stageColors[selectedVideo.stage]}`}>
                        {stageLabels[selectedVideo.stage]}
                      </div>
                      <div>{selectedVideo.chain}</div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={goToProjectPage}
                  className="btn btn-primary w-full inline-flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  去项目页面
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShortsWallPage