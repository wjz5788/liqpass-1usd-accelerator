import React from 'react';
import { MessageSquare, ThumbsUp, MoreHorizontal } from 'lucide-react';

interface DiscussionPreviewProps {
  _projectId: string;
}

export const DiscussionPreview: React.FC<DiscussionPreviewProps> = () => {
  // Mock discussions
  const comments = [
    {
      id: 1,
      user: '0x12...34A',
      avatar: 'https://picsum.photos/40/40?random=1',
      text: '这个项目的清算保护机制看起来很创新，期待 MVP 上线测试。',
      likes: 12,
      time: '2h ago'
    },
    {
      id: 2,
      user: 'CryptoFan_99',
      avatar: 'https://picsum.photos/40/40?random=2',
      text: '团队在 GitHub 上的提交频率很高，感觉是在做事。',
      likes: 8,
      time: '5h ago'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 shadow-md rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-900">社区讨论</h3>
        </div>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View all</button>
      </div>

      <div className="divide-y divide-slate-100">
        {comments.map((comment) => (
          <div key={comment.id} className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-start gap-3">
              <img src={comment.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-slate-200" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-800">{comment.user}</span>
                  <span className="text-xs text-slate-400">{comment.time}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">{comment.text}</p>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {comment.likes}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors">
                        Reply
                    </button>
                    <button className="ml-auto text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="relative">
            <input 
                type="text" 
                placeholder="参与讨论..." 
                className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <MessageSquare className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};