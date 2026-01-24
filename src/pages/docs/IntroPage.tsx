import React from 'react'

const IntroPage: React.FC = () => {
  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <h1 className='text-3xl font-bold mb-6'>项目介绍</h1>
      
      <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-6'>
        <p className='text-lg font-medium'>1 美元预测市场，把注意力变成价格信号</p>
      </div>
      
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-3'>解决的问题</h2>
        <ul className='list-disc pl-6 space-y-2'>
          <li>信息过载：在海量信息中难以筛选有价值的内容</li>
          <li>零成本口嗨：缺乏对观点的有效验证机制</li>
        </ul>
      </section>
      
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-3'>核心功能</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-white p-4 rounded-lg shadow-md'>
            <h3 className='font-medium mb-2'>Yes/No 参与</h3>
            <p className='text-sm text-gray-600'>用户只需 1 美元即可参与预测市场</p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-md'>
            <h3 className='font-medium mb-2'>价格=概率</h3>
            <p className='text-sm text-gray-600'>市场价格反映事件发生的概率</p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-md'>
            <h3 className='font-medium mb-2'>趋势/验证信号</h3>
            <p className='text-sm text-gray-600'>提供可量化的趋势和验证信号</p>
          </div>
        </div>
      </section>
      
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-3'>目标用户</h2>
        <ul className='list-disc pl-6 space-y-2'>
          <li>普通用户：参与预测，获取收益</li>
          <li>项目方：获取早期反馈和市场验证</li>
          <li>资助方：筛选有潜力的项目</li>
        </ul>
      </section>
      
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-3'>为什么重要</h2>
        <p className='mb-4'>创建公开、抗噪声、可量化的早期筛选层，帮助用户在信息过载的环境中做出更明智的决策。</p>
      </section>
      
      <section>
        <h2 className='text-xl font-semibold mb-3'>当前进展</h2>
        <ul className='list-disc pl-6 space-y-2'>
          <li>Demo 跑通：核心功能已实现</li>
          <li>开源仓库：代码已开源，欢迎贡献</li>
        </ul>
      </section>
    </div>
  )
}

export default IntroPage
