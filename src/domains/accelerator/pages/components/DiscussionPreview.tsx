import React from 'react'
import { MessageCircle, User, Heart } from 'lucide-react'

interface Comment {
  id: string
  author: string
  role: string
  content: string
  likes: number
  timestamp: string
}

interface DiscussionPreviewProps {
  _projectId: string
}

// Mock comments - 将来接真实 API
const mockComments: Comment[] = [
  {
    id: '1',
    author: '玩家 A',
    role: '早期支持者',
    content: '这个项目的透明度做得很好，每一笔资金流向都能看到。期待后续发展！',
    likes: 12,
    timestamp: '2024-01-20',
  },
  {
    id: '2',
    author: '长期持票者',
    role: '持有 15 票',
    content:
      '已经拿回 1.3x 了，虽然不多但感觉很稳。如果真能拿到黑客松奖金就更好了。',
    likes: 8,
    timestamp: '2024-01-19',
  },
  {
    id: '3',
    author: '路过观察者',
    role: '新用户',
    content: '机制挺有意思的，1 美元门槛很低，准备试试看。',
    likes: 5,
    timestamp: '2024-01-18',
  },
]

export const DiscussionPreview: React.FC<DiscussionPreviewProps> = ({
  _projectId,
}) => {
  // TODO: Use projectId to fetch real comments from API

  return (
    <div className='card p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-2'>
          <MessageCircle className='h-6 w-6 text-purple-600' />
          <h2 className='text-xl font-bold text-gray-900'>
            社区讨论 / Discussion
          </h2>
        </div>
        <span className='text-sm text-gray-500'>
          {mockComments.length} 条评论
        </span>
      </div>

      {/* Comments */}
      <div className='space-y-4 mb-6'>
        {mockComments.map(comment => (
          <div
            key={comment.id}
            className='p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-smooth'
          >
            <div className='flex items-start space-x-3'>
              <div className='flex-shrink-0'>
                <div className='w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center'>
                  <User className='h-5 w-5 text-white' />
                </div>
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex items-center space-x-2 mb-1'>
                  <span className='font-semibold text-gray-900'>
                    {comment.author}
                  </span>
                  <span className='text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full'>
                    {comment.role}
                  </span>
                </div>

                <p className='text-sm text-gray-700 mb-2'>{comment.content}</p>

                <div className='flex items-center space-x-4 text-xs text-gray-500'>
                  <span>{comment.timestamp}</span>
                  <button className='flex items-center space-x-1 hover:text-red-500 transition-colors'>
                    <Heart className='h-3 w-3' />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button className='btn btn-primary w-full flex items-center justify-center space-x-2'>
        <MessageCircle className='h-4 w-4' />
        <span>加入讨论区</span>
      </button>

      <p className='text-xs text-gray-500 text-center mt-3'>
        未来将接入 Discord / Telegram 社区
      </p>
    </div>
  )
}

export default DiscussionPreview
