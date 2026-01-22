import React from 'react'
import { X } from 'lucide-react'

interface VideoModalProps {
  videoUrl: string
  isOpen: boolean
  onClose: () => void
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, isOpen, onClose }) => {
  if (!isOpen) return null

  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')

  const renderVideo = () => {
    if (isYouTube) {
      // 提取YouTube视频ID
      const videoId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] || ''
      return (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      )
    } else {
      return (
        <video
          controls
          autoPlay
          className="w-full h-full"
        >
          <source src={videoUrl} type="video/mp4" />
          您的浏览器不支持视频播放。
        </video>
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl aspect-video relative">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="w-full h-full rounded-lg overflow-hidden">
          {renderVideo()}
        </div>
      </div>
    </div>
  )
}

export default VideoModal