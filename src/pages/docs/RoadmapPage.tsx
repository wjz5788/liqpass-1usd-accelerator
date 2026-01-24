import React from 'react'

const RoadmapPage: React.FC = () => {
  const roadmap = [
    {
      phase: 'Phase 1: Foundation (Q1 2026)',
      items: [
        '完成基础功能开发',
        '实现 1 美元预测市场核心机制',
        '搭建前端界面和后端服务',
        '完成智能合约开发和测试',
        '开源代码库'
      ]
    },
    {
      phase: 'Phase 2: Growth (Q2 2026)',
      items: [
        '上线主网',
        '优化用户体验',
        '增加更多预测市场类型',
        '引入流动性激励机制',
        '建立社区治理框架'
      ]
    },
    {
      phase: 'Phase 3: Expansion (Q3-Q4 2026)',
      items: [
        '支持多链部署',
        '引入更多数据源',
        '开发 API 和 SDK',
        '建立生态合作伙伴关系',
        '推出移动端应用'
      ]
    }
  ]

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <h1 className='text-3xl font-bold mb-8'>路线图</h1>
      
      <div className='space-y-8'>
        {roadmap.map((phase, index) => (
          <div key={index} className='bg-white p-6 rounded-lg shadow-md border border-gray-100'>
            <h2 className='text-xl font-semibold mb-4 text-blue-600'>{phase.phase}</h2>
            
            <ul className='space-y-3'>
              {phase.items.map((item, itemIndex) => (
                <li key={itemIndex} className='flex items-start'>
                  <div className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3'>
                    <div className='w-2 h-2 rounded-full bg-blue-600'></div>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className='mt-12 bg-blue-50 p-6 rounded-lg border border-blue-100'>
        <h2 className='text-lg font-semibold mb-3 text-blue-800'>开放贡献</h2>
        <p className='mb-4'>我们欢迎社区成员参与项目开发，共同推动 1 美元预测市场的发展。</p>
        <a 
          href='https://github.com/wjz5788/liqpass-1usd-accelerator' 
          target='_blank' 
          rel='noopener noreferrer' 
          className='inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        >
          查看 GitHub 仓库
          <svg className='w-4 h-4 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default RoadmapPage
